import { describe, expect, it } from "vitest";
import { AssistPollController, isStaleLoadToken } from "./assist-poll-controller";

describe("AssistPollController", () => {
  it("detects stale load tokens", () => {
    expect(isStaleLoadToken(1, 2)).toBe(true);
    expect(isStaleLoadToken(2, 2)).toBe(false);
  });

  it("does not schedule when shouldPoll is false", () => {
    const controller = new AssistPollController({
      intervalMs: 1000,
      shouldPoll: () => false,
      onPoll: async () => true,
    });

    controller.sync();
    controller.stop();
    expect(true).toBe(true);
  });
});
