import { css, html, LitElement, PropertyValues } from "lit";
import { ActionConfig, fireEvent, HomeAssistant } from "custom-card-helpers";
import {
  renderSharedActionEditor,
  renderEntityPicker,
  renderTextField,
} from "../../shared/base-card";

type WelcomeTabConfig = {
  icon?: string;
  label?: string;
  color?: string;
  tap_action?: ActionConfig;
};

type WelcomeCardEditorConfig = {
  type?: string;
  weather_entity?: string;
  show_temperature?: boolean;
  use_ha_weather_icons?: boolean;
  temperature_entity?: string;
  settings_navigation_path?: string;
  tabs?: WelcomeTabConfig[];
};

type ActionType = ActionConfig["action"];

const DEFAULT_SETTINGS_NAVIGATION_PATH = "/config/dashboard";

const DEFAULT_TABS: WelcomeTabConfig[] = [
  {
    icon: "mdi:home",
    label: "Home",
    color: "#86a9f8",
    tap_action: { action: "navigate", navigation_path: "/lovelace/home" },
  },
  {
    icon: "mdi:lightbulb",
    label: "Lights",
    color: "#ffd34c",
    tap_action: { action: "navigate", navigation_path: "/lovelace/lights" },
  },
  {
    icon: "mdi:shield",
    label: "Secur...",
    color: "#7fd493",
    tap_action: { action: "navigate", navigation_path: "/lovelace/security" },
  },
  {
    icon: "mdi:keyboard",
    label: "Lab",
    color: "#7c3cff",
    tap_action: { action: "navigate", navigation_path: "/lovelace/lab" },
  },
];

const ACTION_OPTIONS: { value: ActionType; label: string }[] = [
  { value: "more-info", label: "More info" },
  { value: "toggle", label: "Toggle" },
  { value: "navigate", label: "Navigate" },
  { value: "url", label: "URL" },
  { value: "call-service", label: "Call service" },
  { value: "fire-dom-event", label: "Fire DOM event" },
  { value: "none", label: "None" },
];

class WelcomeCardEditor extends LitElement {
  hass?: HomeAssistant;
  config: WelcomeCardEditorConfig = {};
  private serviceDataErrors: Partial<Record<string, string>> = {};

  static properties = {
    hass: { attribute: false },
    config: { attribute: false },
  };

  connectedCallback() {
    super.connectedCallback();
    this.loadHomeAssistantPickers();
  }

  setConfig(config: WelcomeCardEditorConfig) {
    this.config = {
      show_temperature: true,
      use_ha_weather_icons: false,
      settings_navigation_path: DEFAULT_SETTINGS_NAVIGATION_PATH,
      tabs: DEFAULT_TABS,
      ...config,
    };
  }

  shouldUpdate(changedProperties: PropertyValues): boolean {
    if (changedProperties.has("config")) {
      return true;
    }

    if (changedProperties.has("hass")) {
      const oldHass = changedProperties.get("hass") as HomeAssistant | undefined;
      // Pickers maintain their own state after initial setup; forwarding every
      // HA state tick makes large installs sluggish in the card editor.
      return !oldHass && Boolean(this.hass);
    }

    return false;
  }

  render() {
    return html`
      <div class="editor">
        <div class="grid">
          ${renderEntityPicker({
            hass: this.hass,
            label: "Weather entity",
            value: String(this.config.weather_entity || ""),
            domains: ["weather"],
            onValueChanged: (value) => this.updateConfigValue("weather_entity", value),
          })}
          ${this.renderCheckbox("Show temperature", "show_temperature")}
          ${this.renderCheckbox("Use Home Assistant weather icons", "use_ha_weather_icons")}
          ${renderEntityPicker({
            hass: this.hass,
            label: "Temperature entity override",
            value: String(this.config.temperature_entity || ""),
            domains: ["sensor"],
            disabled: !this.config.show_temperature,
            onValueChanged: (value) => this.updateConfigValue("temperature_entity", value),
          })}
          ${renderTextField({
            label: "Settings navigation path",
            value: String(this.config.settings_navigation_path || ""),
            placeholder: DEFAULT_SETTINGS_NAVIGATION_PATH,
            onInput: (value) => this.updateConfigValue("settings_navigation_path", value),
          })}
        </div>

        <section>
          <div class="section-header">
            <h3>Tabs</h3>
            <button type="button" @click=${this.addTab}>Add tab</button>
          </div>
          <div class="tabs-editor">${(this.config.tabs || []).map((tab, index) => this.renderTab(tab, index))}</div>
        </section>
      </div>
    `;
  }

  private renderTab(tab: WelcomeTabConfig, index: number) {
    return html`
      <fieldset class="tab-editor">
        <legend>Tab ${index + 1}</legend>

        <div class="tab-controls">
          <button type="button" ?disabled=${index === 0} @click=${() => this.moveTab(index, -1)}>
            Move up
          </button>
          <button
            type="button"
            ?disabled=${index === (this.config.tabs || []).length - 1}
            @click=${() => this.moveTab(index, 1)}
          >
            Move down
          </button>
          <button type="button" @click=${() => this.removeTab(index)}>Remove</button>
        </div>

        <div class="grid">
          ${this.renderTabIconPicker(index, tab.icon || "mdi:shape")}
          ${this.renderTabTextField(index, "label", "Label", "Home")}
          ${this.renderTabTextField(index, "color", "Color", "#86a9f8")}
        </div>

        ${this.renderTabActionEditor("Tap action", index, tab.tap_action || { action: "none" })}
      </fieldset>
    `;
  }

  private renderCheckbox(label: string, key: keyof WelcomeCardEditorConfig) {
    return html`
      <label class="checkbox">
        <input
          type="checkbox"
          .checked=${Boolean(this.config[key])}
          @change=${(event: Event) =>
            this.updateConfigValue(key, (event.target as HTMLInputElement).checked)}
        />
        <span>${label}</span>
      </label>
    `;
  }

  private renderTabIconPicker(index: number, fallback: string) {
    const tab = this.getTab(index);

    return html`
      <div class="field">
        <ha-icon-picker
          .hass=${this.hass}
          .label=${"Icon"}
          .value=${tab.icon || fallback}
          @value-changed=${(event: CustomEvent) => this.updateTabValue(index, "icon", event.detail.value)}
        ></ha-icon-picker>
      </div>
    `;
  }

  private renderTabTextField(index: number, key: keyof WelcomeTabConfig, label: string, placeholder = "") {
    const tab = this.getTab(index);

    return html`
      <label>
        <span>${label}</span>
        <input
          .value=${String(tab[key] || "")}
          placeholder=${placeholder}
          @input=${(event: InputEvent) =>
            this.updateTabValue(index, key, (event.target as HTMLInputElement).value)}
        />
      </label>
    `;
  }

  private renderTabActionEditor(label: string, index: number, actionConfig: ActionConfig) {
    const errorKey = this.getServiceDataErrorKey(index);

    return renderSharedActionEditor<ActionType>({
      label,
      className: "action-editor",
      actionConfig: actionConfig as any,
      actionOptions: ACTION_OPTIONS as any,
      onActionTypeChanged: (action) => this.updateTabActionType(index, action),
      onActionValueChanged: (property, value) => this.updateTabActionValue(index, property, value),
      onServiceDataChanged: (value) => this.updateServiceData(index, value),
      formatJson: (value) => this.formatJson(value),
      serviceDataError: this.serviceDataErrors[errorKey],
    });
  }

  private updateConfigValue(key: keyof WelcomeCardEditorConfig, value: unknown) {
    const nextConfig = {
      ...this.config,
      [key]: value === "" ? undefined : value,
    };

    this.updateConfig(nextConfig);
  }

  private updateTabValue(index: number, key: keyof WelcomeTabConfig, value: unknown) {
    this.updateTab(index, {
      ...this.getTab(index),
      [key]: value || undefined,
    });
  }

  private updateTabActionType(index: number, action: ActionType) {
    this.updateTab(index, {
      ...this.getTab(index),
      tap_action: { action },
    });
  }

  private updateTabActionValue(index: number, property: string, value: string) {
    this.updateTab(index, {
      ...this.getTab(index),
      tap_action: {
        ...(this.getTab(index).tap_action || { action: "none" }),
        [property]: value || undefined,
      },
    });
  }

  private updateServiceData(index: number, value: string) {
    const trimmedValue = value.trim();
    const errorKey = this.getServiceDataErrorKey(index);

    if (!trimmedValue) {
      this.serviceDataErrors = { ...this.serviceDataErrors, [errorKey]: undefined };
      this.updateTabActionValue(index, "service_data", "");
      return;
    }

    try {
      const serviceData = JSON.parse(trimmedValue);
      this.serviceDataErrors = { ...this.serviceDataErrors, [errorKey]: undefined };
      this.updateTab(index, {
        ...this.getTab(index),
        tap_action: {
          ...(this.getTab(index).tap_action || { action: "call-service" }),
          service_data: serviceData,
        },
      });
    } catch {
      this.serviceDataErrors = {
        ...this.serviceDataErrors,
        [errorKey]: "Service data must be valid JSON.",
      };
      this.requestUpdate();
    }
  }

  private addTab() {
    this.updateConfig({
      ...this.config,
      tabs: [
        ...(this.config.tabs || []),
        {
          icon: "mdi:shape",
          label: "New tab",
          color: "#86a9f8",
          tap_action: { action: "none" },
        },
      ],
    });
  }

  private removeTab(index: number) {
    this.updateConfig({
      ...this.config,
      tabs: (this.config.tabs || []).filter((_, tabIndex) => tabIndex !== index),
    });
  }

  private moveTab(index: number, direction: -1 | 1) {
    const tabs = [...(this.config.tabs || [])];
    const nextIndex = index + direction;

    if (nextIndex < 0 || nextIndex >= tabs.length) {
      return;
    }

    [tabs[index], tabs[nextIndex]] = [tabs[nextIndex], tabs[index]];
    this.updateConfig({
      ...this.config,
      tabs,
    });
  }

  private updateTab(index: number, tab: WelcomeTabConfig) {
    const tabs = [...(this.config.tabs || [])];
    tabs[index] = tab;

    this.updateConfig({
      ...this.config,
      tabs,
    });
  }

  private getTab(index: number) {
    return (this.config.tabs || [])[index] || {};
  }

  private getServiceDataErrorKey(index: number) {
    return `tab-${index}`;
  }

  private formatJson(value: unknown) {
    if (!value) {
      return "";
    }

    return JSON.stringify(value, null, 2);
  }

  private updateConfig(config: WelcomeCardEditorConfig) {
    this.config = config;
    fireEvent(this, "config-changed", { config });
  }

  private async loadHomeAssistantPickers() {
    const loadCardHelpers = (window as any).loadCardHelpers;

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

    section {
      display: grid;
      gap: 12px;
    }

    .section-header {
      align-items: center;
      display: flex;
      gap: 12px;
      justify-content: space-between;
    }

    h3 {
      color: var(--primary-text-color);
      font-size: 16px;
      margin: 0;
    }

    .tabs-editor {
      display: grid;
      gap: 12px;
    }

    .tab-controls {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    label {
      display: grid;
      gap: 6px;
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

    button,
    input,
    select,
    textarea {
      font: inherit;
    }

    button {
      background: var(--card-background-color, #fff);
      border: 1px solid var(--divider-color, #ddd);
      border-radius: 6px;
      color: var(--primary-text-color);
      cursor: pointer;
      min-height: 36px;
      padding: 7px 10px;
    }

    button:disabled {
      cursor: default;
      opacity: 0.45;
    }

    input,
    select,
    textarea {
      background: var(--card-background-color, #fff);
      border: 1px solid var(--divider-color, #ddd);
      border-radius: 6px;
      box-sizing: border-box;
      color: var(--primary-text-color);
      min-height: 40px;
      padding: 8px 10px;
      width: 100%;
    }

    textarea {
      min-height: 86px;
      resize: vertical;
    }

    fieldset {
      border: 1px solid var(--divider-color, #ddd);
      border-radius: 10px;
      display: grid;
      gap: 12px;
      margin: 0;
      padding: 12px;
    }

    .action-editor {
      background: color-mix(in srgb, var(--card-background-color, #fff) 86%, transparent);
    }

    .error {
      color: var(--error-color, #db4437);
      font-size: 12px;
    }
  `;
}

customElements.define("welcome-card-editor", WelcomeCardEditor);
