import { css, html, LitElement, PropertyValues, type TemplateResult } from "lit";
import { fireEvent, HomeAssistant } from "custom-card-helpers";
import {
  renderEntityPicker,
  renderIconPicker,
  renderTextField,
} from "../../shared/base-card";

type DualSetpointLayout = "two_rows" | "single_row_toggle" | "side_by_side";

type ThermostatCardEditorConfig = {
  type?: string;
  entity?: string;
  name?: string;
  icon?: string;
  compact?: boolean;
  show_controls?: boolean;
  show_modes?: boolean;
  show_presets?: boolean;
  show_fan_mode?: boolean;
  show_off_mode?: boolean;
  modes?: string[];
  presets?: string[];
  dual_setpoint_layout?: DualSetpointLayout;
  step_amount?: number;
  heating_color?: string;
  cooling_color?: string;
};

type HassEntity = {
  state: string;
  attributes: Record<string, any>;
};

const DEFAULT_ICON = "mdi:thermostat";
const DEFAULT_HEATING_COLOR = "#fbb73c";
const DEFAULT_COOLING_COLOR = "#3a8dde";
const DEFAULT_DUAL_LAYOUT: DualSetpointLayout = "two_rows";

class ThermostatCardEditor extends LitElement {
  hass?: HomeAssistant;
  config: ThermostatCardEditorConfig = {};

  static properties = {
    hass: { attribute: false },
    config: { attribute: false },
  };

  connectedCallback() {
    super.connectedCallback();
    this.loadHomeAssistantPickers();
  }

  setConfig(config: ThermostatCardEditorConfig) {
    this.config = {
      icon: DEFAULT_ICON,
      compact: false,
      show_controls: true,
      show_modes: false,
      show_presets: false,
      show_fan_mode: false,
      show_off_mode: false,
      modes: [],
      presets: [],
      dual_setpoint_layout: DEFAULT_DUAL_LAYOUT,
      step_amount: undefined,
      heating_color: DEFAULT_HEATING_COLOR,
      cooling_color: DEFAULT_COOLING_COLOR,
      ...config,
    };
  }

  shouldUpdate(changedProperties: PropertyValues): boolean {
    if (changedProperties.has("config")) {
      return true;
    }

    if (changedProperties.has("hass")) {
      const oldHass = changedProperties.get("hass") as HomeAssistant | undefined;
      // The HA pickers keep their own state after first render; avoiding
      // re-renders on every hass swap keeps the editor responsive.
      return !oldHass && Boolean(this.hass);
    }

    return false;
  }

  render() {
    const entity = this.getSelectedEntity();
    const hvacModes = this.asStringArray(entity?.attributes?.hvac_modes).filter((mode) => mode !== "off");
    const presetModes = this.asStringArray(entity?.attributes?.preset_modes);

    return html`
      <div class="editor">
        <div class="grid">
          ${renderTextField({
            label: "Name",
            value: String(this.config.name || ""),
            placeholder: "Thermostat",
            onInput: (value) => this.updateConfigValue("name", value),
          })}
          ${renderEntityPicker({
            hass: this.hass,
            label: "Climate entity",
            value: String(this.config.entity || ""),
            domains: ["climate"],
            onValueChanged: (value) => this.updateConfigValue("entity", value),
          })}
          ${renderIconPicker({
            hass: this.hass,
            label: "Icon",
            value: String(this.config.icon || ""),
            fallback: DEFAULT_ICON,
            onValueChanged: (value) => this.updateConfigValue("icon", value),
          })}
        </div>

        <fieldset>
          <legend>Layout</legend>
          ${this.renderToggle("Compact header only", "compact")}
          ${this.renderToggle("Show temperature controls", "show_controls")}
          ${this.renderToggle("Show HVAC mode buttons", "show_modes")}
          ${this.renderToggle("Show preset buttons", "show_presets")}
          ${this.renderToggle("Show fan mode button", "show_fan_mode")}
          ${this.renderToggle("Show off mode button", "show_off_mode")}
          ${this.renderDualLayoutSelect()}
          ${this.renderNumberInput("Step amount", "step_amount", "Entity target_temp_step")}
        </fieldset>

        <fieldset>
          <legend>Colors</legend>
          ${this.renderColorInput("Heating background", "heating_color", DEFAULT_HEATING_COLOR)}
          ${this.renderColorInput("Cooling background", "cooling_color", DEFAULT_COOLING_COLOR)}
        </fieldset>

        <fieldset>
          <legend>HVAC Modes</legend>
          ${this.renderOptionList({
            options: hvacModes,
            selected: this.asStringArray(this.config.modes),
            emptyMessage: this.config.entity ? "This entity does not expose HVAC modes." : "Pick a climate entity to choose modes.",
            onChanged: (values) => this.updateConfigValue("modes", values),
          })}
        </fieldset>

        <fieldset>
          <legend>Preset Modes</legend>
          ${this.renderOptionList({
            options: presetModes,
            selected: this.asStringArray(this.config.presets),
            emptyMessage: this.config.entity ? "This entity does not expose preset modes." : "Pick a climate entity to choose presets.",
            onChanged: (values) => this.updateConfigValue("presets", values),
          })}
        </fieldset>
      </div>
    `;
  }

  private renderToggle(label: string, key: keyof ThermostatCardEditorConfig) {
    return html`
      <label class="toggle">
        <span>${label}</span>
        <input
          type="checkbox"
          .checked=${Boolean(this.config[key])}
          @change=${(event: Event) => this.updateConfigValue(key, (event.target as HTMLInputElement).checked)}
        />
      </label>
    `;
  }

  private renderDualLayoutSelect() {
    const options: { value: DualSetpointLayout; label: string }[] = [
      { value: "two_rows", label: "Two rows" },
      { value: "single_row_toggle", label: "Single row with toggle" },
      { value: "side_by_side", label: "Side by side" },
    ];

    return html`
      <label>
        <span>Dual setpoint layout</span>
        <select
          .value=${this.config.dual_setpoint_layout || DEFAULT_DUAL_LAYOUT}
          @change=${(event: Event) => this.updateConfigValue("dual_setpoint_layout", (event.target as HTMLSelectElement).value)}
        >
          ${options.map((option) => html`
            <option value=${option.value} ?selected=${option.value === this.config.dual_setpoint_layout}>
              ${option.label}
            </option>
          `)}
        </select>
      </label>
    `;
  }

  private renderColorInput(label: string, key: "heating_color" | "cooling_color", fallback: string) {
    const value = this.toColorInputValue(String(this.config[key] || fallback), fallback);

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

  private renderNumberInput(label: string, key: "step_amount", placeholder: string) {
    const value = this.config[key] === undefined ? "" : String(this.config[key]);

    return html`
      <label>
        <span>${label}</span>
        <input
          type="number"
          min="0.1"
          step="0.1"
          .value=${value}
          placeholder=${placeholder}
          @input=${(event: InputEvent) => this.updateNumberConfigValue(key, (event.target as HTMLInputElement).value)}
        />
      </label>
    `;
  }

  private renderOptionList(params: {
    options: string[];
    selected: string[];
    emptyMessage: string;
    onChanged: (values: string[]) => void;
  }): TemplateResult {
    const { options, selected, emptyMessage, onChanged } = params;

    if (!options.length) {
      return html`<div class="hint">${emptyMessage}</div>`;
    }

    return html`
      <div class="option-list">
        ${options.map((option) => {
          const checked = selected.includes(option);
          return html`
            <label class="checkbox-row">
              <input
                type="checkbox"
                .checked=${checked}
                @change=${(event: Event) => this.updateOptionList(options, selected, option, (event.target as HTMLInputElement).checked, onChanged)}
              />
              <span>${this.toLabel(option)}</span>
            </label>
          `;
        })}
      </div>
    `;
  }

  private updateOptionList(
    options: string[],
    selected: string[],
    option: string,
    checked: boolean,
    onChanged: (values: string[]) => void
  ) {
    const nextSelected = checked
      ? [...selected, option]
      : selected.filter((value) => value !== option);

    onChanged(options.filter((value) => nextSelected.includes(value)));
  }

  private updateConfigValue(key: keyof ThermostatCardEditorConfig, value: unknown) {
    const nextValue = this.normalizeConfigValue(value);
    const nextConfig = {
      ...this.config,
      [key]: nextValue,
    };

    this.updateConfig(nextConfig);
  }

  private updateNumberConfigValue(key: "step_amount", value: string) {
    const numericValue = Number(value);
    this.updateConfigValue(key, value.trim() && Number.isFinite(numericValue) && numericValue > 0 ? numericValue : undefined);
  }

  private normalizeConfigValue(value: unknown) {
    if (typeof value === "string") {
      return value.trim() || undefined;
    }

    if (Array.isArray(value)) {
      return value.length ? value : undefined;
    }

    return value;
  }

  private updateConfig(config: ThermostatCardEditorConfig) {
    this.config = config;
    fireEvent(this, "config-changed", { config });
  }

  private getSelectedEntity() {
    const entityId = this.config.entity;
    return entityId ? (this.hass?.states?.[entityId] as HassEntity | undefined) : undefined;
  }

  private asStringArray(value: unknown): string[] {
    return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
  }

  private toColorInputValue(value: string, fallback: string) {
    return /^#[0-9a-f]{6}$/i.test(value) ? value : fallback;
  }

  private toLabel(value: string) {
    return value
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }

  private async loadHomeAssistantPickers() {
    const loadCardHelpers = window.loadCardHelpers;

    if (
      (customElements.get("ha-entity-picker") && customElements.get("ha-icon-picker")) ||
      !loadCardHelpers
    ) {
      return;
    }

    const helpers = await loadCardHelpers();
    const entitiesCard = await helpers.createCardElement({
      type: "entities",
      entities: [],
    });

    await entitiesCard.constructor.getConfigElement();
    this.requestUpdate();
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

    .field {
      display: block;
    }

    ha-entity-picker,
    ha-icon-picker {
      display: block;
      width: 100%;
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

    input[type="checkbox"] {
      accent-color: var(--primary-color);
      min-height: auto;
      padding: 0;
      width: auto;
    }

    input[type="color"] {
      cursor: pointer;
      padding: 4px;
    }

    fieldset {
      border: 1px solid var(--divider-color, #ddd);
      border-radius: 10px;
      display: grid;
      gap: 12px;
      margin: 0;
      padding: 12px;
    }

    .toggle,
    .checkbox-row {
      align-items: center;
      display: flex;
      gap: 10px;
      justify-content: space-between;
    }

    .checkbox-row {
      justify-content: flex-start;
    }

    .option-list {
      display: grid;
      gap: 8px;
    }

    .hint {
      color: var(--secondary-text-color);
      font-size: 12px;
    }
  `;
}

customElements.define("thermostat-card-editor", ThermostatCardEditor);
