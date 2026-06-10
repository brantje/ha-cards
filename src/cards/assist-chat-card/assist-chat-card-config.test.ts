import { describe, expect, it } from "vitest";
import { ASSIST_CHAT_CARD_DEFAULTS, normalizeSuggestedPrompts } from "./assist-chat-card-config";

describe("ASSIST_CHAT_CARD_DEFAULTS", () => {
  it("treats an absent session_conversation as enabled (regression: card/editor divergence)", () => {
    expect(ASSIST_CHAT_CARD_DEFAULTS.session_conversation).toBe(true);
  });

  it("defaults card_only_history to false", () => {
    expect(ASSIST_CHAT_CARD_DEFAULTS.card_only_history).toBe(false);
  });

  it("defaults colors to theme tokens", () => {
    expect(ASSIST_CHAT_CARD_DEFAULTS.background_color).toBe("var(--card-background-color)");

    for (const key of [
      "surface_color",
      "user_chat_color",
      "user_chat_text_color",
      "assistant_chat_color",
      "assistant_chat_text_color",
    ] as const) {
      expect(ASSIST_CHAT_CARD_DEFAULTS[key]).toMatch(/^var\(--[a-z-]+, #?[0-9a-f]+\)$/i);
    }
  });
});

describe("normalizeSuggestedPrompts", () => {
  it("joins arrays into newline-separated prompts, dropping empties", () => {
    expect(normalizeSuggestedPrompts([" one ", "", "two"])).toBe("one\ntwo");
  });

  it("passes strings through and rejects other types", () => {
    expect(normalizeSuggestedPrompts("a\nb")).toBe("a\nb");
    expect(normalizeSuggestedPrompts(42)).toBe("");
    expect(normalizeSuggestedPrompts(undefined)).toBe("");
  });
});
