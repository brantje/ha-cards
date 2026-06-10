import { describe, expect, it } from "vitest";
import {
  assistMessageStatusToLabel,
  assistProcessStageToMessageStatus,
  getAssistStageLoadingLabel,
} from "./assist-labels";

describe("assist-labels", () => {
  it("returns stage loading labels", () => {
    expect(getAssistStageLoadingLabel("stt")).toBe("Listening...");
    expect(getAssistStageLoadingLabel("intent")).toBe("Thinking...");
    expect(getAssistStageLoadingLabel("tts")).toBe("Preparing reply...");
  });

  it("maps process stage to message status", () => {
    expect(assistProcessStageToMessageStatus("intent", false)).toBe("thinking");
    expect(assistProcessStageToMessageStatus("tts", false)).toBe("preparing");
    expect(assistProcessStageToMessageStatus("ready", true)).toBe("listening");
  });

  it("maps message status to labels", () => {
    expect(assistMessageStatusToLabel("thinking")).toBe("Thinking...");
    expect(assistMessageStatusToLabel("listening")).toBe("Listening...");
  });
});
