import { css, html, LitElement, PropertyValues } from "lit";
import { fireEvent, HomeAssistant } from "custom-card-helpers";
import { renderTextField } from "../../shared/base-card";

type MetadataMode = "hidden" | "compact" | "full";
type AudioVisualizationType = "waveform" | "spectrum" | "meter" | "glow" | "ulysse31";
type AudioVisualizationPosition = "background" | "top" | "between" | "below_chat";
type AudioVisualizationColorKey =
  | "audio_visualization_color"
  | "audio_visualization_secondary_color"
  | "audio_visualization_background";

type AssistDebugCardEditorConfig = {
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

const DEFAULT_TITLE = "Assist debug";
const DEFAULT_PIPELINE_ID = "preferred";
const DEFAULT_RUN_COUNT = 5;
const DEFAULT_METADATA_MODE: MetadataMode = "compact";
const DEFAULT_AUDIO_VISUALIZATION_TYPE: AudioVisualizationType = "waveform";
const DEFAULT_AUDIO_VISUALIZATION_POSITION: AudioVisualizationPosition = "below_chat";
const DEFAULT_AUDIO_VISUALIZATION_HEIGHT = 56;
const DEFAULT_AUDIO_VISUALIZATION_COLOR = "var(--primary-color)";
const DEFAULT_AUDIO_VISUALIZATION_SECONDARY_COLOR = "var(--secondary-text-color)";
const DEFAULT_AUDIO_VISUALIZATION_BACKGROUND = "transparent";
const DEFAULT_AUDIO_VISUALIZATION_COLOR_INPUT = "#03a9f4";
const DEFAULT_AUDIO_VISUALIZATION_SECONDARY_COLOR_INPUT = "#727272";
const DEFAULT_AUDIO_VISUALIZATION_BACKGROUND_INPUT = "#000000";
const DEFAULT_AUDIO_VISUALIZATION_OPACITY = 0.75;
const DEFAULT_AUDIO_VISUALIZATION_START_DELAY = 0;

class AssistDebugCardEditor extends LitElement {
  hass?: HomeAssistant;
  config: AssistDebugCardEditorConfig = {};

  static properties = {
    hass: { attribute: false },
    config: { attribute: false },
  };

  setConfig(config: AssistDebugCardEditorConfig) {
    this.config = {
      title: DEFAULT_TITLE,
      pipeline_id: DEFAULT_PIPELINE_ID,
      run_count: DEFAULT_RUN_COUNT,
      minimalistic_mode: false,
      visualization_only: false,
      conversation_only: false,
      show_conversation: false,
      metadata_mode: DEFAULT_METADATA_MODE,
      show_raw: true,
      show_thinking: true,
      show_summary: true,
      show_stt: true,
      show_intent: true,
      show_tts: true,
      mask_transcripts: false,
      audio_visualization: false,
      audio_visualization_type: DEFAULT_AUDIO_VISUALIZATION_TYPE,
      audio_visualization_position: DEFAULT_AUDIO_VISUALIZATION_POSITION,
      audio_visualization_height: DEFAULT_AUDIO_VISUALIZATION_HEIGHT,
      audio_visualization_color: DEFAULT_AUDIO_VISUALIZATION_COLOR,
      audio_visualization_secondary_color: DEFAULT_AUDIO_VISUALIZATION_SECONDARY_COLOR,
      audio_visualization_background: DEFAULT_AUDIO_VISUALIZATION_BACKGROUND,
      audio_visualization_opacity: DEFAULT_AUDIO_VISUALIZATION_OPACITY,
      audio_visualization_start_delay: DEFAULT_AUDIO_VISUALIZATION_START_DELAY,
      ...config,
    };
  }

  shouldUpdate(changedProperties: PropertyValues): boolean {
    if (changedProperties.has("config")) {
      return true;
    }

    if (changedProperties.has("hass")) {
      const oldHass = changedProperties.get("hass") as HomeAssistant | undefined;
      return !oldHass && Boolean(this.hass);
    }

    return false;
  }

  render() {
    return html`
      <div class="editor">
        <div class="grid">
          ${renderTextField({
            label: "Title",
            value: String(this.config.title || ""),
            placeholder: DEFAULT_TITLE,
            onInput: (value) => this.updateConfigValue("title", value),
          })}
          ${renderTextField({
            label: "Pipeline ID",
            value: String(this.config.pipeline_id || DEFAULT_PIPELINE_ID),
            placeholder: "preferred or a pipeline id",
            onInput: (value) => this.updateConfigValue("pipeline_id", value || DEFAULT_PIPELINE_ID),
          })}
          ${this.renderNumberField("Recent runs", "run_count", DEFAULT_RUN_COUNT, 1, 20)}
          ${this.renderMetadataModeField()}
        </div>

        <fieldset>
          <legend>Display</legend>
          ${this.renderCheckbox("Minimalistic mode", "minimalistic_mode")}
          ${this.renderCheckbox("Show only visualization", "visualization_only")}
          ${this.renderCheckbox("Show only conversation", "conversation_only")}
          ${this.renderCheckbox("Show conversation bubbles", "show_conversation")}
          ${this.renderCheckbox("Show collapsible raw JSON", "show_raw")}
          ${this.renderCheckbox("Show LLM thinking (live)", "show_thinking")}
          ${this.renderCheckbox("Mask transcripts and raw text", "mask_transcripts")}
        </fieldset>

        <fieldset>
          <legend>Pipeline stages</legend>
          ${this.renderCheckbox("Show run summary", "show_summary")}
          ${this.renderCheckbox("Show speech-to-text", "show_stt")}
          ${this.renderCheckbox("Show natural language processing", "show_intent")}
          ${this.renderCheckbox("Show text-to-speech", "show_tts")}
        </fieldset>

        <fieldset>
          <legend>Audio visualization</legend>
          ${this.renderCheckbox("Enable audio visualization", "audio_visualization")}
          ${this.renderAudioVisualizationTypeField()}
          ${this.config.audio_visualization_type === "glow" ? "" : this.renderAudioVisualizationPositionField()}
          ${this.renderNumberField("Height", "audio_visualization_height", DEFAULT_AUDIO_VISUALIZATION_HEIGHT, 24, 180)}
          ${this.renderNumberField("Visualization start delay (ms)", "audio_visualization_start_delay", DEFAULT_AUDIO_VISUALIZATION_START_DELAY, 0, 10000)}
          ${this.renderDecimalField("Opacity", "audio_visualization_opacity", DEFAULT_AUDIO_VISUALIZATION_OPACITY, 0.05, 1, 0.05)}
          ${this.renderColorInput(
            "Primary color",
            "audio_visualization_color",
            DEFAULT_AUDIO_VISUALIZATION_COLOR,
            DEFAULT_AUDIO_VISUALIZATION_COLOR_INPUT
          )}
          ${this.renderColorInput(
            "Secondary color",
            "audio_visualization_secondary_color",
            DEFAULT_AUDIO_VISUALIZATION_SECONDARY_COLOR,
            DEFAULT_AUDIO_VISUALIZATION_SECONDARY_COLOR_INPUT
          )}
          ${this.renderColorInput(
            "Background",
            "audio_visualization_background",
            DEFAULT_AUDIO_VISUALIZATION_BACKGROUND,
            DEFAULT_AUDIO_VISUALIZATION_BACKGROUND_INPUT
          )}
        </fieldset>
      </div>
    `;
  }

  private renderNumberField(
    label: string,
    key: "run_count" | "audio_visualization_height" | "audio_visualization_start_delay",
    fallback: number,
    min: number,
    max: number
  ) {
    const value = Number(this.config[key] ?? fallback);

    return html`
      <label>
        <span>${label}</span>
        <input
          type="number"
          min=${String(min)}
          max=${String(max)}
          .value=${String(value)}
          @input=${(event: InputEvent) => this.updateNumberValue(key, (event.target as HTMLInputElement).value, fallback, min, max)}
        />
      </label>
    `;
  }

  private renderDecimalField(
    label: string,
    key: "audio_visualization_opacity",
    fallback: number,
    min: number,
    max: number,
    step: number
  ) {
    const value = Number(this.config[key] ?? fallback);

    return html`
      <label>
        <span>${label}</span>
        <input
          type="number"
          min=${String(min)}
          max=${String(max)}
          step=${String(step)}
          .value=${String(value)}
          @input=${(event: InputEvent) => this.updateDecimalValue(key, (event.target as HTMLInputElement).value, fallback, min, max)}
        />
      </label>
    `;
  }

  private renderColorInput(
    label: string,
    key: AudioVisualizationColorKey,
    fallback: string,
    colorInputFallback: string
  ) {
    const value = this.toColorInputValue(String(this.config[key] || fallback), colorInputFallback);

    return html`
      <label>
        <span>${label}</span>
        <input
          type="color"
          .value=${value}
          @input=${(event: InputEvent) => this.updateConfigValue(key, (event.target as HTMLInputElement).value)}
        />
      </label>
    `;
  }

  private renderMetadataModeField() {
    const value = this.config.metadata_mode || DEFAULT_METADATA_MODE;

    return html`
      <label>
        <span>Metadata display</span>
        <select .value=${value} @change=${(event: Event) => this.updateConfigValue("metadata_mode", (event.target as HTMLSelectElement).value)}>
          <option value="hidden" ?selected=${value === "hidden"}>Hidden</option>
          <option value="compact" ?selected=${value === "compact"}>Compact</option>
          <option value="full" ?selected=${value === "full"}>Full</option>
        </select>
      </label>
    `;
  }

  private renderAudioVisualizationTypeField() {
    const value = this.config.audio_visualization_type || DEFAULT_AUDIO_VISUALIZATION_TYPE;

    return html`
      <label>
        <span>Visualization type</span>
        <select .value=${value} @change=${(event: Event) => this.updateConfigValue("audio_visualization_type", (event.target as HTMLSelectElement).value)}>
          <option value="waveform" ?selected=${value === "waveform"}>Waveform</option>
          <option value="spectrum" ?selected=${value === "spectrum"}>Spectrum</option>
          <option value="meter" ?selected=${value === "meter"}>Meter</option>
          <option value="glow" ?selected=${value === "glow"}>Background glow</option>
          <option value="ulysse31" ?selected=${value === "ulysse31"}>Ulysse 31 (Odyssey wireframe)</option>
        </select>
      </label>
    `;
  }

  private renderAudioVisualizationPositionField() {
    const value = this.config.audio_visualization_position || DEFAULT_AUDIO_VISUALIZATION_POSITION;

    return html`
      <label>
        <span>Position</span>
        <select .value=${value} @change=${(event: Event) => this.updateConfigValue("audio_visualization_position", (event.target as HTMLSelectElement).value)}>
          <option value="background" ?selected=${value === "background"}>Behind chat</option>
          <option value="top" ?selected=${value === "top"}>Above conversation</option>
          <option value="between" ?selected=${value === "between"}>Between messages</option>
          <option value="below_chat" ?selected=${value === "below_chat"}>Below conversation</option>
        </select>
      </label>
    `;
  }

  private renderCheckbox(
    label: string,
    key:
      | "minimalistic_mode"
      | "visualization_only"
      | "conversation_only"
      | "show_conversation"
      | "show_raw"
      | "show_thinking"
      | "show_summary"
      | "show_stt"
      | "show_intent"
      | "show_tts"
      | "mask_transcripts"
      | "audio_visualization"
  ) {
    return html`
      <label class="checkbox">
        <input
          type="checkbox"
          .checked=${Boolean(this.config[key])}
          @change=${(event: Event) => this.updateConfigValue(key, (event.target as HTMLInputElement).checked)}
        />
        <span>${label}</span>
      </label>
    `;
  }

  private updateConfigValue(key: keyof AssistDebugCardEditorConfig, value: unknown) {
    this.updateConfig({
      ...this.config,
      [key]: value === "" ? undefined : value,
    });
  }

  private updateNumberValue(
    key: "run_count" | "audio_visualization_height" | "audio_visualization_start_delay",
    rawValue: string,
    fallback: number,
    min: number,
    max: number
  ) {
    const parsed = Number(rawValue);
    const value = Number.isFinite(parsed)
      ? Math.min(Math.max(Math.round(parsed), min), max)
      : fallback;

    this.updateConfigValue(key, value);
  }

  private updateDecimalValue(
    key: "audio_visualization_opacity",
    rawValue: string,
    fallback: number,
    min: number,
    max: number
  ) {
    const parsed = Number(rawValue);
    const value = Number.isFinite(parsed) ? Math.min(Math.max(parsed, min), max) : fallback;

    this.updateConfigValue(key, value);
  }

  private toColorInputValue(value: string, fallback: string) {
    return /^#[0-9a-fA-F]{6}$/.test(value) ? value : fallback;
  }

  private updateConfig(config: AssistDebugCardEditorConfig) {
    this.config = config;
    fireEvent(this, "config-changed", { config });
  }

  static styles = css`
    .editor {
      display: grid;
      gap: 18px;
    }

    .grid {
      display: grid;
      gap: 12px;
    }

    label {
      display: grid;
      gap: 6px;
    }

    label span,
    legend {
      color: var(--secondary-text-color);
      font-size: 12px;
      font-weight: 500;
    }

    input,
    select {
      background: var(--card-background-color, #fff);
      border: 1px solid var(--divider-color, #ddd);
      border-radius: 6px;
      box-sizing: border-box;
      color: var(--primary-text-color);
      font: inherit;
      min-height: 40px;
      padding: 8px 10px;
      width: 100%;
    }

    fieldset {
      border: 1px solid var(--divider-color, #ddd);
      border-radius: 10px;
      display: grid;
      gap: 12px;
      margin: 0;
      padding: 12px;
    }

    .checkbox {
      align-items: center;
      display: flex;
      gap: 10px;
    }

    .checkbox input {
      min-height: auto;
      width: auto;
    }
  `;
}

class ConversationDebugCardEditor extends AssistDebugCardEditor {}

customElements.define("assist-debug-card-editor", AssistDebugCardEditor);

if (!customElements.get("conversation-debug-card-editor")) {
  customElements.define("conversation-debug-card-editor", ConversationDebugCardEditor);
}
