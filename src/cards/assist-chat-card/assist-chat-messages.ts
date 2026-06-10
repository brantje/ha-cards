import { assistProcessStageToMessageStatus } from "../../shared/assist-labels";
import {
  AssistConversationFromEvents,
  AssistPipelineDebugRunDetails,
  AssistProcessModel,
  PipelineRunEvent,
} from "../../shared/assist-pipeline";

/**
 * Explicit message lifecycle. Display strings are derived from this at render
 * time; logic must never compare user-visible text.
 *
 * - "pending": local assistant placeholder, renders typing dots only
 * - "listening": STT capture in progress
 * - "waiting" / "thinking" / "preparing": pipeline stage progress
 * - "streaming": partial response content is arriving
 * - "done" / "cancelled" / "error": terminal states
 */
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

export type AssistChatMessage = {
  id: string;
  role: "user" | "assistant";
  /** Real conversation content only — never placeholder/status text. */
  text: string;
  status: AssistChatMessageStatus;
  timestamp?: string;
  thinking?: string;
  process?: AssistProcessModel;
  persistLocal?: boolean;
};

/** A debug run with its conversation extracted exactly once. */
export type AssistChatRun = AssistPipelineDebugRunDetails & {
  conversation: AssistConversationFromEvents;
};

export type BuildMessagesOptions = {
  /** True while the card is actively processing or listening. */
  active: boolean;
  /** Epoch ms; runs at or before this moment are hidden. */
  clearedAt: number | null;
};

export type MergeMessagesOptions = {
  /** Drop messages flagged `persistLocal` (e.g. dismissed HTTPS warning). */
  dropPersistLocal: boolean;
};

const LOADING_STATUSES: ReadonlySet<AssistChatMessageStatus> = new Set([
  "pending",
  "listening",
  "waiting",
  "thinking",
  "preparing",
]);

export function isLoadingMessage(message: AssistChatMessage): boolean {
  return message.role === "assistant" && LOADING_STATUSES.has(message.status);
}

export function hasResponse(message: AssistChatMessage): boolean {
  return message.status === "streaming" || message.status === "done" || message.status === "error";
}

export function hasProcessActivity(process: AssistProcessModel): boolean {
  return (
    Object.values(process.stages).some((stage) => stage.status !== "idle") ||
    process.toolCalls.length > 0
  );
}

export function hasOnlySttProcessActivity(process: AssistProcessModel): boolean {
  const hasStt = process.stages.stt.status !== "idle";
  const hasIntent = process.stages.intent.status !== "idle";
  const hasTts = process.stages.tts.status !== "idle";

  return hasStt && !hasIntent && !hasTts && process.toolCalls.length === 0;
}

export function isListeningPlaceholderMessage(message: AssistChatMessage): boolean {
  return message.role === "assistant" && message.status === "listening";
}

/**
 * Assistant messages from voice runs that captured audio but never produced
 * an intent (mic opened, nothing recognized). These are noise in the chat.
 */
export function isUnprocessedSttAssistantMessage(message: AssistChatMessage): boolean {
  if (message.role !== "assistant" || message.status === "error") {
    return false;
  }

  if (isListeningPlaceholderMessage(message)) {
    return false;
  }

  if (!message.process || !hasOnlySttProcessActivity(message.process)) {
    return false;
  }

  return !message.text || message.status === "cancelled";
}

export function isRunFinished(events: PipelineRunEvent[]): boolean {
  return events.some((event) => event.type === "run-end" || event.type === "error");
}

export function isTextOnlyRun(events: PipelineRunEvent[]): boolean {
  const hasIntentStart = events.some((event) => event.type === "intent-start");
  const hasStt = events.some(
    (event) => event.type === "stt-start" || event.type === "stt-end" || event.type === "stt-vad-end"
  );

  return hasIntentStart && !hasStt;
}

export function isRunCancelled(
  events: PipelineRunEvent[],
  conversation: AssistConversationFromEvents
): boolean {
  if (conversation.assistantText || conversation.errorText || !conversation.userText) {
    return false;
  }

  if (!isRunFinished(events)) {
    return false;
  }

  const hasIntentStart = events.some((event) => event.type === "intent-start");
  const hasIntentEnd = events.some((event) => event.type === "intent-end");

  return hasIntentStart && !hasIntentEnd;
}

export function isRunListening(
  conversation: AssistConversationFromEvents,
  events: PipelineRunEvent[]
): boolean {
  if (conversation.userText || isRunFinished(events)) {
    return false;
  }

  if (isTextOnlyRun(events)) {
    return false;
  }

  const { process } = conversation;
  const hasSttEnd = events.some((event) => event.type === "stt-end");
  const hasVadEnd = events.some((event) => event.type === "stt-vad-end");
  const hasSttStart = events.some((event) => event.type === "stt-start");
  const hasWakeWord = events.some(
    (event) => event.type === "wake_word-start" || event.type === "wake_word-end"
  );

  if (hasSttEnd || hasVadEnd) {
    return false;
  }

  return (
    process.stage === "stt" ||
    process.stages.stt.status === "running" ||
    hasSttStart ||
    hasWakeWord ||
    (Boolean(process.started) && !events.some((event) => event.type === "intent-start"))
  );
}

function getInProgressAssistantStatus(
  conversation: AssistConversationFromEvents,
  events: PipelineRunEvent[],
  isListening: boolean
): AssistChatMessageStatus {
  if (isListening || isRunFinished(events)) {
    return "pending";
  }

  return assistProcessStageToMessageStatus(conversation.process.stage, false);
}

function shouldIncludeAssistantRunMessage(
  conversation: AssistConversationFromEvents,
  events: PipelineRunEvent[],
  isListening: boolean,
  active: boolean
): boolean {
  if (conversation.userText || conversation.assistantText || conversation.errorText || conversation.thinking) {
    return true;
  }

  if (isListening) {
    return active;
  }

  if (hasOnlySttProcessActivity(conversation.process)) {
    return false;
  }

  return isRunFinished(events) ? false : hasProcessActivity(conversation.process);
}

export function getAssistantMessageTimestamp(
  process: AssistProcessModel,
  events: PipelineRunEvent[],
  runTimestamp: string
): string {
  if (process.finished) {
    return process.finished;
  }

  const lastEvent = events[events.length - 1];
  return lastEvent?.timestamp || runTimestamp;
}

export function filterRunsAfterConversationClear<T extends AssistPipelineDebugRunDetails>(
  runs: T[],
  clearedAt: number | null
): T[] {
  if (clearedAt === null) {
    return runs;
  }

  return runs.filter((run) => new Date(run.timestamp).getTime() > clearedAt);
}

export function buildMessagesFromRuns(
  runs: AssistChatRun[],
  options: BuildMessagesOptions
): { messages: AssistChatMessage[]; conversationId: string | null } {
  const messages: AssistChatMessage[] = [];
  let conversationId: string | null = null;
  const visibleRuns = filterRunsAfterConversationClear(runs, options.clearedAt);
  const chronologicalRuns = [...visibleRuns].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  for (const [index, run] of chronologicalRuns.entries()) {
    const events = run.events || [];
    const conversation = run.conversation;
    const isListening = isRunListening(conversation, events);
    const isLatestRun = index === chronologicalRuns.length - 1;

    if (conversation.conversationId) {
      conversationId = conversation.conversationId;
    }

    if (conversation.userText) {
      messages.push({
        id: `${run.pipeline_run_id}-user`,
        role: "user",
        text: conversation.userText,
        status: "done",
        timestamp: run.timestamp,
      });
    } else if (isListening && isLatestRun) {
      messages.push({
        id: `${run.pipeline_run_id}-assistant-listening`,
        role: "assistant",
        text: "",
        status: "listening",
        process: conversation.process,
      });
    }

    const isInProgress = !isRunFinished(events);
    const cancelled = isRunCancelled(events, conversation);
    const hasAssistantContent =
      conversation.assistantText || conversation.errorText || conversation.thinking;
    const hasAssistantProcess = hasProcessActivity(conversation.process) && !isListening;
    const awaitingAssistantReply =
      isInProgress &&
      !isListening &&
      Boolean(conversation.userText) &&
      !conversation.errorText &&
      !cancelled;

    if (
      shouldIncludeAssistantRunMessage(conversation, events, isListening, options.active) &&
      (hasAssistantContent || hasAssistantProcess || awaitingAssistantReply)
    ) {
      const status: AssistChatMessageStatus = conversation.errorText
        ? "error"
        : cancelled
          ? "cancelled"
          : conversation.assistantText
            ? "done"
            : getInProgressAssistantStatus(conversation, events, isListening);

      messages.push({
        id: `${run.pipeline_run_id}-assistant`,
        role: "assistant",
        text: conversation.errorText || conversation.assistantText || "",
        status,
        timestamp: getAssistantMessageTimestamp(conversation.process, events, run.timestamp),
        thinking: cancelled ? undefined : conversation.thinking || undefined,
        process: conversation.process,
      });
    }
  }

  return { messages, conversationId };
}

/**
 * Stable fingerprint of run state, used to skip rebuilds when nothing changed.
 */
export function getRunsSnapshot(runs: AssistChatRun[]): string {
  return runs
    .map((run) => {
      const events = run.events || [];
      const conversation = run.conversation;
      const lastEvent = events[events.length - 1];

      return [
        run.pipeline_run_id,
        events.length,
        lastEvent?.type || "",
        lastEvent?.timestamp || "",
        conversation.userText,
        conversation.assistantText,
        conversation.errorText,
        conversation.thinking,
        isRunCancelled(events, conversation),
        conversation.process.stage,
        conversation.process.stages.stt.status,
        conversation.process.stages.intent.status,
        conversation.process.stages.tts.status,
        conversation.process.toolCalls.length,
      ].join(":");
    })
    .join("|");
}

function isHistoryListeningMessage(message: AssistChatMessage): boolean {
  return isListeningPlaceholderMessage(message);
}

function shouldKeepLocalMessage(message: AssistChatMessage, dropPersistLocal: boolean): boolean {
  return !(message.persistLocal && dropPersistLocal);
}

function findHistoryReplacementStart(
  historyMessages: AssistChatMessage[],
  fallbackMessages: AssistChatMessage[]
): number {
  const firstHistoryMessage = historyMessages[0];
  const matchingIdIndex = fallbackMessages.findIndex((message) => message.id === firstHistoryMessage.id);

  if (matchingIdIndex !== -1) {
    return matchingIdIndex;
  }

  if (!firstHistoryMessage.text) {
    return -1;
  }

  for (let i = fallbackMessages.length - 1; i >= 0; i--) {
    const message = fallbackMessages[i];
    if (message.role === firstHistoryMessage.role && message.text === firstHistoryMessage.text) {
      return i;
    }
  }

  return -1;
}

function appendPersistedLocalMessages(
  mergedMessages: AssistChatMessage[],
  fallbackMessages: AssistChatMessage[],
  dropPersistLocal: boolean
): AssistChatMessage[] {
  if (dropPersistLocal) {
    return mergedMessages;
  }

  const mergedIds = new Set(mergedMessages.map((message) => message.id));
  const persistedMessages = fallbackMessages.filter(
    (message) => message.persistLocal && !mergedIds.has(message.id)
  );

  return persistedMessages.length ? [...mergedMessages, ...persistedMessages] : mergedMessages;
}

/**
 * Local cancellations are not visible server-side (the pipeline run keeps
 * going after we unsubscribe), so re-stamp merged history messages that the
 * user cancelled. Cancelled entries are queued per user text and consumed at
 * most once, so duplicate prompts cannot all be marked cancelled.
 */
function preserveCancelledMessages(
  mergedMessages: AssistChatMessage[],
  fallbackMessages: AssistChatMessage[]
): AssistChatMessage[] {
  const cancelledByUserText = new Map<string, AssistChatMessage[]>();

  for (let index = 0; index < fallbackMessages.length; index++) {
    const message = fallbackMessages[index];
    if (message.role !== "assistant" || message.status !== "cancelled") {
      continue;
    }

    const userMessage = fallbackMessages[index - 1];
    if (userMessage?.role === "user") {
      const queue = cancelledByUserText.get(userMessage.text) || [];
      queue.push(message);
      cancelledByUserText.set(userMessage.text, queue);
    }
  }

  if (!cancelledByUserText.size) {
    return mergedMessages;
  }

  return mergedMessages.map((message, index) => {
    if (message.role !== "assistant") {
      return message;
    }

    const userMessage = mergedMessages[index - 1];
    if (userMessage?.role !== "user") {
      return message;
    }

    const queue = cancelledByUserText.get(userMessage.text);
    if (!queue?.length) {
      return message;
    }

    if (hasResponse(message) && message.text) {
      return message;
    }

    const cancelledMessage = queue.shift()!;
    return {
      ...message,
      text: cancelledMessage.text,
      status: "cancelled" as const,
      thinking: undefined,
    };
  });
}

export function mergeHistoryMessages(
  historyMessages: AssistChatMessage[],
  fallbackMessages: AssistChatMessage[],
  options: MergeMessagesOptions
): AssistChatMessage[] {
  const { dropPersistLocal } = options;

  if (!historyMessages.length) {
    return fallbackMessages.filter((message) => shouldKeepLocalMessage(message, dropPersistLocal));
  }

  if (!fallbackMessages.length) {
    return historyMessages;
  }

  const replacementStart = findHistoryReplacementStart(historyMessages, fallbackMessages);
  if (replacementStart === -1) {
    const fallbackIds = new Set(fallbackMessages.map((message) => message.id));
    return appendPersistedLocalMessages(
      preserveCancelledMessages(
        [
          ...fallbackMessages.filter(
            (message) =>
              shouldKeepLocalMessage(message, dropPersistLocal) && !isHistoryListeningMessage(message)
          ),
          ...historyMessages.filter((message) => !fallbackIds.has(message.id)),
        ],
        fallbackMessages
      ),
      fallbackMessages,
      dropPersistLocal
    );
  }

  const historyIds = new Set(historyMessages.map((message) => message.id));
  const preservedMessages = fallbackMessages
    .slice(0, replacementStart)
    .filter(
      (message) =>
        shouldKeepLocalMessage(message, dropPersistLocal) &&
        !historyIds.has(message.id) &&
        !isHistoryListeningMessage(message)
    );

  return appendPersistedLocalMessages(
    preserveCancelledMessages([...preservedMessages, ...historyMessages], fallbackMessages),
    fallbackMessages,
    dropPersistLocal
  );
}

/**
 * Stamp in-flight assistant messages as cancelled and drop placeholder noise.
 * Messages with streamed partial content are kept as-is (matching previous
 * behavior: the server completed the run even though we stopped listening).
 */
export function finalizeCancelledMessages(messages: AssistChatMessage[]): AssistChatMessage[] {
  return messages
    .map((message) => {
      if (isListeningPlaceholderMessage(message) || isUnprocessedSttAssistantMessage(message)) {
        return undefined;
      }

      if (message.role === "assistant" && isLoadingMessage(message)) {
        return {
          ...message,
          status: "cancelled" as const,
          thinking: undefined,
        };
      }

      return message;
    })
    .filter((message): message is AssistChatMessage => Boolean(message));
}
