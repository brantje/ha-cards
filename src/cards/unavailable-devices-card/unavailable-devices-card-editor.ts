import { css, html, LitElement, PropertyValues } from "lit";
import { fireEvent, HomeAssistant } from "custom-card-helpers";
import { renderTextField } from "../../shared/base-card";

type RowDetailMode = "none" | "count" | "entities";

type UnavailableDevicesCardEditorConfig = {
  type?: string;
  title?: string;
  domains?: string[] | string;
  issue_states?: string[] | string;
  ignored_entities?: string[] | string;
  ignored_devices?: string[] | string;
  ignored_name_patterns?: string[] | string;
  row_detail?: RowDetailMode;
};

const DEFAULT_TITLE = "Possible Issues";
const DEFAULT_DOMAINS = ["sensor", "light", "switch"];
const DEFAULT_ISSUE_STATES = ["unavailable"];
const DEFAULT_ROW_DETAIL: RowDetailMode = "none";

class UnavailableDevicesCardEditor extends LitElement {
  hass?: HomeAssistant;
  config: UnavailableDevicesCardEditorConfig = {};

  static properties = {
    hass: { attribute: false },
    config: { attribute: false },
  };

  setConfig(config: UnavailableDevicesCardEditorConfig) {
    this.config = {
      title: DEFAULT_TITLE,
      domains: DEFAULT_DOMAINS,
      issue_states: DEFAULT_ISSUE_STATES,
      ignored_entities: [],
      ignored_devices: [],
      ignored_name_patterns: [],
      row_detail: DEFAULT_ROW_DETAIL,
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
          ${this.renderListField("Domains", "domains", DEFAULT_DOMAINS, "sensor, light, switch")}
          ${this.renderListField("Issue states", "issue_states", DEFAULT_ISSUE_STATES, "unavailable, unknown")}
          ${this.renderListField("Ignored entity IDs or patterns", "ignored_entities", [], "sensor.openweathermap_weather")}
          ${this.renderListField("Ignored device IDs or patterns", "ignored_devices", [], "nuki, 65oled855")}
          ${this.renderListField("Ignored name patterns", "ignored_name_patterns", [], "Printer, Test device")}
          ${this.renderRowDetailField()}
        </div>
      </div>
    `;
  }

  private renderListField(
    label: string,
    key: keyof UnavailableDevicesCardEditorConfig,
    fallback: string[],
    placeholder: string
  ) {
    return renderTextField({
      label,
      value: this.formatList(this.config[key] as string[] | string | undefined, fallback),
      placeholder,
      onInput: (value) => this.updateListValue(key, value),
    });
  }

  private renderRowDetailField() {
    const value = this.config.row_detail || DEFAULT_ROW_DETAIL;

    return html`
      <label>
        <span>Row detail</span>
        <select
          .value=${value}
          @change=${(event: Event) =>
            this.updateConfigValue("row_detail", (event.target as HTMLSelectElement).value as RowDetailMode)}
        >
          <option value="none" ?selected=${value === "none"}>None</option>
          <option value="count" ?selected=${value === "count"}>Affected entity count</option>
          <option value="entities" ?selected=${value === "entities"}>Affected entity names</option>
        </select>
      </label>
    `;
  }

  private updateConfigValue(key: keyof UnavailableDevicesCardEditorConfig, value: unknown) {
    this.updateConfig({
      ...this.config,
      [key]: value === "" ? undefined : value,
    });
  }

  private updateListValue(key: keyof UnavailableDevicesCardEditorConfig, value: string) {
    this.updateConfig({
      ...this.config,
      [key]: this.parseList(value),
    });
  }

  private parseList(value: string) {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  private formatList(value: string[] | string | undefined, fallback: string[]) {
    const source = value === undefined || value === null || value === "" ? fallback : value;
    return Array.isArray(source) ? source.join(", ") : String(source);
  }

  private updateConfig(config: UnavailableDevicesCardEditorConfig) {
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

    label span {
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
  `;
}

customElements.define("unavailable-devices-card-editor", UnavailableDevicesCardEditor);
