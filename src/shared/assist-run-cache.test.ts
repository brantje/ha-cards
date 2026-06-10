import { describe, expect, it } from "vitest";
import { AssistRunCache } from "./assist-run-cache";

describe("AssistRunCache", () => {
  it("stores and prunes entries", () => {
    const cache = new AssistRunCache();
    cache.set("a", {
      events: [],
      conversation: {
        userText: "",
        assistantText: "",
        thinking: "",
        toolCalls: [],
        errorText: "",
        conversationId: null,
        process: {
          stage: "ready",
          stages: {
            stt: { key: "stt", label: "STT", status: "idle" },
            intent: { key: "intent", label: "Intent", status: "idle" },
            tts: { key: "tts", label: "TTS", status: "idle" },
          },
          toolCalls: [],
        },
      },
      finished: true,
    });

    expect(cache.get("a")?.finished).toBe(true);
    cache.prune(new Set());
    expect(cache.get("a")).toBeUndefined();
  });
});
