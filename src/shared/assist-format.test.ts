import { describe, expect, it } from "vitest";
import { formatAssistDuration, formatAssistError, getAssistStageIcon } from "./assist-format";

describe("assist-format", () => {
  it("formats duration from ISO strings and Date objects", () => {
    expect(formatAssistDuration("2026-06-10T12:00:00.000Z", "2026-06-10T12:00:02.500Z")).toBe("2.50s");
    expect(
      formatAssistDuration(new Date("2026-06-10T12:00:00.000Z"), new Date("2026-06-10T12:00:15.000Z"))
    ).toBe("15.0s");
  });

  it("returns stage icons", () => {
    expect(getAssistStageIcon("done")).toBe("mdi:check-circle");
    expect(getAssistStageIcon("cancelled")).toBe("mdi:stop-circle-outline");
  });

  it("formats WS and DOM errors", () => {
    expect(formatAssistError({ message: "boom" }, { fallback: "fail" })).toBe("boom");
    expect(
      formatAssistError(new DOMException("denied", "NotAllowedError"), { micDenied: "Mic denied" })
    ).toBe("Mic denied");
  });
});
