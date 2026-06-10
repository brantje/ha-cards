import { hasMeaningfulAudio } from "../../shared/assist-audio-recorder";
import { MicVisualizerLoop } from "../../shared/assist-mic-visualizer";
import type { HomeAssistant } from "custom-card-helpers";

const REMOTE_POLL_MS = 500;
const REMOTE_SAFETY_TIMEOUT_MS = 120_000;

export type RemoteTtsPlaybackState = {
  sawPlaying: boolean;
  initialState: string | null;
  initialContentId: string | null;
};

export type RemoteTtsPlaybackStep = "continue" | "started" | "complete";

export function buildAssistTtsMediaUrl(url: string): string {
  return new URL(url, window.location.origin).toString();
}

export function checkRemoteTtsPlayback(
  state: RemoteTtsPlaybackState,
  playerState: string | undefined,
  mediaContentId: string | null | undefined
): { state: RemoteTtsPlaybackState; step: RemoteTtsPlaybackStep } {
  const isActive = playerState === "playing" || playerState === "buffering";

  if (!state.sawPlaying) {
    if (!isActive) {
      return { state, step: "continue" };
    }

    const wasAlreadyActive =
      state.initialState === "playing" || state.initialState === "buffering";
    if (wasAlreadyActive && mediaContentId === state.initialContentId) {
      return { state, step: "continue" };
    }

    return {
      state: { ...state, sawPlaying: true },
      step: "started",
    };
  }

  if (!isActive) {
    return { state, step: "complete" };
  }

  if (state.initialContentId && mediaContentId === state.initialContentId) {
    return { state, step: "complete" };
  }

  return { state, step: "continue" };
}

export class AssistChatAudioController {
  private audio?: HTMLAudioElement;
  private micVisualizer?: MicVisualizerLoop;
  private remoteTarget?: string;
  private remotePlaying = false;
  private remoteState: RemoteTtsPlaybackState = {
    sawPlaying: false,
    initialState: null,
    initialContentId: null,
  };
  private remotePollTimer?: number;
  private remoteSafetyTimer?: number;
  private remoteHass?: HomeAssistant;

  constructor(private readonly onAudioEnded: () => void) {}

  getAudioElement() {
    return this.audio;
  }

  isPlaying() {
    return Boolean(this.audio || this.remotePlaying);
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

  playTts(
    hass: HomeAssistant | undefined,
    url: string | undefined,
    enabled: boolean,
    ttsMediaPlayer?: string
  ) {
    if (!url || !enabled) {
      return;
    }

    if (ttsMediaPlayer) {
      this.playRemote(hass, url, ttsMediaPlayer);
      return;
    }

    this.playLocal(url);
  }

  unload(hass?: HomeAssistant) {
    this.stopRemote(hass);
    this.stopLocal();
  }

  private playLocal(url: string) {
    this.stopRemote();
    this.stopLocal();

    this.audio = new Audio(buildAssistTtsMediaUrl(url));
    this.audio.addEventListener("ended", this.handleAudioEnded);
    this.audio.addEventListener("pause", this.handleUnload);
    this.audio.play().catch(() => {
      this.stopLocal();
    });
  }

  private playRemote(hass: HomeAssistant | undefined, url: string, entityId: string) {
    this.stopRemote();
    this.stopLocal();

    if (!hass) {
      return;
    }

    const entity = hass.states?.[entityId];
    this.remoteTarget = entityId;
    this.remotePlaying = true;
    this.remoteHass = hass;
    this.remoteState = {
      sawPlaying: false,
      initialState: entity?.state ?? null,
      initialContentId: entity?.attributes?.media_content_id ?? null,
    };

    const mediaContentId = buildAssistTtsMediaUrl(url);
    void hass
      .callService("media_player", "play_media", {
        entity_id: entityId,
        media_content_id: mediaContentId,
        media_content_type: "music",
        announce: true,
      })
      .catch(() => {
        this.completeRemotePlayback();
      });

    this.remotePollTimer = window.setInterval(() => {
      this.pollRemotePlayback();
    }, REMOTE_POLL_MS);

    this.remoteSafetyTimer = window.setTimeout(() => {
      this.completeRemotePlayback();
    }, REMOTE_SAFETY_TIMEOUT_MS);
  }

  private pollRemotePlayback() {
    if (!this.remotePlaying || !this.remoteTarget) {
      return;
    }

    const entity = this.remoteHass?.states?.[this.remoteTarget];
    if (!entity) {
      return;
    }

    const { state, step } = checkRemoteTtsPlayback(
      this.remoteState,
      entity.state,
      entity.attributes?.media_content_id
    );
    this.remoteState = state;

    if (step === "complete") {
      this.completeRemotePlayback();
    }
  }

  private completeRemotePlayback() {
    if (!this.remotePlaying) {
      return;
    }

    this.clearRemoteTimers();
    this.remoteTarget = undefined;
    this.remotePlaying = false;
    this.remoteHass = undefined;
    this.remoteState = {
      sawPlaying: false,
      initialState: null,
      initialContentId: null,
    };
    this.onAudioEnded();
  }

  private stopRemote(hass?: HomeAssistant) {
    const entityId = this.remoteTarget;
    this.clearRemoteTimers();
    this.remoteTarget = undefined;
    this.remotePlaying = false;
    this.remoteHass = undefined;
    this.remoteState = {
      sawPlaying: false,
      initialState: null,
      initialContentId: null,
    };

    if (!entityId) {
      return;
    }

    const activeHass = hass || this.remoteHass;
    if (!activeHass) {
      return;
    }

    void activeHass.callService("media_player", "media_stop", {
      entity_id: entityId,
    });
  }

  private clearRemoteTimers() {
    if (this.remotePollTimer !== undefined) {
      window.clearInterval(this.remotePollTimer);
      this.remotePollTimer = undefined;
    }

    if (this.remoteSafetyTimer !== undefined) {
      window.clearTimeout(this.remoteSafetyTimer);
      this.remoteSafetyTimer = undefined;
    }
  }

  private stopLocal() {
    if (!this.audio) {
      return;
    }

    this.audio.removeEventListener("ended", this.handleAudioEnded);
    this.audio.removeEventListener("pause", this.handleUnload);
    this.audio.pause();
    this.audio.removeAttribute("src");
    this.audio = undefined;
  }

  private handleAudioEnded = () => {
    this.stopLocal();
    this.onAudioEnded();
  };

  private handleUnload = () => {
    this.stopLocal();
  };
}
