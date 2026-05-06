import { css, html, LitElement, PropertyValues } from "lit";
import { ActionConfig, fireEvent, HomeAssistant } from "custom-card-helpers";
import {
  renderSharedActionEditor,
  renderEntityPicker,
  renderIconPicker,
  renderTextField,
} from "../../shared/base-card";

type RoomCardEditorConfig = {
  type?: string;
  entity?: string;
  name?: string;
  icon?: string;
  sensor1_entity?: string;
  sensor1_icon?: string;
  sensor2_entity?: string;
  sensor2_icon?: string;
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
      sensor1_icon: "mdi:thermometer",
      sensor2_icon: "mdi:water-percent",
      tap_action: { action: "more-info" },
      light_tap_action: { action: "toggle" },
      light_hold_action: { action: "more-info" },
      ...config,
    };
  }

  shouldUpdate(changedProperties: PropertyValues): boolean {
    if (changedProperties.has("config")) {
      return true;
    }

    if (changedProperties.has("hass")) {
      const oldHass = changedProperties.get("hass") as HomeAssistant | undefined;
      // Only re-render the very first time hass becomes available. The pickers
      // manage their own internal state from there, so churning them on every
      // state tick caused major lag in dashboards with many entities.
      return !oldHass && Boolean(this.hass);
    }

    return false;
  }

  render() {
    return html`
      <div class="editor">
        <div class="grid">
          ${renderTextField({
            label: "Name",
            value: String(this.config.name || ""),
            placeholder: "Living room",
            onInput: (value) => this.updateConfigValue("name", value),
          })}
          ${renderEntityPicker({
            hass: this.hass,
            label: "Light entity",
            value: String(this.config.entity || ""),
            domains: ["light"],
            onValueChanged: (value) => this.updateConfigValue("entity", value),
          })}
          ${renderIconPicker({
            hass: this.hass,
            label: "Icon",
            value: String(this.config.icon || ""),
            fallback: "mdi:sofa",
            onValueChanged: (value) => this.updateConfigValue("icon", value),
          })}
          ${renderEntityPicker({
            hass: this.hass,
            label: "Sensor 1 entity",
            value: String(this.config.sensor1_entity || ""),
            domains: ["sensor"],
            onValueChanged: (value) => this.updateConfigValue("sensor1_entity", value),
          })}
          ${renderIconPicker({
            hass: this.hass,
            label: "Sensor 1 icon",
            value: String(this.config.sensor1_icon || ""),
            fallback: "mdi:thermometer",
            onValueChanged: (value) => this.updateConfigValue("sensor1_icon", value),
          })}
          ${renderEntityPicker({
            hass: this.hass,
            label: "Sensor 2 entity",
            value: String(this.config.sensor2_entity || ""),
            domains: ["sensor"],
            onValueChanged: (value) => this.updateConfigValue("sensor2_entity", value),
          })}
          ${renderIconPicker({
            hass: this.hass,
            label: "Sensor 2 icon",
            value: String(this.config.sensor2_icon || ""),
            fallback: "mdi:water-percent",
            onValueChanged: (value) => this.updateConfigValue("sensor2_icon", value),
          })}
        </div>

        ${this.renderActionEditor("Card tap action", "tap_action")}
        ${this.renderActionEditor("Light short press action", "light_tap_action")}
        ${this.renderActionEditor("Light long press action", "light_hold_action")}
      </div>
    `;
  }

  private renderActionEditor(label: string, key: ActionKey) {
    const actionConfig = (this.config[key] || { action: "none" }) as ActionConfig;

    return renderSharedActionEditor<ActionType>({
      label,
      actionConfig: actionConfig as any,
      actionOptions: ACTION_OPTIONS as any,
      onActionTypeChanged: (action) => this.updateActionType(key, action),
      onActionValueChanged: (property, value) => this.updateActionValue(key, property, value),
      onServiceDataChanged: (value) => this.updateServiceData(key, value),
      formatJson: (value) => this.formatJson(value),
      serviceDataError: this.serviceDataErrors[key],
    });
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
