import { describe, expect, it } from "vitest";
import { checkRemoteTtsPlayback } from "./assist-chat-audio";

describe("checkRemoteTtsPlayback", () => {
  const initial = {
    sawPlaying: false,
    initialState: "idle",
    initialContentId: null,
  };

  it("waits until the player becomes active", () => {
    expect(checkRemoteTtsPlayback(initial, "idle", null)).toEqual({
      state: initial,
      step: "continue",
    });
  });

  it("marks playback started when the player begins playing", () => {
    expect(checkRemoteTtsPlayback(initial, "playing", "/api/tts_proxy/demo.mp3")).toEqual({
      state: { ...initial, sawPlaying: true },
      step: "started",
    });
  });

  it("ignores pre-existing playback until media content changes", () => {
    const busy = {
      sawPlaying: false,
      initialState: "playing",
      initialContentId: "media-source://music/track",
    };

    expect(checkRemoteTtsPlayback(busy, "playing", "media-source://music/track")).toEqual({
      state: busy,
      step: "continue",
    });

    expect(checkRemoteTtsPlayback(busy, "playing", "/api/tts_proxy/demo.mp3")).toEqual({
      state: { ...busy, sawPlaying: true },
      step: "started",
    });
  });

  it("completes when the player stops", () => {
    const active = {
      sawPlaying: true,
      initialState: "idle",
      initialContentId: null,
    };

    expect(checkRemoteTtsPlayback(active, "idle", null)).toEqual({
      state: active,
      step: "complete",
    });
  });

  it("completes when announce mode restores the original content", () => {
    const active = {
      sawPlaying: true,
      initialState: "playing",
      initialContentId: "media-source://music/track",
    };

    expect(checkRemoteTtsPlayback(active, "playing", "media-source://music/track")).toEqual({
      state: active,
      step: "complete",
    });
  });
});
