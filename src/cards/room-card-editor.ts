import { css, html, LitElement } from "lit";
import { ActionConfig, fireEvent, HomeAssistant } from "custom-card-helpers";

type RoomCardEditorConfig = {
  type?: string;
  entity?: string;
  name?: string;
  icon?: string;
  temperature_entity?: string;
  temperature_icon?: string;
  humidity_entity?: string;
  humidity_icon?: string;
  tap_action?: ActionConfig;
  light_tap_action?: ActionConfig;
  light_hold_action?: ActionConfig;
};

type ActionKey = "tap_action" | "light_tap_action" | "light_hold_action";
type ActionType = ActionConfig["action"];

const ACTION_OPTIONS: { value: ActionType; label: string }[] = [
  { value: "more-info", label: "More info" },
  { value: "toggle", label: "Toggle" },
  { value: "navigate", label: "Navigate" },
  { value: "url", label: "URL" },
  { value: "call-service", label: "Call service" },
  { value: "fire-dom-event", label: "Fire DOM event" },
  { value: "none", label: "None" },
];

class RoomCardEditor extends LitElement {
  hass?: HomeAssistant;
  config: RoomCardEditorConfig = {};
  private serviceDataErrors: Partial<Record<ActionKey, string>> = {};

  static properties = {
    hass: { attribute: false },
    config: { attribute: false },
  };

  connectedCallback() {
    super.connectedCallback();
    this.loadHomeAssistantPickers();
  }

  setConfig(config: RoomCardEditorConfig) {
    this.config = {
      icon: "mdi:sofa",
      temperature_icon: "mdi:thermometer",
      humidity_icon: "mdi:water-percent",
      tap_action: { action: "more-info" },
      light_tap_action: { action: "toggle" },
      light_hold_action: { action: "more-info" },
      ...config,
    };
  }

  render() {
    return html`
      <div class="editor">
        <div class="grid">
          ${this.renderEntityPicker("Light entity", "entity", ["light"])}
          ${this.renderTextField("Name", "name", "Living room")}
          ${this.renderTextField("Icon", "icon", "mdi:sofa")}
          ${this.renderEntityPicker("Temperature sensor", "temperature_entity", ["sensor"])}
          ${this.renderIconPicker("Temperature icon", "temperature_icon", "mdi:thermometer")}
          ${this.renderEntityPicker("Humidity sensor", "humidity_entity", ["sensor"])}
          ${this.renderIconPicker("Humidity icon", "humidity_icon", "mdi:water-percent")}
        </div>

        ${this.renderActionEditor("Card tap action", "tap_action")}
        ${this.renderActionEditor("Light short press action", "light_tap_action")}
        ${this.renderActionEditor("Light long press action", "light_hold_action")}
      </div>
    `;
  }

  private renderEntityPicker(label: string, key: keyof RoomCardEditorConfig, domains: string[]) {
    return html`
      <div class="field">
        <ha-entity-picker
          .hass=${this.hass}
          .label=${label}
          .value=${this.config[key] || ""}
          .includeDomains=${domains}
          allow-custom-entity
          @value-changed=${(event: CustomEvent) => this.updateConfigValue(key, event.detail.value)}
        ></ha-entity-picker>
      </div>
    `;
  }

  private renderTextField(label: string, key: keyof RoomCardEditorConfig, placeholder = "") {
    return html`
      <label>
        <span>${label}</span>
        <input
          .value=${String(this.config[key] || "")}
          placeholder=${placeholder}
          @input=${(event: InputEvent) =>
            this.updateConfigValue(key, (event.target as HTMLInputElement).value)}
        />
      </label>
    `;
  }

  private renderIconPicker(label: string, key: keyof RoomCardEditorConfig, fallback: string) {
    return html`
      <div class="field">
        <ha-icon-picker
          .hass=${this.hass}
          .label=${label}
          .value=${this.config[key] || fallback}
          @value-changed=${(event: CustomEvent) => this.updateConfigValue(key, event.detail.value)}
        ></ha-icon-picker>
      </div>
    `;
  }

  private renderActionEditor(label: string, key: ActionKey) {
    const actionConfig = this.config[key] || { action: "none" };
    const action = actionConfig.action;

    return html`
      <fieldset>
        <legend>${label}</legend>

        <label>
          <span>Action</span>
          <select
            .value=${action}
            @change=${(event: Event) =>
              this.updateActionType(key, (event.target as HTMLSelectElement).value as ActionType)}
          >
            ${ACTION_OPTIONS.map(
              (option) => html`
                <option value=${option.value} ?selected=${option.value === action}>${option.label}</option>
              `
            )}
          </select>
        </label>

        ${this.renderActionFields(key, actionConfig)}
      </fieldset>
    `;
  }

  private renderActionFields(key: ActionKey, actionConfig: ActionConfig) {
    switch (actionConfig.action) {
      case "more-info":
        return this.renderActionInput(key, "entity", "Entity override", "Optional entity");
      case "navigate":
        return this.renderActionInput(key, "navigation_path", "Navigation path", "/lovelace/0");
      case "url":
        return this.renderActionInput(key, "url_path", "URL path", "https://example.com");
      case "call-service":
        return html`
          ${this.renderActionInput(key, "service", "Service", "light.turn_on")}
          <label>
            <span>Service data JSON</span>
            <textarea
              .value=${this.formatJson((actionConfig as any).service_data)}
              placeholder='{"brightness_pct": 50}'
              @change=${(event: Event) =>
                this.updateServiceData(key, (event.target as HTMLTextAreaElement).value)}
            ></textarea>
          </label>
          ${this.serviceDataErrors[key]
            ? html`<div class="error">${this.serviceDataErrors[key]}</div>`
            : ""}
        `;
      default:
        return "";
    }
  }

  private renderActionInput(
    key: ActionKey,
    property: string,
    label: string,
    placeholder: string
  ) {
    const actionConfig = this.config[key] || { action: "none" };

    return html`
      <label>
        <span>${label}</span>
        <input
          .value=${String((actionConfig as any)[property] || "")}
          placeholder=${placeholder}
          @input=${(event: InputEvent) =>
            this.updateActionValue(key, property, (event.target as HTMLInputElement).value)}
        />
      </label>
    `;
  }

  private updateConfigValue(key: keyof RoomCardEditorConfig, value: unknown) {
    const nextConfig = {
      ...this.config,
      [key]: value || undefined,
    };

    this.updateConfig(nextConfig);
  }

  private updateActionType(key: ActionKey, action: ActionType) {
    this.updateConfig({
      ...this.config,
      [key]: { action },
    });
  }

  private updateActionValue(key: ActionKey, property: string, value: string) {
    this.updateConfig({
      ...this.config,
      [key]: {
        ...(this.config[key] || { action: "none" }),
        [property]: value || undefined,
      },
    });
  }

  private updateServiceData(key: ActionKey, value: string) {
    const trimmedValue = value.trim();

    if (!trimmedValue) {
      this.serviceDataErrors = { ...this.serviceDataErrors, [key]: undefined };
      this.updateActionValue(key, "service_data", "");
      return;
    }

    try {
      const serviceData = JSON.parse(trimmedValue);
      this.serviceDataErrors = { ...this.serviceDataErrors, [key]: undefined };
      this.updateConfig({
        ...this.config,
        [key]: {
          ...(this.config[key] || { action: "call-service" }),
          service_data: serviceData,
        },
      });
    } catch {
      this.serviceDataErrors = {
        ...this.serviceDataErrors,
        [key]: "Service data must be valid JSON.",
      };
      this.requestUpdate();
    }
  }

  private formatJson(value: unknown) {
    if (!value) {
      return "";
    }

    return JSON.stringify(value, null, 2);
  }

  private updateConfig(config: RoomCardEditorConfig) {
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
    select,
    textarea {
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

    .error {
      color: var(--error-color, #db4437);
      font-size: 12px;
    }
  `;
}

customElements.define("room-card-editor", RoomCardEditor);
