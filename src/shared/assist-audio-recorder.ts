export type AudioChunkCallback = (chunk: Int16Array) => void;

/** Default normalized RMS above typical room noise with AGC enabled. */
export const DEFAULT_SPEECH_RMS_THRESHOLD = 0.01;
/** Normalized peak for consonants that may sit below the RMS threshold. */
const SPEECH_PEAK_THRESHOLD = 0.02;

export function getInt16ChunkAudioLevels(chunk: Int16Array) {
  if (!chunk.length) {
    return { rms: 0, peak: 0 };
  }

  let sumSquares = 0;
  let peak = 0;

  for (let index = 0; index < chunk.length; index += 1) {
    const normalized = Math.abs(chunk[index]) / 32768;
    peak = Math.max(peak, normalized);
    sumSquares += normalized * normalized;
  }

  return {
    rms: Math.sqrt(sumSquares / chunk.length),
    peak,
  };
}

export function hasMeaningfulAudio(
  chunk: Int16Array,
  rmsThreshold = DEFAULT_SPEECH_RMS_THRESHOLD
) {
  if (!chunk.length) {
    return false;
  }

  const { rms, peak } = getInt16ChunkAudioLevels(chunk);
  return rms >= rmsThreshold || peak >= SPEECH_PEAK_THRESHOLD;
}

const RECORDER_WORKLET_SOURCE = `
class RecorderProcessor extends AudioWorkletProcessor {
  process(inputList) {
    if (!inputList[0]?.length) {
      return true;
    }

    const float32Data = inputList[0][0];
    const int16Data = new Int16Array(float32Data.length);

    for (let index = 0; index < float32Data.length; index += 1) {
      const sample = Math.max(-1, Math.min(1, float32Data[index]));
      int16Data[index] = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
    }

    this.port.postMessage(int16Data);
    return true;
  }
}

registerProcessor("assist-recorder-worklet", RecorderProcessor);
`;

export class AssistAudioRecorder {
  private audioContext?: AudioContext;
  private source?: MediaStreamAudioSourceNode;
  private analyser?: AnalyserNode;
  private processor?: ScriptProcessorNode;
  private worklet?: AudioWorkletNode;
  private stream?: MediaStream;
  private workletUrl?: string;
  private readonly onChunk: AudioChunkCallback;

  active = false;
  sampleRate?: number;

  constructor(onChunk: AudioChunkCallback) {
    this.onChunk = onChunk;
  }

  getAnalyser(): AnalyserNode | undefined {
    return this.analyser;
  }

  static isInsecureConnection() {
    const { protocol, hostname } = window.location;

    if (protocol === "https:") {
      return false;
    }

    if (
      protocol === "http:" &&
      (hostname === "localhost" || hostname === "127.0.0.1" || hostname === "[::1]")
    ) {
      return false;
    }

    if (protocol === "http:") {
      return true;
    }

    return !window.isSecureContext;
  }

  static isSupported() {
    return Boolean(
      !AssistAudioRecorder.isInsecureConnection() &&
        (window.AudioContext || (window as any).webkitAudioContext)
    );
  }

  async start() {
    if (this.active) {
      return;
    }

    if (!navigator.mediaDevices?.getUserMedia) {
      throw new DOMException(
        "Microphone access is not available in this browser.",
        "NotSupportedError"
      );
    }

    const AudioContextConstructor = window.AudioContext || (window as any).webkitAudioContext;
    this.audioContext = new AudioContextConstructor();
    this.sampleRate = this.audioContext.sampleRate;

    if (this.audioContext.state === "suspended") {
      await this.audioContext.resume();
    }

    this.stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      },
    });
    this.source = this.audioContext.createMediaStreamSource(this.stream);
    this.setupAnalyser();

    if (await this.startWorkletRecorder()) {
      this.active = true;
      return;
    }

    this.startScriptProcessorRecorder();
    this.active = true;
  }

  stop() {
    if (!this.active && !this.stream && !this.processor && !this.worklet && !this.source) {
      return;
    }

    this.active = false;
    this.processor?.disconnect();
    this.worklet?.disconnect();
    this.analyser?.disconnect();
    this.source?.disconnect();
    this.processor = undefined;
    this.worklet = undefined;
    this.analyser = undefined;
    this.source = undefined;
    this.stream?.getTracks().forEach((track) => track.stop());
    this.stream = undefined;
  }

  async close() {
    this.stop();

    if (this.audioContext && this.audioContext.state !== "closed") {
      await this.audioContext.close();
    }

    if (this.workletUrl) {
      URL.revokeObjectURL(this.workletUrl);
      this.workletUrl = undefined;
    }

    this.audioContext = undefined;
    this.sampleRate = undefined;
  }

  private setupAnalyser() {
    if (!this.audioContext || !this.source) {
      return;
    }

    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = 64;
    this.source.connect(this.analyser);
  }

  private async startWorkletRecorder() {
    if (!this.audioContext || !this.analyser || !this.audioContext.audioWorklet) {
      return false;
    }

    try {
      this.workletUrl = URL.createObjectURL(
        new Blob([RECORDER_WORKLET_SOURCE], { type: "application/javascript" })
      );
      await this.audioContext.audioWorklet.addModule(this.workletUrl);
      this.worklet = new AudioWorkletNode(this.audioContext, "assist-recorder-worklet");
      this.worklet.port.onmessage = (event) => {
        if (!this.active) {
          return;
        }

        this.onChunk(event.data);
      };
      this.analyser.connect(this.worklet);
      return true;
    } catch {
      if (this.workletUrl) {
        URL.revokeObjectURL(this.workletUrl);
        this.workletUrl = undefined;
      }

      this.worklet = undefined;
      return false;
    }
  }

  private startScriptProcessorRecorder() {
    if (!this.audioContext || !this.analyser) {
      return;
    }

    this.processor = this.audioContext.createScriptProcessor(4096, 1, 1);
    this.processor.onaudioprocess = (event) => {
      if (!this.active) {
        return;
      }

      this.onChunk(this.toInt16(event.inputBuffer.getChannelData(0)));
    };

    this.analyser.connect(this.processor);
    this.processor.connect(this.audioContext.destination);
  }

  private toInt16(samples: Float32Array) {
    const output = new Int16Array(samples.length);

    for (let index = 0; index < samples.length; index += 1) {
      const sample = Math.max(-1, Math.min(1, samples[index] || 0));
      output[index] = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
    }

    return output;
  }
}
