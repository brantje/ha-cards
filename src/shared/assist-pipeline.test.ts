import { describe, expect, it } from "vitest";
import {
  applyAssistChatLogDelta,
  applyAssistProcessEvent,
  createAssistChatLogAccumulator,
  createAssistProcessModel,
  extractAssistConversationFromEvents,
  extractSpeechFromIntentOutput,
  getAssistRunCount,
  getRecentAssistPipelineDebugRuns,
  isUnauthorizedWsError,
  PipelineRunEvent,
  resolvePipelineId,
  trimAssistText,
  upsertAssistToolCalls,
} from "./assist-pipeline";

const ev = (type: string, timestamp: string, data?: Record<string, any>): PipelineRunEvent => ({
  type,
  timestamp,
  data,
});

const T = (seconds: number) => `2026-06-10T12:00:${String(seconds).padStart(2, "0")}.000Z`;

describe("applyAssistProcessEvent", () => {
  it("tracks a full text run through its stages", () => {
    const process = createAssistProcessModel();

    applyAssistProcessEvent(process, ev("run-start", T(0)));
    expect(process.started).toBe(T(0));
    expect(process.stage).toBe("ready");

    applyAssistProcessEvent(process, ev("intent-start", T(1)));
    expect(process.stage).toBe("intent");
    expect(process.stages.intent.status).toBe("running");
    expect(process.stages.intent.started).toBe(T(1));

    applyAssistProcessEvent(process, ev("intent-end", T(3)));
    expect(process.stages.intent.status).toBe("done");
    expect(process.stages.intent.ended).toBe(T(3));

    applyAssistProcessEvent(process, ev("run-end", T(4)));
    expect(process.stage).toBe("done");
    expect(process.finished).toBe(T(4));
  });

  it("re-anchors STT start time at VAD end (transcription time, matching HA debug)", () => {
    const process = createAssistProcessModel();

    applyAssistProcessEvent(process, ev("stt-start", T(0)));
    applyAssistProcessEvent(process, ev("stt-vad-end", T(5)));
    applyAssistProcessEvent(process, ev("stt-end", T(6)));

    expect(process.stages.stt.started).toBe(T(5));
    expect(process.stages.stt.ended).toBe(T(6));
    expect(process.stages.stt.status).toBe("done");
  });

  it("marks running stages as errored on pipeline error", () => {
    const process = createAssistProcessModel();

    applyAssistProcessEvent(process, ev("intent-start", T(1)));
    applyAssistProcessEvent(process, ev("error", T(2), { message: "boom", code: "intent-failed" }));

    expect(process.stage).toBe("error");
    expect(process.error).toBe("boom");
    expect(process.stages.intent.status).toBe("error");
    expect(process.stages.intent.ended).toBe(T(2));
  });
});

describe("applyAssistChatLogDelta", () => {
  it("accumulates assistant content, thinking and tool calls", () => {
    const acc = createAssistChatLogAccumulator();

    applyAssistChatLogDelta(acc, { role: "assistant", thinking_content: "hmm " });
    applyAssistChatLogDelta(acc, { thinking_content: "ok" });
    applyAssistChatLogDelta(acc, { content: "Hello" });

    expect(acc.thinking).toBe("hmm ok");
    expect(acc.assistantText).toBe("Hello");
    expect(acc.currentDeltaRole).toBe("assistant");
  });

  it("merges tool results by id", () => {
    const acc = createAssistChatLogAccumulator();

    applyAssistChatLogDelta(acc, {
      role: "assistant",
      tool_calls: [{ id: "t1", tool_name: "weather", tool_args: { city: "Berlin" } }],
    });
    applyAssistChatLogDelta(acc, {
      role: "tool_result",
      tool_call_id: "t1",
      tool_name: "weather",
      tool_result: { temp: 21 },
    });

    expect(acc.toolCalls).toHaveLength(1);
    expect(acc.toolCalls[0]).toMatchObject({
      id: "t1",
      tool_name: "weather",
      tool_result: { temp: 21 },
    });
  });
});

describe("trimAssistText", () => {
  it("normalizes leading whitespace per line", () => {
    expect(trimAssistText("  line one\n   line two\r\n")).toBe("line one\nline two");
  });
});

describe("extractAssistConversationFromEvents", () => {
  it("extracts user text, streamed assistant text, thinking and conversation id", () => {
    const events = [
      ev("run-start", T(0)),
      ev("intent-start", T(1), { intent_input: "turn on the light" }),
      ev("intent-progress", T(2), { chat_log_delta: { role: "assistant", thinking_content: "hmm " } }),
      ev("intent-progress", T(2), { chat_log_delta: { thinking_content: "ok" } }),
      ev("intent-progress", T(3), { chat_log_delta: { content: "Turning " } }),
      ev("intent-progress", T(3), { chat_log_delta: { content: "it on." } }),
      ev("intent-end", T(4), {
        intent_output: {
          conversation_id: "conv-1",
          response: { response_type: "action_done", speech: { plain: { speech: "Done!" } } },
        },
      }),
      ev("run-end", T(5)),
    ];

    const conversation = extractAssistConversationFromEvents(events);

    expect(conversation.userText).toBe("turn on the light");
    // intent-end speech wins over streamed partials
    expect(conversation.assistantText).toBe("Done!");
    expect(conversation.thinking).toBe("hmm ok");
    expect(conversation.conversationId).toBe("conv-1");
    expect(conversation.errorText).toBe("");
    expect(conversation.process.stage).toBe("done");
  });

  it("collects tool calls and merges tool results by id", () => {
    const events = [
      ev("intent-start", T(1), { intent_input: "weather?" }),
      ev("intent-progress", T(2), {
        chat_log_delta: {
          role: "assistant",
          tool_calls: [{ id: "t1", tool_name: "get_weather", tool_args: { city: "Berlin" } }],
        },
      }),
      ev("intent-progress", T(3), {
        chat_log_delta: { role: "tool_result", tool_call_id: "t1", tool_name: "get_weather", tool_result: { temp: 21 } },
      }),
    ];

    const conversation = extractAssistConversationFromEvents(events);

    expect(conversation.toolCalls).toHaveLength(1);
    expect(conversation.toolCalls[0]).toMatchObject({
      id: "t1",
      tool_name: "get_weather",
      tool_args: { city: "Berlin" },
      tool_result: { temp: 21 },
    });
  });

  it("captures error output and error events", () => {
    const conversation = extractAssistConversationFromEvents([
      ev("intent-start", T(1), { intent_input: "do something" }),
      ev("error", T(2), { message: "Pipeline broke" }),
    ]);

    expect(conversation.errorText).toBe("Pipeline broke");
  });

  it("processes events in timestamp order even when delivered shuffled", () => {
    const conversation = extractAssistConversationFromEvents([
      ev("intent-progress", T(3), { chat_log_delta: { role: "assistant", content: " world" } }),
      ev("intent-progress", T(2), { chat_log_delta: { role: "assistant", content: "hello" } }),
      ev("intent-start", T(1), { intent_input: "hi" }),
    ]);

    expect(conversation.assistantText).toBe("hello world");
  });
});

describe("extractSpeechFromIntentOutput", () => {
  it("reads plain speech", () => {
    expect(
      extractSpeechFromIntentOutput({ response: { speech: { plain: { speech: "Hi there" } } } })
    ).toBe("Hi there");
  });

  it("returns empty string for non-string speech payloads", () => {
    expect(extractSpeechFromIntentOutput({ response: { speech: { weird: true } } })).toBe("");
    expect(extractSpeechFromIntentOutput(undefined)).toBe("");
  });
});

describe("upsertAssistToolCalls", () => {
  it("inserts new calls and merges updates by id without dropping fields", () => {
    const first = upsertAssistToolCalls([], [{ id: "a", tool_name: "x", tool_args: { p: 1 } }]);
    const second = upsertAssistToolCalls(first, [{ id: "a", tool_name: "", tool_result: 42 } as any]);

    expect(second).toHaveLength(1);
    expect(second[0]).toMatchObject({ id: "a", tool_name: "x", tool_args: { p: 1 }, tool_result: 42 });
  });

  it("ignores calls without an id", () => {
    expect(upsertAssistToolCalls([], [{ id: "", tool_name: "x" }])).toHaveLength(0);
  });
});

describe("resolvePipelineId", () => {
  const response = {
    pipelines: [
      { id: "p1", name: "One" },
      { id: "p2", name: "Two" },
    ],
    preferred_pipeline: "p2",
  };

  it("returns the configured id when explicit", () => {
    expect(resolvePipelineId("p1", response)).toBe("p1");
  });

  it("falls back to the preferred pipeline", () => {
    expect(resolvePipelineId(undefined, response)).toBe("p2");
    expect(resolvePipelineId("preferred", response)).toBe("p2");
  });

  it("falls back to the first pipeline when no preferred is set", () => {
    expect(resolvePipelineId("preferred", { ...response, preferred_pipeline: null })).toBe("p1");
  });

  it("resolves last_used to preferred when nothing was stored", () => {
    expect(resolvePipelineId("last_used", response)).toBe("p2");
  });
});

describe("getAssistRunCount", () => {
  it("clamps and rounds", () => {
    expect(getAssistRunCount(7)).toBe(7);
    expect(getAssistRunCount(7.6)).toBe(8);
    expect(getAssistRunCount(-3)).toBe(0);
    expect(getAssistRunCount(99)).toBe(20);
  });

  it("uses the fallback for non-numeric values", () => {
    expect(getAssistRunCount(Number.NaN, 5)).toBe(5);
    expect(getAssistRunCount(undefined, 5)).toBe(5);
  });

  it("respects a custom minimum", () => {
    expect(getAssistRunCount(0, 5, 1)).toBe(1);
  });
});

describe("getRecentAssistPipelineDebugRuns", () => {
  it("returns the newest runs first, limited to the count", () => {
    const runs = [
      { pipeline_run_id: "old", timestamp: T(0) },
      { pipeline_run_id: "new", timestamp: T(9) },
      { pipeline_run_id: "mid", timestamp: T(5) },
    ];

    const recent = getRecentAssistPipelineDebugRuns(runs, 2);
    expect(recent.map((run) => run.pipeline_run_id)).toEqual(["new", "mid"]);
  });
});

describe("isUnauthorizedWsError", () => {
  it("detects admin-only API rejections", () => {
    expect(isUnauthorizedWsError({ code: "unauthorized" })).toBe(true);
    expect(isUnauthorizedWsError({ code: "not_allowed" })).toBe(true);
  });

  it("ignores other errors", () => {
    expect(isUnauthorizedWsError({ code: "timeout" })).toBe(false);
    expect(isUnauthorizedWsError(null)).toBe(false);
    expect(isUnauthorizedWsError(new Error("x"))).toBe(false);
  });
});
