import type { HomeAssistant } from "custom-card-helpers";
import { getLastUsedPipelineId } from "./assist-chat-storage";

export type AssistPipeline = {
  id: string;
  name: string;
  language?: string;
  conversation_engine?: string;
  conversation_language?: string | null;
  prefer_local_intents?: boolean;
  stt_engine?: string | null;
  stt_language?: string | null;
  tts_engine?: string | null;
  tts_language?: string | null;
  tts_voice?: string | null;
};

export type AssistPipelineListResponse = {
  pipelines: AssistPipeline[];
  preferred_pipeline: string | null;
};

export type AssistPipelineDebugRun = {
  pipeline_run_id: string;
  timestamp: string;
};

export type AssistPipelineDebugListResponse = {
  pipeline_runs: AssistPipelineDebugRun[];
};

export type AssistPipelineDebugGetResponse = {
  events: PipelineRunEvent[];
};

export type AssistPipelineDebugRunDetails = AssistPipelineDebugRun & {
  events: PipelineRunEvent[];
};

export type AssistToolCall = {
  id: string;
  tool_name: string;
  tool_args?: Record<string, unknown>;
  tool_result?: unknown;
};

export type AssistProcessStageKey = "stt" | "intent" | "tts";
export type AssistProcessStageStatus = "idle" | "running" | "done" | "error";

export type AssistProcessStage = {
  key: AssistProcessStageKey;
  label: string;
  status: AssistProcessStageStatus;
  started?: string;
  ended?: string;
};

export type AssistProcessModel = {
  stage: "ready" | AssistProcessStageKey | "done" | "error";
  started?: string;
  finished?: string;
  stages: Record<AssistProcessStageKey, AssistProcessStage>;
  toolCalls: AssistToolCall[];
  error?: string;
};

export type AssistConversationFromEvents = {
  userText: string;
  assistantText: string;
  thinking: string;
  toolCalls: AssistToolCall[];
  errorText: string;
  conversationId: string | null;
  process: AssistProcessModel;
};

export type AssistChatLogDelta =
  | {
      role?: "assistant";
      content?: string;
      thinking_content?: string;
      tool_calls?: AssistToolCall[];
    }
  | {
      role: "tool_result";
      agent_id?: string;
      tool_call_id: string;
      tool_name?: string;
      tool_result?: unknown;
    };

export type AssistChatLogAccumulator = {
  currentDeltaRole: string;
  assistantText: string;
  thinking: string;
  toolCalls: AssistToolCall[];
};

export function createAssistChatLogAccumulator(): AssistChatLogAccumulator {
  return {
    currentDeltaRole: "",
    assistantText: "",
    thinking: "",
    toolCalls: [],
  };
}

export function applyAssistChatLogDelta(acc: AssistChatLogAccumulator, delta: AssistChatLogDelta): void {
  if (delta.role) {
    acc.currentDeltaRole = delta.role;
  }

  if (acc.currentDeltaRole === "assistant") {
    if ("content" in delta && delta.content) {
      acc.assistantText += delta.content;
    }

    if ("thinking_content" in delta && delta.thinking_content) {
      acc.thinking += delta.thinking_content;
    }

    if ("tool_calls" in delta && Array.isArray(delta.tool_calls)) {
      acc.toolCalls = upsertAssistToolCalls(acc.toolCalls, delta.tool_calls);
    }
  } else if (
    acc.currentDeltaRole === "tool_result" &&
    "tool_call_id" in delta &&
    delta.tool_call_id
  ) {
    acc.toolCalls = upsertAssistToolCalls(acc.toolCalls, [
      {
        id: delta.tool_call_id,
        tool_name: delta.tool_name || "tool",
        tool_result: "tool_result" in delta ? delta.tool_result : undefined,
      },
    ]);
  }
}

export type PipelineRunEvent = {
  type:
    | "run-start"
    | "run-end"
    | "error"
    | "wake_word-start"
    | "wake_word-end"
    | "stt-start"
    | "stt-vad-end"
    | "stt-end"
    | "intent-start"
    | "intent-progress"
    | "intent-end"
    | "tts-start"
    | "tts-end"
    | string;
  timestamp: string;
  data?: Record<string, any>;
};

export type PipelineRunOptions = (
  | {
      start_stage: "intent" | "tts";
      input: { text: string };
    }
  | {
      start_stage: "stt";
      input: { sample_rate: number };
    }
) & {
  end_stage: "stt" | "intent" | "tts";
  pipeline?: string;
  conversation_id?: string | null;
};

export type AssistPipelineUnsubscribe = () => void;

export const DEFAULT_ASSIST_RUN_COUNT = 5;
export const MIN_ASSIST_RUN_COUNT = 0;
export const MAX_ASSIST_RUN_COUNT = 20;
export function isBuiltInConversationAgent(pipeline?: AssistPipeline): boolean {
  const engine = pipeline?.conversation_engine;
  return !engine || engine === "conversation.home_assistant";
}

export function listAssistPipelines(hass: HomeAssistant): Promise<AssistPipelineListResponse> {
  return hass.callWS<AssistPipelineListResponse>({
    type: "assist_pipeline/pipeline/list",
  });
}

export function listAssistPipelineDebugRuns(
  hass: HomeAssistant,
  pipelineId: string
): Promise<AssistPipelineDebugListResponse> {
  return hass.callWS<AssistPipelineDebugListResponse>({
    type: "assist_pipeline/pipeline_debug/list",
    pipeline_id: pipelineId,
  });
}

export function getAssistPipelineDebugRun(
  hass: HomeAssistant,
  pipelineId: string,
  runId: string
): Promise<AssistPipelineDebugGetResponse> {
  return hass.callWS<AssistPipelineDebugGetResponse>({
    type: "assist_pipeline/pipeline_debug/get",
    pipeline_id: pipelineId,
    pipeline_run_id: runId,
  });
}

/** True when a WS error indicates the user is not allowed to call the API (non-admin). */
export function isUnauthorizedWsError(error: unknown): boolean {
  const code = (error as { code?: string } | null)?.code;
  return code === "unauthorized" || code === "not_allowed" || code === "forbidden";
}

export function runAssistPipeline(
  hass: HomeAssistant,
  callback: (event: PipelineRunEvent) => void,
  options: PipelineRunOptions
): Promise<AssistPipelineUnsubscribe> {
  return hass.connection.subscribeMessage<PipelineRunEvent>(callback, {
    ...options,
    type: "assist_pipeline/run",
  });
}

export function resolvePipelineId(
  configuredPipelineId: string | undefined,
  response: AssistPipelineListResponse
): string {
  if (configuredPipelineId === "last_used") {
    const lastUsed = getLastUsedPipelineId();
    if (lastUsed && response.pipelines.some((pipeline) => pipeline.id === lastUsed)) {
      return lastUsed;
    }

    return response.preferred_pipeline || response.pipelines[0]?.id || "";
  }

  if (configuredPipelineId && configuredPipelineId !== "preferred") {
    return configuredPipelineId;
  }

  return response.preferred_pipeline || response.pipelines[0]?.id || "";
}

export function getAssistRunCount(
  count: number | undefined,
  fallback = DEFAULT_ASSIST_RUN_COUNT,
  min = MIN_ASSIST_RUN_COUNT,
  max = MAX_ASSIST_RUN_COUNT
) {
  const parsed = Number(count ?? fallback);
  return Number.isFinite(parsed) ? Math.min(Math.max(Math.round(parsed), min), max) : fallback;
}

export function getRecentAssistPipelineDebugRuns<T extends AssistPipelineDebugRun>(
  runs: T[],
  runCount = DEFAULT_ASSIST_RUN_COUNT
) {
  const count = getAssistRunCount(runCount);

  return [...runs]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, count);
}

export function createAssistProcessModel(): AssistProcessModel {
  return {
    stage: "ready",
    stages: {
      stt: { key: "stt", label: "STT", status: "idle" },
      intent: { key: "intent", label: "Intent", status: "idle" },
      tts: { key: "tts", label: "TTS", status: "idle" },
    },
    toolCalls: [],
  };
}

export function buildAssistProcessModel(events: PipelineRunEvent[]) {
  const process = createAssistProcessModel();

  for (const event of sortEventsByTimestamp(events)) {
    applyAssistProcessEvent(process, event);
  }

  return cloneAssistProcessModel(process);
}

export function extractAssistConversationFromEvents(events: PipelineRunEvent[]): AssistConversationFromEvents {
  const process = createAssistProcessModel();
  let userText = "";
  let errorText = "";
  let conversationId: string | null = null;
  const chatLog = createAssistChatLogAccumulator();

  for (const event of sortEventsByTimestamp(events)) {
    const data = event.data || {};
    applyAssistProcessEvent(process, event);

    if (event.type === "stt-end") {
      userText = extractText(data.stt_output?.text) || userText;
    } else if (event.type === "intent-start") {
      userText = extractText(data.intent_input) || userText;
    } else if (event.type === "intent-progress" && data.chat_log_delta) {
      applyAssistChatLogDelta(chatLog, data.chat_log_delta as AssistChatLogDelta);
      process.toolCalls = chatLog.toolCalls;
    } else if (event.type === "intent-end") {
      conversationId = data.intent_output?.conversation_id || conversationId;
      const speech = extractSpeechFromIntentOutput(data.intent_output);
      if (speech) {
        chatLog.assistantText = speech;
      }

      if (data.intent_output?.response?.response_type === "error") {
        errorText = chatLog.assistantText || "The assistant run failed.";
      }
    } else if (event.type === "tts-start") {
      const ttsInput = extractText(data.tts_input);
      if (ttsInput) {
        chatLog.assistantText = ttsInput;
      }
    } else if (event.type === "error") {
      errorText = extractText(data.message) || extractText(data.code) || "The assistant run failed.";
    }
  }

  return {
    userText,
    assistantText: chatLog.assistantText,
    thinking: trimAssistText(chatLog.thinking),
    toolCalls: [...process.toolCalls],
    errorText,
    conversationId,
    process: cloneAssistProcessModel(process),
  };
}

export function extractSpeechFromIntentOutput(output: any) {
  const speech =
    output?.response?.speech?.plain?.speech ||
    output?.response?.speech?.plain?.extra_data?.speech ||
    output?.response?.speech ||
    "";

  return typeof speech === "string" ? speech : "";
}

export function applyAssistProcessEvent(process: AssistProcessModel, event: PipelineRunEvent) {
  const timestamp = event.timestamp || new Date().toISOString();

  if (event.type === "run-start") {
    process.started = timestamp;
    process.stage = "ready";
  } else if (event.type === "stt-start") {
    startAssistStage(process, "stt", timestamp);
  } else if (event.type === "stt-vad-end") {
    // Match HA assist debug: STT duration is transcription after the user stops speaking.
    process.stage = "stt";
    process.stages.stt = {
      ...process.stages.stt,
      status: process.stages.stt.status === "idle" ? "running" : process.stages.stt.status,
      started: timestamp,
    };
  } else if (event.type === "stt-end") {
    endAssistStage(process, "stt", timestamp);
  } else if (event.type === "intent-start") {
    startAssistStage(process, "intent", timestamp);
  } else if (event.type === "intent-end") {
    endAssistStage(process, "intent", timestamp);
  } else if (event.type === "tts-start") {
    startAssistStage(process, "tts", timestamp);
  } else if (event.type === "tts-end") {
    endAssistStage(process, "tts", timestamp);
  } else if (event.type === "run-end") {
    process.stage = "done";
    process.finished = timestamp;
  } else if (event.type === "error") {
    process.stage = "error";
    process.finished = timestamp;
    process.error = String(event.data?.message || event.data?.code || "");
    Object.values(process.stages).forEach((stage) => {
      if (stage.status === "running") {
        stage.status = "error";
        stage.ended = timestamp;
      }
    });
  }
}

function startAssistStage(process: AssistProcessModel, key: AssistProcessStageKey, timestamp: string) {
  process.stage = key;
  process.stages[key] = {
    ...process.stages[key],
    status: "running",
    started: process.stages[key].started || timestamp,
    ended: undefined,
  };
}

function endAssistStage(process: AssistProcessModel, key: AssistProcessStageKey, timestamp: string) {
  process.stages[key] = {
    ...process.stages[key],
    status: "done",
    ended: timestamp,
  };
}

export function cloneAssistProcessModel(process: AssistProcessModel): AssistProcessModel {
  return {
    ...process,
    stages: {
      stt: { ...process.stages.stt },
      intent: { ...process.stages.intent },
      tts: { ...process.stages.tts },
    },
    toolCalls: [...process.toolCalls],
  };
}

function sortEventsByTimestamp(events: PipelineRunEvent[]) {
  return [...events].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
}

export function upsertAssistToolCalls(existing: AssistToolCall[], incoming: AssistToolCall[]) {
  const merged = [...existing];

  for (const toolCall of incoming) {
    if (!toolCall.id) {
      continue;
    }

    const index = merged.findIndex((existingToolCall) => existingToolCall.id === toolCall.id);
    if (index === -1) {
      merged.push({ ...toolCall });
      continue;
    }

    const current = merged[index];
    merged[index] = {
      ...current,
      tool_name: toolCall.tool_name || current.tool_name,
      tool_args: toolCall.tool_args ?? current.tool_args,
      tool_result: toolCall.tool_result !== undefined ? toolCall.tool_result : current.tool_result,
    };
  }

  return merged;
}

function extractText(value: unknown) {
  return typeof value === "string" ? value : "";
}

export function trimAssistText(text: string) {
  return text
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((line) => line.trimStart())
    .join("\n")
    .trim();
}

