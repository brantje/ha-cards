import { DEFAULT_ACCENT_BLUE } from "../../shared/card-colors";
import { DEFAULT_SPEECH_RMS_THRESHOLD } from "../../shared/assist-audio-recorder";
import { DEFAULT_ASSIST_RUN_COUNT } from "../../shared/assist-pipeline";

export type AssistChatCardConfig = {
  type?: string;
  title?: string;
  pipeline_id?: string;
  run_count?: number;
  show_header?: boolean;
  text_input?: boolean;
  voice_input?: boolean;
  continue_conversation?: boolean;
  always_continue_conversation?: boolean;
  session_conversation?: boolean;
  disable_speech?: boolean;
  enable_audio_playback?: boolean;
  speech_rms_threshold?: number;
  show_process?: boolean;
  show_thinking_until_response?: boolean;
  show_message_time?: boolean;
  suggested_prompts?: string;
  show_suggested_prompts?: boolean;
  always_show_suggested_prompts?: boolean;
  background_color?: string;
  surface_color?: string;
  user_chat_color?: string;
  user_chat_text_color?: string;
  assistant_chat_color?: string;
  assistant_chat_text_color?: string;
};

/**
 * Single source of truth for config defaults, shared by the card and its
 * editor so they can never disagree about what an absent key means.
 *
 * Color defaults are theme tokens so the card works on light and dark themes;
 * the hex fallbacks match the previous hardcoded palette.
 */
export const ASSIST_CHAT_CARD_DEFAULTS = {
  title: "Assist",
  pipeline_id: "preferred",
  run_count: DEFAULT_ASSIST_RUN_COUNT,
  show_header: true,
  text_input: true,
  voice_input: false,
  continue_conversation: false,
  always_continue_conversation: false,
  session_conversation: true,
  disable_speech: false,
  enable_audio_playback: false,
  speech_rms_threshold: DEFAULT_SPEECH_RMS_THRESHOLD,
  show_process: true,
  show_thinking_until_response: false,
  show_message_time: false,
  suggested_prompts: "",
  show_suggested_prompts: true,
  always_show_suggested_prompts: false,
  background_color: "var(--card-background-color)",
  surface_color: "var(--secondary-background-color, #2b2b2b)",
  user_chat_color: `var(--primary-color, ${DEFAULT_ACCENT_BLUE})`,
  user_chat_text_color: "var(--text-primary-color, #ffffff)",
  assistant_chat_color: "var(--secondary-background-color, #2b2b2b)",
  assistant_chat_text_color: "var(--primary-text-color, #ffffff)",
} satisfies Required<Omit<AssistChatCardConfig, "type">>;

/**
 * Representative hex values for the editor's `<input type="color">` controls,
 * which cannot display CSS custom-property values.
 */
export const ASSIST_CHAT_CARD_EDITOR_COLOR_FALLBACKS: Record<string, string> = {
  background_color: "#1d1d1d",
  surface_color: "#2b2b2b",
  user_chat_color: DEFAULT_ACCENT_BLUE,
  user_chat_text_color: "#ffffff",
  assistant_chat_color: "#2b2b2b",
  assistant_chat_text_color: "#ffffff",
};

export function normalizeSuggestedPrompts(value: unknown): string {
  if (Array.isArray(value)) {
    return value.map((line) => String(line).trim()).filter(Boolean).join("\n");
  }

  return typeof value === "string" ? value : "";
}
