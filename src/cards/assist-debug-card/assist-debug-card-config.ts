import { DEFAULT_ASSIST_RUN_COUNT } from "../../shared/assist-pipeline";

export type MetadataMode = "hidden" | "compact" | "full";
export type AudioVisualizationType = "waveform" | "spectrum" | "meter" | "glow" | "ulysse31";
export type AudioVisualizationPosition = "background" | "top" | "between" | "below_chat";

export type AssistDebugCardConfig = {
  type?: string;
  title?: string;
  pipeline_id?: string;
  run_count?: number;
  minimalistic_mode?: boolean;
  visualization_only?: boolean;
  conversation_only?: boolean;
  show_conversation?: boolean;
  metadata_mode?: MetadataMode;
  show_raw?: boolean;
  show_thinking?: boolean;
  show_summary?: boolean;
  show_stt?: boolean;
  show_intent?: boolean;
  show_tts?: boolean;
  mask_transcripts?: boolean;
  background_color?: string;
  surface_color?: string;
  text_color?: string;
  secondary_text_color?: string;
  accent_color?: string;
  user_chat_color?: string;
  user_chat_text_color?: string;
  assistant_chat_color?: string;
  assistant_chat_text_color?: string;
  audio_visualization?: boolean;
  audio_visualization_type?: AudioVisualizationType;
  audio_visualization_position?: AudioVisualizationPosition;
  audio_visualization_height?: number;
  audio_visualization_color?: string;
  audio_visualization_secondary_color?: string;
  audio_visualization_background?: string;
  audio_visualization_opacity?: number;
  audio_visualization_start_delay?: number;
};

export const ASSIST_DEBUG_CARD_DEFAULTS = {
  title: "Assist debug",
  pipeline_id: "preferred",
  run_count: DEFAULT_ASSIST_RUN_COUNT,
  minimalistic_mode: false,
  visualization_only: false,
  conversation_only: false,
  show_conversation: false,
  metadata_mode: "compact" as MetadataMode,
  show_raw: true,
  show_thinking: true,
  show_summary: true,
  show_stt: true,
  show_intent: true,
  show_tts: true,
  mask_transcripts: false,
  audio_visualization: false,
  audio_visualization_type: "waveform" as AudioVisualizationType,
  audio_visualization_position: "below_chat" as AudioVisualizationPosition,
  audio_visualization_height: 56,
  audio_visualization_color: "var(--primary-color)",
  audio_visualization_secondary_color: "var(--secondary-text-color)",
  audio_visualization_background: "transparent",
  audio_visualization_opacity: 0.75,
  audio_visualization_start_delay: 0,
} satisfies Partial<AssistDebugCardConfig>;

export const ASSIST_DEBUG_CARD_EDITOR_COLOR_INPUT = {
  audio_visualization_color: "#03a9f4",
  audio_visualization_secondary_color: "#727272",
  audio_visualization_background: "#000000",
} as const;

export const ULYSSE31_AUDIO_COLOR = "#39ff14";
export const ULYSSE31_AUDIO_BACKGROUND = "#000000";

export function getDebugConfigValue<K extends keyof typeof ASSIST_DEBUG_CARD_DEFAULTS>(
  config: AssistDebugCardConfig,
  key: K
): (typeof ASSIST_DEBUG_CARD_DEFAULTS)[K] {
  const value = config[key];
  return (value === undefined ? ASSIST_DEBUG_CARD_DEFAULTS[key] : value) as (typeof ASSIST_DEBUG_CARD_DEFAULTS)[K];
}
