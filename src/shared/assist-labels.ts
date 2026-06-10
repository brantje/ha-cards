import type { AssistProcessModel } from "./assist-pipeline";

export type AssistLoadingStage =
  | "ready"
  | "stt"
  | "intent"
  | "tts"
  | "done"
  | "error"
  | "wake_word";

export type AssistChatMessageStatus =
  | "pending"
  | "listening"
  | "waiting"
  | "thinking"
  | "preparing"
  | "streaming"
  | "done"
  | "cancelled"
  | "error";

export type AssistStageLabelOptions = {
  localize?: (key: string) => string;
  fallbacks?: Partial<Record<AssistLoadingStage | "waiting" | "processing", string>>;
};

const DEFAULT_STAGE_LABELS: Record<string, string> = {
  stt: "Listening...",
  intent: "Thinking...",
  tts: "Preparing reply...",
  waiting: "Waiting for reply...",
  processing: "Processing...",
};

const STAGE_HA_KEYS: Partial<Record<AssistLoadingStage | "waiting" | "processing", string>> = {
  stt: "ui.card.voice_assist.listening",
  intent: "ui.card.voice_assist.thinking",
  tts: "ui.card.voice_assist.preparing",
};

const MESSAGE_STATUS_LABELS: Record<AssistChatMessageStatus, string> = {
  pending: "",
  listening: "Listening...",
  waiting: "Waiting for reply...",
  thinking: "Thinking...",
  preparing: "Preparing reply...",
  streaming: "",
  done: "",
  cancelled: "Cancelled",
  error: "",
};

export function getAssistStageLoadingLabel(
  stage: AssistLoadingStage | AssistProcessModel["stage"],
  options: AssistStageLabelOptions = {}
): string {
  const { localize, fallbacks = {} } = options;

  if (stage === "stt") {
    return localize?.(STAGE_HA_KEYS.stt || "") || fallbacks.stt || DEFAULT_STAGE_LABELS.stt;
  }

  if (stage === "intent") {
    return localize?.(STAGE_HA_KEYS.intent || "") || fallbacks.intent || DEFAULT_STAGE_LABELS.intent;
  }

  if (stage === "tts") {
    return localize?.(STAGE_HA_KEYS.tts || "") || fallbacks.tts || DEFAULT_STAGE_LABELS.tts;
  }

  return fallbacks.processing || DEFAULT_STAGE_LABELS.processing;
}

export function getAssistWaitingLabel(options: AssistStageLabelOptions = {}): string {
  const { localize, fallbacks = {} } = options;
  return fallbacks.waiting || DEFAULT_STAGE_LABELS.waiting;
}

export function assistMessageStatusToLabel(
  status: AssistChatMessageStatus,
  fallbacks?: Partial<Record<AssistChatMessageStatus, string>>
): string {
  return fallbacks?.[status] ?? MESSAGE_STATUS_LABELS[status] ?? "";
}

export function assistProcessStageToMessageStatus(
  stage: AssistProcessModel["stage"],
  isListening: boolean
): AssistChatMessageStatus {
  if (isListening) {
    return "listening";
  }

  if (stage === "intent") {
    return "thinking";
  }

  if (stage === "tts") {
    return "preparing";
  }

  return "waiting";
}
