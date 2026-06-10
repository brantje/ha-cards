import { hasMeaningfulAudio } from "../../shared/assist-audio-recorder";
import { MicVisualizerLoop } from "../../shared/assist-mic-visualizer";
import type { HomeAssistant } from "custom-card-helpers";

export class AssistChatAudioController {
  private audio?: HTMLAudioElement;
  private micVisualizer?: MicVisualizerLoop;

  constructor(private readonly onAudioEnded: () => void) {}

  getAudioElement() {
    return this.audio;
  }

  startMicVisualizer(canvas: HTMLCanvasElement | null, getAnalyser: () => AnalyserNode | undefined) {
    if (!canvas) {
      return;
    }

    if (!this.micVisualizer) {
      this.micVisualizer = new MicVisualizerLoop();
    }

    this.micVisualizer.start(canvas, getAnalyser);
  }

  stopMicVisualizer() {
    this.micVisualizer?.stop();
  }

  sendAudioChunk(
    hass: HomeAssistant | undefined,
    chunk: Int16Array,
    sttBinaryHandlerId: number | null | undefined,
    audioBuffer: Int16Array[] | undefined,
    speechRmsThreshold: number,
    voiceInputHasSpeech: boolean,
    onSpeechDetected: () => void
  ): { buffer?: Int16Array[]; hasSpeech: boolean } {
    const isEndChunk = chunk.length === 0;
    let hasSpeech = voiceInputHasSpeech;

    if (!isEndChunk) {
      const meaningful = hasMeaningfulAudio(chunk, speechRmsThreshold);
      if (!hasSpeech && !meaningful) {
        return { buffer: audioBuffer, hasSpeech };
      }

      if (meaningful) {
        hasSpeech = true;
        onSpeechDetected();
      }
    } else if (!hasSpeech) {
      return { buffer: audioBuffer, hasSpeech };
    }

    if (sttBinaryHandlerId === undefined || sttBinaryHandlerId === null) {
      const buffer = audioBuffer ? [...audioBuffer, chunk] : [chunk];
      return { buffer, hasSpeech };
    }

    const socket = hass?.connection?.socket;
    if (!socket) {
      return { buffer: audioBuffer, hasSpeech };
    }

    socket.binaryType = "arraybuffer";
    const data = new Uint8Array(1 + chunk.length * 2);
    data[0] = sttBinaryHandlerId;
    data.set(new Uint8Array(chunk.buffer), 1);
    socket.send(data);
    return { buffer: audioBuffer, hasSpeech };
  }

  flushAudioBuffer(
    hass: HomeAssistant | undefined,
    buffer: Int16Array[] | undefined,
    sttBinaryHandlerId: number | null | undefined,
    speechRmsThreshold: number,
    onSpeechDetected: () => void,
    voiceInputHasSpeech: boolean
  ) {
    if (!buffer) {
      return;
    }

    for (const chunk of buffer) {
      this.sendAudioChunk(
        hass,
        chunk,
        sttBinaryHandlerId,
        undefined,
        speechRmsThreshold,
        voiceInputHasSpeech,
        onSpeechDetected
      );
    }
  }

  playTts(url: string | undefined, enabled: boolean) {
    if (!url || !enabled) {
      return;
    }

    this.unload();
    this.audio = new Audio(new URL(url, window.location.origin).toString());
    this.audio.addEventListener("ended", this.handleAudioEnded);
    this.audio.addEventListener("pause", this.handleUnload);
    this.audio.play().catch(() => {
      this.unload();
    });
  }

  unload = () => {
    if (!this.audio) {
      return;
    }

    this.audio.removeEventListener("ended", this.handleAudioEnded);
    this.audio.removeEventListener("pause", this.handleUnload);
    this.audio.pause();
    this.audio.removeAttribute("src");
    this.audio = undefined;
  };

  private handleAudioEnded = () => {
    this.unload();
    this.onAudioEnded();
  };

  private handleUnload = () => {
    this.unload();
  };
}
