import { describe, expect, it } from "vitest";
import {
  createAssistProcessModel,
  extractAssistConversationFromEvents,
  PipelineRunEvent,
} from "../../shared/assist-pipeline";
import {
  AssistChatMessage,
  AssistChatRun,
  buildMessagesFromRuns,
  filterRunsAfterConversationClear,
  finalizeCancelledMessages,
  getRunsSnapshot,
  isLoadingMessage,
  isUnprocessedSttAssistantMessage,
  mergeHistoryMessages,
} from "./assist-chat-messages";

const ev = (type: string, timestamp: string, data?: Record<string, any>): PipelineRunEvent => ({
  type,
  timestamp,
  data,
});

const T = (seconds: number) => `2026-06-10T12:00:${String(seconds).padStart(2, "0")}.000Z`;

const makeRun = (id: string, timestamp: string, events: PipelineRunEvent[]): AssistChatRun => ({
  pipeline_run_id: id,
  timestamp,
  events,
  conversation: extractAssistConversationFromEvents(events),
});

const completedTextRun = (id: string, timestamp: string, userText: string, reply: string) =>
  makeRun(id, timestamp, [
    ev("run-start", timestamp),
    ev("intent-start", timestamp, { intent_input: userText }),
    ev("intent-end", timestamp, {
      intent_output: {
        conversation_id: `conv-${id}`,
        response: { response_type: "action_done", speech: { plain: { speech: reply } } },
      },
    }),
    ev("run-end", timestamp),
  ]);

const cancelledRun = (id: string, timestamp: string, userText: string) =>
  makeRun(id, timestamp, [
    ev("run-start", timestamp),
    ev("intent-start", timestamp, { intent_input: userText }),
    ev("run-end", timestamp),
  ]);

const inProgressIntentRun = (id: string, timestamp: string, userText: string) =>
  makeRun(id, timestamp, [
    ev("run-start", timestamp),
    ev("intent-start", timestamp, { intent_input: userText }),
  ]);

const listeningRun = (id: string, timestamp: string) =>
  makeRun(id, timestamp, [ev("run-start", timestamp), ev("stt-start", timestamp)]);

const message = (overrides: Partial<AssistChatMessage> & Pick<AssistChatMessage, "id" | "role">): AssistChatMessage => ({
  text: "",
  status: "done",
  ...overrides,
});

describe("buildMessagesFromRuns", () => {
  it("builds user/assistant pairs from completed runs in chronological order", () => {
    const runs = [
      completedTextRun("r2", T(10), "second question", "second answer"),
      completedTextRun("r1", T(5), "first question", "first answer"),
    ];

    const { messages, conversationId } = buildMessagesFromRuns(runs, { active: false, clearedAt: null });

    expect(messages.map((m) => [m.role, m.text])).toEqual([
      ["user", "first question"],
      ["assistant", "first answer"],
      ["user", "second question"],
      ["assistant", "second answer"],
    ]);
    expect(messages.every((m) => m.status === "done")).toBe(true);
    expect(conversationId).toBe("conv-r2");
  });

  it("marks runs that finished without an intent-end as cancelled", () => {
    const { messages } = buildMessagesFromRuns([cancelledRun("r1", T(0), "do it")], {
      active: false,
      clearedAt: null,
    });

    expect(messages).toHaveLength(2);
    expect(messages[1].status).toBe("cancelled");
    expect(messages[1].text).toBe("");
  });

  it("gives in-progress intent runs a thinking status", () => {
    const { messages } = buildMessagesFromRuns([inProgressIntentRun("r1", T(0), "question")], {
      active: false,
      clearedAt: null,
    });

    expect(messages[1].status).toBe("thinking");
    expect(isLoadingMessage(messages[1])).toBe(true);
  });

  it("only shows a listening placeholder while the card itself is active", () => {
    const runs = [listeningRun("r1", T(0))];

    const idle = buildMessagesFromRuns(runs, { active: false, clearedAt: null });
    expect(idle.messages).toHaveLength(0);

    const active = buildMessagesFromRuns(runs, { active: true, clearedAt: null });
    expect(active.messages).toHaveLength(1);
    expect(active.messages[0].status).toBe("listening");
  });

  it("hides runs at or before the conversation clear timestamp", () => {
    const runs = [
      completedTextRun("r1", T(5), "old", "old answer"),
      completedTextRun("r2", T(10), "new", "new answer"),
    ];

    const { messages } = buildMessagesFromRuns(runs, {
      active: false,
      clearedAt: new Date(T(5)).getTime(),
    });

    expect(messages.map((m) => m.text)).toEqual(["new", "new answer"]);
  });

  it("reports error runs with error status", () => {
    const run = makeRun("r1", T(0), [
      ev("run-start", T(0)),
      ev("intent-start", T(1), { intent_input: "broken" }),
      ev("error", T(2), { message: "Pipeline broke" }),
    ]);

    const { messages } = buildMessagesFromRuns([run], { active: false, clearedAt: null });

    expect(messages[1].status).toBe("error");
    expect(messages[1].text).toBe("Pipeline broke");
  });
});

describe("filterRunsAfterConversationClear", () => {
  it("keeps only runs strictly after the cleared timestamp", () => {
    const runs = [
      { pipeline_run_id: "a", timestamp: T(1), events: [] },
      { pipeline_run_id: "b", timestamp: T(5), events: [] },
    ];

    expect(filterRunsAfterConversationClear(runs, new Date(T(1)).getTime()).map((r) => r.pipeline_run_id)).toEqual([
      "b",
    ]);
    expect(filterRunsAfterConversationClear(runs, null)).toHaveLength(2);
  });
});

describe("getRunsSnapshot", () => {
  it("is stable for unchanged runs and changes when events are appended", () => {
    const run = completedTextRun("r1", T(0), "hi", "hello");
    const before = getRunsSnapshot([run]);
    expect(getRunsSnapshot([run])).toBe(before);

    const grown = makeRun("r1", T(0), [...run.events, ev("tts-end", T(1), {})]);
    expect(getRunsSnapshot([grown])).not.toBe(before);
  });
});

describe("isUnprocessedSttAssistantMessage", () => {
  const sttOnlyProcess = () => {
    const process = createAssistProcessModel();
    process.stages.stt.status = "done";
    return process;
  };

  it("flags listening placeholders", () => {
    expect(
      isUnprocessedSttAssistantMessage(message({ id: "1", role: "assistant", status: "listening" }))
    ).toBe(true);
  });

  it("flags empty stt-only runs but keeps real replies", () => {
    expect(
      isUnprocessedSttAssistantMessage(
        message({ id: "1", role: "assistant", status: "pending", process: sttOnlyProcess() })
      )
    ).toBe(true);

    expect(
      isUnprocessedSttAssistantMessage(
        message({ id: "2", role: "assistant", status: "done", text: "real reply", process: sttOnlyProcess() })
      )
    ).toBe(false);
  });

  it("never flags user or error messages", () => {
    expect(isUnprocessedSttAssistantMessage(message({ id: "1", role: "user", status: "listening" }))).toBe(false);
    expect(
      isUnprocessedSttAssistantMessage(message({ id: "2", role: "assistant", status: "error", text: "x" }))
    ).toBe(false);
  });
});

describe("finalizeCancelledMessages", () => {
  it("stamps loading assistant messages as cancelled and keeps streamed partials", () => {
    const result = finalizeCancelledMessages([
      message({ id: "u", role: "user", text: "question" }),
      message({ id: "a1", role: "assistant", status: "thinking", thinking: "..." }),
      message({ id: "a2", role: "assistant", status: "streaming", text: "partial answer" }),
    ]);

    expect(result.find((m) => m.id === "a1")).toMatchObject({ status: "cancelled", thinking: undefined });
    expect(result.find((m) => m.id === "a2")).toMatchObject({ status: "streaming", text: "partial answer" });
  });

  it("drops listening placeholders entirely", () => {
    const result = finalizeCancelledMessages([
      message({ id: "l", role: "assistant", status: "listening" }),
    ]);

    expect(result).toHaveLength(0);
  });
});

describe("mergeHistoryMessages", () => {
  it("returns history when there are no local messages", () => {
    const history = [message({ id: "h1", role: "user", text: "hi" })];
    expect(mergeHistoryMessages(history, [], { dropPersistLocal: false })).toEqual(history);
  });

  it("re-stamps locally cancelled runs that the server completed anyway", () => {
    const fallback = [
      message({ id: "local-u", role: "user", text: "turn on the light" }),
      message({ id: "local-a", role: "assistant", status: "cancelled" }),
    ];
    const history = [
      message({ id: "r1-user", role: "user", text: "turn on the light" }),
      message({ id: "r1-assistant", role: "assistant", status: "thinking" }),
    ];

    const merged = mergeHistoryMessages(history, fallback, { dropPersistLocal: false });

    expect(merged).toHaveLength(2);
    expect(merged[1]).toMatchObject({ id: "r1-assistant", status: "cancelled" });
  });

  it("consumes each cancellation once so duplicate prompts are not all stamped", () => {
    const fallback = [
      message({ id: "local-u", role: "user", text: "turn on the light" }),
      message({ id: "local-a", role: "assistant", status: "cancelled" }),
    ];
    const history = [
      message({ id: "r1-user", role: "user", text: "turn on the light" }),
      message({ id: "r1-assistant", role: "assistant", status: "waiting" }),
      message({ id: "r2-user", role: "user", text: "turn on the light" }),
      message({ id: "r2-assistant", role: "assistant", status: "waiting" }),
    ];

    const merged = mergeHistoryMessages(history, fallback, { dropPersistLocal: false });

    expect(merged[1].status).toBe("cancelled");
    expect(merged[3].status).toBe("waiting");
  });

  it("keeps completed replies even when a cancellation matches the prompt text", () => {
    const fallback = [
      message({ id: "local-u", role: "user", text: "turn on the light" }),
      message({ id: "local-a", role: "assistant", status: "cancelled" }),
    ];
    const history = [
      message({ id: "r1-user", role: "user", text: "turn on the light" }),
      message({ id: "r1-assistant", role: "assistant", status: "done", text: "Done!" }),
    ];

    const merged = mergeHistoryMessages(history, fallback, { dropPersistLocal: false });

    expect(merged[1]).toMatchObject({ status: "done", text: "Done!" });
  });

  it("preserves local messages that precede the history window", () => {
    const fallback = [
      message({ id: "older-u", role: "user", text: "an older question" }),
      message({ id: "older-a", role: "assistant", status: "done", text: "an older answer" }),
      message({ id: "r1-user", role: "user", text: "current question" }),
    ];
    const history = [
      message({ id: "r1-user", role: "user", text: "current question" }),
      message({ id: "r1-assistant", role: "assistant", status: "done", text: "current answer" }),
    ];

    const merged = mergeHistoryMessages(history, fallback, { dropPersistLocal: false });

    expect(merged.map((m) => m.id)).toEqual(["older-u", "older-a", "r1-user", "r1-assistant"]);
  });

  it("appends persistLocal messages unless they were dismissed", () => {
    const warning = message({
      id: "warn",
      role: "assistant",
      status: "done",
      text: "https warning",
      persistLocal: true,
    });
    const history = [message({ id: "h1", role: "user", text: "hi" })];

    const kept = mergeHistoryMessages(history, [warning], { dropPersistLocal: false });
    expect(kept.some((m) => m.id === "warn")).toBe(true);

    const dropped = mergeHistoryMessages(history, [warning], { dropPersistLocal: true });
    expect(dropped.some((m) => m.id === "warn")).toBe(false);
  });
});
