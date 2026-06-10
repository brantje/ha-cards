import type { HomeAssistant } from "custom-card-helpers";

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
export const LAST_USED_PIPELINE_KEY = "assist-chat-card:last-used-pipeline";
export const FOLLOW_UP_HINT_DISMISSED_KEY = "assist-chat-card:follow-up-hint-dismissed";

export function getLastUsedPipelineId(): string | null {
  try {
    return window.localStorage.getItem(LAST_USED_PIPELINE_KEY);
  } catch {
    return null;
  }
}

export function setLastUsedPipelineId(pipelineId: string) {
  try {
    window.localStorage.setItem(LAST_USED_PIPELINE_KEY, pipelineId);
  } catch {
    // Ignore storage failures in restricted contexts.
  }
}

export function isFollowUpHintDismissed(): boolean {
  try {
    return window.localStorage.getItem(FOLLOW_UP_HINT_DISMISSED_KEY) === "true";
  } catch {
    return false;
  }
}

export function dismissFollowUpHint() {
  try {
    window.localStorage.setItem(FOLLOW_UP_HINT_DISMISSED_KEY, "true");
  } catch {
    // Ignore storage failures in restricted contexts.
  }
}

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

export async function fetchRecentAssistPipelineDebugRuns(
  hass: HomeAssistant,
  pipelineId: string,
  runCount = DEFAULT_ASSIST_RUN_COUNT
): Promise<AssistPipelineDebugRunDetails[]> {
  const count = getAssistRunCount(runCount);
  if (count === 0) {
    return [];
  }

  const response = await listAssistPipelineDebugRuns(hass, pipelineId);
  const recentRuns = getRecentAssistPipelineDebugRuns(response.pipeline_runs || [], count);

  return Promise.all(
    recentRuns.map(async (run) => {
      const details = await getAssistPipelineDebugRun(hass, pipelineId, run.pipeline_run_id);
      return {
        ...run,
        events: details.events || [],
      };
    })
  );
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
  let assistantText = "";
  let thinking = "";
  let errorText = "";
  let conversationId: string | null = null;
  let currentDeltaRole = "";

  for (const event of sortEventsByTimestamp(events)) {
    const data = event.data || {};
    applyAssistProcessEvent(process, event);

    if (event.type === "stt-end") {
      userText = extractText(data.stt_output?.text) || userText;
    } else if (event.type === "intent-start") {
      userText = extractText(data.intent_input) || userText;
    } else if (event.type === "intent-progress" && data.chat_log_delta) {
      const delta = data.chat_log_delta as AssistChatLogDelta;
      if (delta.role) {
        currentDeltaRole = delta.role;
      }

      if (currentDeltaRole === "assistant") {
        if ("content" in delta && delta.content) {
          assistantText += delta.content;
        }

        if ("thinking_content" in delta && delta.thinking_content) {
          thinking += delta.thinking_content;
        }

        if ("tool_calls" in delta && Array.isArray(delta.tool_calls)) {
          process.toolCalls = upsertAssistToolCalls(process.toolCalls, delta.tool_calls);
        }
      } else if (currentDeltaRole === "tool_result" && "tool_call_id" in delta && delta.tool_call_id) {
        process.toolCalls = upsertAssistToolCalls(process.toolCalls, [
          {
            id: delta.tool_call_id,
            tool_name: delta.tool_name || "tool",
            tool_result: "tool_result" in delta ? delta.tool_result : undefined,
          },
        ]);
      }
    } else if (event.type === "intent-end") {
      conversationId = data.intent_output?.conversation_id || conversationId;
      const speech = extractSpeechFromIntentOutput(data.intent_output);
      assistantText = speech || assistantText;

      if (data.intent_output?.response?.response_type === "error") {
        errorText = assistantText || "The assistant run failed.";
      }
    } else if (event.type === "tts-start") {
      assistantText = extractText(data.tts_input) || assistantText;
    } else if (event.type === "error") {
      errorText = extractText(data.message) || extractText(data.code) || "The assistant run failed.";
    }
  }

  return {
    userText,
    assistantText,
    thinking: trimAssistText(thinking),
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

function trimAssistText(text: string) {
  return text
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((line) => line.trimStart())
    .join("\n")
    .trim();
}

