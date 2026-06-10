import { css, html, LitElement, PropertyValues } from "lit";
import { fireEvent, HomeAssistant } from "custom-card-helpers";
import {
  clampNumber,
  renderAssistPipelinePicker,
  renderCheckbox,
  renderTextField,
  sharedEditorStyles,
  toColorInputValue,
} from "../../shared/base-card";
import { formatAssistError } from "../../shared/assist-format";
import { AssistPipeline, listAssistPipelines } from "../../shared/assist-pipeline";
import {
  ASSIST_DEBUG_CARD_DEFAULTS,
  ASSIST_DEBUG_CARD_EDITOR_COLOR_INPUT,
  type AssistDebugCardConfig,
  type AudioVisualizationColorKey,
  type AudioVisualizationPosition,
  type AudioVisualizationType,
  type MetadataMode,
  getDebugConfigValue,
} from "./assist-debug-card-config";

const DEFAULTS = ASSIST_DEBUG_CARD_DEFAULTS;

class AssistDebugCardEditor extends LitElement {
  hass?: HomeAssistant;
  config: AssistDebugCardConfig = {};
  private pipelines: AssistPipeline[] = [];
  private pipelinesLoading = false;
  private pipelineError = "";

  static properties = {
    hass: { attribute: false },
    config: { attribute: false },
    pipelines: { state: true },
    pipelinesLoading: { state: true },
    pipelineError: { state: true },
  };

  setConfig(config: AssistDebugCardConfig) {
    this.config = config || {};
  }

  private getValue<K extends keyof typeof DEFAULTS>(key: K): (typeof DEFAULTS)[K] {
    return getDebugConfigValue(this.config, key);
  }

  shouldUpdate(changedProperties: PropertyValues): boolean {
    if (changedProperties.has("config")) {
      return true;
    }

    if (
      changedProperties.has("pipelines") ||
      changedProperties.has("pipelinesLoading") ||
      changedProperties.has("pipelineError")
    ) {
      return true;
    }

    if (changedProperties.has("hass")) {
      const oldHass = changedProperties.get("hass") as HomeAssistant | undefined;
      return !oldHass && Boolean(this.hass);
    }

    return false;
  }

  updated(changedProperties: PropertyValues) {
    const firstHass = changedProperties.has("hass") && !changedProperties.get("hass");
    if (firstHass) {
      void this.loadPipelines();
    }
  }

  private async loadPipelines() {
    if (!this.hass || this.pipelinesLoading) {
      return;
    }

    this.pipelinesLoading = true;
    this.pipelineError = "";

    try {
      const response = await listAssistPipelines(this.hass);
      this.pipelines = response.pipelines || [];
    } catch (error) {
      this.pipelineError = formatAssistError(error, { fallback: "Unable to load pipelines." });
    } finally {
      this.pipelinesLoading = false;
    }
  }

  render() {
    return html`
      <div class="editor">
        <div class="grid">
          ${renderTextField({
            label: "Title",
            value: String(this.config.title || ""),
            placeholder: DEFAULTS.title,
            onInput: (value) => this.updateConfigValue("title", value),
          })}
          ${renderAssistPipelinePicker({
            hass: this.hass,
            label: "Pipeline",
            value: String(this.getValue("pipeline_id")),
            pipelines: this.pipelines,
            loading: this.pipelinesLoading,
            error: this.pipelineError,
            onChange: (value) => this.updateConfigValue("pipeline_id", value),
          })}
          ${this.renderNumberField("Recent runs", "run_count", DEFAULTS.run_count, 1, 20)}
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
          ${this.renderNumberField("Height", "audio_visualization_height", DEFAULTS.audio_visualization_height, 24, 180)}
          ${this.renderNumberField("Visualization start delay (ms)", "audio_visualization_start_delay", DEFAULTS.audio_visualization_start_delay, 0, 10000)}
          ${this.renderDecimalField("Opacity", "audio_visualization_opacity", DEFAULTS.audio_visualization_opacity, 0.05, 1, 0.05)}
          ${this.renderColorInput(
            "Primary color",
            "audio_visualization_color",
            DEFAULTS.audio_visualization_color,
            ASSIST_DEBUG_CARD_EDITOR_COLOR_INPUT.audio_visualization_color
          )}
          ${this.renderColorInput(
            "Secondary color",
            "audio_visualization_secondary_color",
            DEFAULTS.audio_visualization_secondary_color,
            ASSIST_DEBUG_CARD_EDITOR_COLOR_INPUT.audio_visualization_secondary_color
          )}
          ${this.renderColorInput(
            "Background",
            "audio_visualization_background",
            DEFAULTS.audio_visualization_background,
            ASSIST_DEBUG_CARD_EDITOR_COLOR_INPUT.audio_visualization_background
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
    const value = toColorInputValue(String(this.config[key] || fallback), colorInputFallback);

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
    const value = this.getValue("metadata_mode");

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
    const value = this.getValue("audio_visualization_type");

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
    const value = this.getValue("audio_visualization_position");

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

  private renderCheckbox(label: string, key: keyof typeof DEFAULTS) {
    return renderCheckbox({
      label,
      checked: Boolean(this.getValue(key)),
      onChange: (checked) => this.updateConfigValue(key, checked),
    });
  }

  private updateConfigValue(key: keyof AssistDebugCardConfig, value: unknown) {
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
    this.updateConfigValue(key, clampNumber(rawValue, fallback, min, max));
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

  private updateConfig(config: AssistDebugCardConfig) {
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
