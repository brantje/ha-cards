import { css, html, LitElement, PropertyValues } from "lit";
import { fireEvent, HomeAssistant } from "custom-card-helpers";
import { renderJinjaCodeEditor, renderTextField } from "../../shared/base-card";
import { loadHaEditorComponents } from "../../shared/ha-component-loader";
import { DEFAULT_SPEECH_RMS_THRESHOLD } from "../../shared/assist-audio-recorder";
import { AssistPipeline, listAssistPipelines } from "../../shared/assist-pipeline";
import {
  ASSIST_CHAT_CARD_DEFAULTS,
  ASSIST_CHAT_CARD_EDITOR_COLOR_FALLBACKS,
  AssistChatCardConfig,
  normalizeSuggestedPrompts,
} from "./assist-chat-card-config";

const DEFAULTS = ASSIST_CHAT_CARD_DEFAULTS;

class AssistChatCardEditor extends LitElement {
  hass?: HomeAssistant;
  config: AssistChatCardConfig = {};
  private pipelines: AssistPipeline[] = [];
  private pipelinesLoading = false;
  private pipelineError = "";
  private haComponentsVersion = 0;

  static properties = {
    hass: { attribute: false },
    config: { attribute: false },
    pipelines: { state: true },
    pipelinesLoading: { state: true },
    pipelineError: { state: true },
    haComponentsVersion: { state: true },
  };

  /**
   * Keep the stored config as-is. Defaults are applied at read time via
   * `getValue` so the editor only ever emits keys the user actually set —
   * baking defaults in here is how card and editor previously diverged.
   */
  setConfig(config: AssistChatCardConfig) {
    this.config = config || {};
  }

  private getValue<K extends keyof typeof DEFAULTS>(key: K): (typeof DEFAULTS)[K] {
    const value = this.config[key];
    return (value === undefined ? DEFAULTS[key] : value) as (typeof DEFAULTS)[K];
  }

  shouldUpdate(changedProperties: PropertyValues): boolean {
    // Only gate `hass` (re-render solely on its first arrival); any other
    // declared reactive property should always render.
    if (changedProperties.size === 1 && changedProperties.has("hass")) {
      return !changedProperties.get("hass") && Boolean(this.hass);
    }

    return true;
  }

  connectedCallback() {
    super.connectedCallback();
    void this.loadHomeAssistantPickers();
  }

  updated(changedProperties: PropertyValues) {
    const firstHass = changedProperties.has("hass") && !changedProperties.get("hass");
    if (firstHass) {
      void this.loadPipelines();
    }
  }

  render() {
    return html`
      <div class="editor">
        ${this.renderNonAdminNotice()}
        <div class="grid">
          ${renderTextField({
            label: "Title",
            value: String(this.config.title || ""),
            placeholder: DEFAULTS.title,
            onInput: (value) => this.updateConfigValue("title", value),
          })}
          ${this.renderCheckbox("Show header (title, pipeline, status)", "show_header")}
          ${this.renderPipelineField()}
          ${this.renderNumberInput("Recent runs", "run_count", DEFAULTS.run_count, 0, 20)}
        </div>

        <fieldset>
          <legend>Input</legend>
          ${this.renderCheckbox("Enable text input", "text_input")}
          ${this.renderCheckbox(
            "Keep conversation in this card only (like built-in Assist)",
            "session_conversation"
          )}
        </fieldset>

        <fieldset>
          <legend>Voice</legend>
          ${this.renderCheckbox("Enable voice input", "voice_input")}
          ${this.renderCheckbox("Enable audio playback", "enable_audio_playback")}
          <p class="hint">
            When enabled, runs the TTS pipeline stage and plays reply audio for text and voice input.
          </p>
          ${this.renderCheckbox(
            "Continue listening for follow-up questions",
            "continue_conversation",
            !this.getValue("voice_input")
          )}
          ${this.renderCheckbox(
            "Always continue listening after replies",
            "always_continue_conversation",
            !this.getValue("voice_input")
          )}
          ${this.renderCheckbox("Disable speech controls", "disable_speech", !this.getValue("voice_input"))}
         
          ${this.renderFloatInput(
            "Speech RMS threshold",
            "speech_rms_threshold",
            DEFAULT_SPEECH_RMS_THRESHOLD,
            0,
            0.5,
            0.001,
            !this.getValue("voice_input")
          )}
          <p class="hint">
            Minimum audio level (0–1) required before voice is sent for speech-to-text. Lower values
            pick up quieter speech; higher values ignore more background noise.
          </p>
        </fieldset>

        <fieldset>
          <legend>Prompts</legend>
          ${this.renderSuggestedPromptsField()}
          ${this.renderCheckbox("Show suggested prompts when chat is empty", "show_suggested_prompts")}
          ${this.renderCheckbox(
            "Always show suggested prompts",
            "always_show_suggested_prompts",
            !this.getValue("show_suggested_prompts")
          )}
        </fieldset>

        <fieldset>
          <legend>Process</legend>
          ${this.renderCheckbox("Show process and timings", "show_process")}
          ${this.renderCheckbox("Show thinking until response", "show_thinking_until_response")}
          ${this.renderCheckbox("Show message time", "show_message_time")}
        </fieldset>

        <fieldset>
          <legend>Style</legend>
          <div class="style-grid">
            ${this.renderColorInput("Background", "background_color")}
            ${this.renderColorInput("Surface", "surface_color")}
            ${this.renderColorInput("User bubble", "user_chat_color")}
            ${this.renderColorInput("User text", "user_chat_text_color")}
            ${this.renderColorInput("Assistant bubble", "assistant_chat_color")}
            ${this.renderColorInput("Assistant text", "assistant_chat_text_color")}
          </div>
          <p class="hint">
            Colors follow the active theme by default; picking a color overrides the theme for that
            element.
          </p>
        </fieldset>
      </div>
    `;
  }

  private isNonAdminUser() {
    return Boolean(this.hass?.user && !this.hass.user.is_admin);
  }

  private renderNonAdminNotice() {
    if (!this.isNonAdminUser()) {
      return "";
    }

    return html`
      <div class="notice" role="note">
        <strong>Limited for non-admin users</strong>
        <p>
          You are signed in without administrator access. Home Assistant only allows admins to use the
          Assist pipeline debug APIs (<code>assist_pipeline/pipeline_debug/*</code>).
        </p>
        <p>The following will not work on this card:</p>
        <ul>
          <li>Recent run history (<code>run_count</code>)</li>
          <li>Live updates from external or wake-word conversations</li>
          <li>Reloading past messages, thinking text, or process chips after a refresh</li>
        </ul>
        <p>The following still works:</p>
        <ul>
          <li>Live text chat in the current browser session</li>
          <li>Voice input and playback while you are actively using the card</li>
          <li>Thinking and process details for conversations you start yourself</li>
        </ul>
      </div>
    `;
  }

  private renderPipelineField() {
    const value = this.getValue("pipeline_id");

    return html`
      <label>
        <span>Pipeline</span>
        <select
          .value=${value}
          ?disabled=${this.pipelinesLoading}
          @change=${(event: Event) => this.updateConfigValue("pipeline_id", (event.target as HTMLSelectElement).value)}
        >
          <option value=${DEFAULTS.pipeline_id} ?selected=${value === DEFAULTS.pipeline_id}>
            Preferred pipeline
          </option>
          <option value="last_used" ?selected=${value === "last_used"}>Last used pipeline</option>
          ${this.pipelines.map(
            (pipeline) => html`
              <option value=${pipeline.id} ?selected=${value === pipeline.id}>
                ${pipeline.name || pipeline.id}
              </option>
            `
          )}
        </select>
        ${this.pipelineError ? html`<small class="error">${this.pipelineError}</small> ` : ""}
      </label>
    `;
  }

  private renderSuggestedPromptsField() {
    return html`
      ${renderJinjaCodeEditor({
        hass: this.hass,
        label: "Suggested prompts (one per line)",
        fieldName: "suggested_prompts",
        value: normalizeSuggestedPrompts(this.config.suggested_prompts),
        onValueChanged: (value) => this.updateConfigValue("suggested_prompts", value),
      })}
      <p class="hint">
        Supports Home Assistant templating (<a href="https://www.home-assistant.io/docs/templating/" target="_blank" rel="noopener noreferrer">docs</a>).
        Each rendered line becomes a prompt chip.
      </p>
    `;
  }

  private async loadHomeAssistantPickers() {
    try {
      const loaded = await loadHaEditorComponents();
      if (loaded) {
        this.haComponentsVersion += 1;
      }
    } catch (error) {
      console.warn("assist-chat-card: Failed to load Home Assistant editor components", error);
    }
  }

  private renderCheckbox(
    label: string,
    key: keyof typeof ASSIST_CHAT_CARD_DEFAULTS,
    disabled = false
  ) {
    return html`
      <label class="checkbox">
        <input
          type="checkbox"
          .checked=${Boolean(this.getValue(key))}
          ?disabled=${disabled}
          @change=${(event: Event) => this.updateConfigValue(key, (event.target as HTMLInputElement).checked)}
        />
        <span>${label}</span>
      </label>
    `;
  }

  private renderColorInput(label: string, key: keyof typeof ASSIST_CHAT_CARD_DEFAULTS) {
    const fallback = ASSIST_CHAT_CARD_EDITOR_COLOR_FALLBACKS[key] || "#000000";

    return html`
      <label>
        <span>${label}</span>
        <input
          type="color"
          .value=${this.toColorInputValue(String(this.config[key] || ""), fallback)}
          @change=${(event: Event) => this.updateConfigValue(key, (event.target as HTMLInputElement).value)}
        />
      </label>
    `;
  }

  private renderNumberInput(
    label: string,
    key: "run_count",
    fallback: number,
    min: number,
    max: number
  ) {
    const value = Number(this.getValue(key));

    return html`
      <label>
        <span>${label}</span>
        <input
          type="number"
          min=${String(min)}
          max=${String(max)}
          .value=${String(Number.isFinite(value) ? value : fallback)}
          @change=${(event: Event) =>
            this.updateNumberValue(key, (event.target as HTMLInputElement).value, fallback, min, max)}
        />
      </label>
    `;
  }

  private renderFloatInput(
    label: string,
    key: "speech_rms_threshold",
    fallback: number,
    min: number,
    max: number,
    step: number,
    disabled = false
  ) {
    const value = Number(this.getValue(key));

    return html`
      <label>
        <span>${label}</span>
        <input
          type="number"
          min=${String(min)}
          max=${String(max)}
          step=${String(step)}
          ?disabled=${disabled}
          .value=${String(Number.isFinite(value) ? value : fallback)}
          @change=${(event: Event) =>
            this.updateFloatValue(key, (event.target as HTMLInputElement).value, fallback, min, max)}
        />
      </label>
    `;
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
      this.pipelineError = this.formatError(error);
    } finally {
      this.pipelinesLoading = false;
    }
  }

  private updateConfigValue(key: keyof AssistChatCardConfig, value: unknown) {
    this.updateConfig({
      ...this.config,
      [key]: value,
    });
  }

  private updateNumberValue(
    key: "run_count",
    rawValue: string,
    fallback: number,
    min: number,
    max: number
  ) {
    const parsed = Number(rawValue);
    const value = Number.isFinite(parsed) ? Math.min(Math.max(Math.round(parsed), min), max) : fallback;
    this.updateConfigValue(key, value);
  }

  private updateFloatValue(
    key: "speech_rms_threshold",
    rawValue: string,
    fallback: number,
    min: number,
    max: number
  ) {
    const parsed = Number(rawValue);
    const value = Number.isFinite(parsed) ? Math.min(Math.max(parsed, min), max) : fallback;
    this.updateConfigValue(key, value);
  }

  private updateConfig(config: AssistChatCardConfig) {
    this.config = config;
    fireEvent(this, "config-changed", { config });
  }

  private toColorInputValue(value: string, fallback: string) {
    return /^#[0-9a-f]{6}$/i.test(value) ? value : fallback;
  }

  private formatError(error: unknown) {
    if (error && typeof error === "object") {
      const maybeError = error as { message?: string; code?: string };
      return maybeError.message || maybeError.code || "Unable to load pipelines.";
    }

    return "Unable to load pipelines.";
  }

  static styles = css`
    .editor {
      display: grid;
      gap: 16px;
    }

    .grid,
    fieldset {
      display: grid;
      gap: 12px;
    }

    .style-grid {
      display: grid;
      gap: 12px;
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    fieldset {
      border: 1px solid var(--divider-color, #ddd);
      border-radius: 12px;
      margin: 0;
      padding: 12px;
    }

    legend {
      color: var(--secondary-text-color);
      font-size: 12px;
      font-weight: 700;
      padding: 0 6px;
    }

    label {
      color: var(--primary-text-color);
      display: grid;
      gap: 6px;
      font-size: 12px;
      font-weight: 600;
    }

    input,
    select,
    textarea {
      background: var(--card-background-color, #fff);
      border: 1px solid var(--divider-color, #ddd);
      border-radius: 10px;
      box-sizing: border-box;
      color: var(--primary-text-color);
      font: inherit;
      min-height: 40px;
      padding: 8px 10px;
    }

    textarea {
      min-height: 96px;
      resize: vertical;
    }

    input[type="color"] {
      padding: 4px;
    }

    .checkbox {
      align-items: center;
      display: flex;
      flex-direction: row;
      gap: 10px;
    }

    .checkbox input {
      min-height: auto;
      width: auto;
    }

    input:disabled,
    select:disabled {
      cursor: default;
      opacity: 0.55;
    }

    small,
    .error {
      color: var(--error-color, #db4437);
      font-size: 11px;
      font-weight: 500;
    }

    .notice {
      background: rgba(var(--rgb-warning-color, 255, 166, 0), 0.12);
      border: 1px solid var(--warning-color, #ffa600);
      border-radius: 12px;
      color: var(--primary-text-color);
      display: grid;
      font-size: 12px;
      font-weight: 400;
      gap: 8px;
      line-height: 1.45;
      padding: 12px;
    }

    .notice strong {
      font-size: 13px;
      font-weight: 700;
    }

    .notice p {
      margin: 0;
    }

    .notice ul {
      margin: 0;
      padding-left: 18px;
    }

    .notice li + li {
      margin-top: 4px;
    }

    .notice code {
      font-size: 11px;
    }

    .hint {
      color: var(--secondary-text-color);
      font-size: 11px;
      font-weight: 400;
      line-height: 1.45;
      margin: 0;
    }

    .hint a {
      color: var(--primary-color);
    }
  `;
}

customElements.define("assist-chat-card-editor", AssistChatCardEditor);
