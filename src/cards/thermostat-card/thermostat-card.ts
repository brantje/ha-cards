import { css, html, PropertyValues } from "lit";
import { styleMap } from "lit/directives/style-map.js";
import { formatNumber, HomeAssistant } from "custom-card-helpers";
import { BaseCard } from "../../shared/base-card";
import "./thermostat-card-editor";

type DualSetpointLayout = "two_rows" | "single_row_toggle" | "side_by_side";
type DualSetpointTarget = "low" | "high";
type TemperatureTarget = "single" | DualSetpointTarget;

type OptimisticClimateState = {
  entityId: string;
  state?: string;
  attributes?: Record<string, any>;
};

type ThermostatCardConfig = {
  type: string;
  entity: string;
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
const OPTIMISTIC_STATE_TIMEOUT_MS = 30000;

class ThermostatCard extends BaseCard {
  config!: ThermostatCardConfig;
  hass!: HomeAssistant;
  private selectedDualTarget: DualSetpointTarget = "low";
  private isCollapsed = false;
  private optimisticState?: OptimisticClimateState;
  private optimisticStateTimer?: number;

  static properties = {
    hass: { attribute: false },
    config: { attribute: false },
    selectedDualTarget: { state: true },
    isCollapsed: { state: true },
    optimisticState: { state: true },
  };

  static getConfigElement() {
    return document.createElement("thermostat-card-editor");
  }

  static getStubConfig() {
    return {
      entity: "",
      name: "Thermostat",
      icon: DEFAULT_ICON,
      show_controls: true,
      show_modes: false,
      show_presets: false,
      show_fan_mode: false,
      show_off_mode: false,
      dual_setpoint_layout: DEFAULT_DUAL_LAYOUT,
      step_amount: undefined,
      heating_color: DEFAULT_HEATING_COLOR,
      cooling_color: DEFAULT_COOLING_COLOR,
    };
  }

  setConfig(config: ThermostatCardConfig) {
    if (!config.entity) {
      throw new Error("Thermostat Card requires a climate entity");
    }

    if (!config.entity.startsWith("climate.")) {
      throw new Error("Thermostat Card only supports climate entities");
    }

    this.config = {
      icon: DEFAULT_ICON,
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

  protected getWatchedEntities(): string[] {
    return this.config?.entity ? [this.config.entity] : [];
  }

  shouldUpdate(changedProperties: PropertyValues): boolean {
    if (
      changedProperties.has("selectedDualTarget") ||
      changedProperties.has("isCollapsed") ||
      changedProperties.has("optimisticState")
    ) {
      return true;
    }

    return super.shouldUpdate(changedProperties);
  }

  updated(changedProperties: PropertyValues) {
    if (changedProperties.has("hass")) {
      this.clearAcknowledgedOptimisticState();
    }
  }

  render() {
    const entity = this.getClimateEntity();
    const heating = this.isHeating(entity);
    const cooling = this.isCooling(entity);
    const collapsed = Boolean(this.config.compact || this.isCollapsed);
    const showControls = Boolean(this.config.show_controls) && !collapsed;
    const showModes = Boolean(this.config.show_modes) && !collapsed;
    const showPresets = Boolean(this.config.show_presets) && !collapsed;
    const styles = {
      "--thermostat-heating-color": this.config.heating_color || DEFAULT_HEATING_COLOR,
      "--thermostat-cooling-color": this.config.cooling_color || DEFAULT_COOLING_COLOR,
    };

    return html`
      <ha-card
        class=${`${heating ? "heating" : ""} ${cooling ? "cooling" : ""}`}
        style=${styleMap(styles)}
      >
        <div class="card">
          ${this.renderHeader(entity, collapsed)}
          ${showControls ? this.renderControls(entity) : ""}
          ${showModes ? this.renderModeRow(entity) : ""}
          ${showPresets ? this.renderPresetRow(entity) : ""}
        </div>
      </ha-card>
    `;
  }

  private renderHeader(entity: HassEntity | undefined, collapsed: boolean) {
    const name = this.config.name || entity?.attributes?.friendly_name || "Thermostat";
    const subtitle = this.getSubtitle(entity);

    return html`
      <div class="header">
        <button
          class="thermostat-icon"
          type="button"
          aria-label=${collapsed ? "Expand thermostat card" : "Collapse thermostat card"}
          aria-expanded=${collapsed ? "false" : "true"}
          @click=${this.toggleCollapsed}
        >
          <ha-icon .icon=${this.config.icon || DEFAULT_ICON}></ha-icon>
        </button>

        <div class="heading">
          <div class="name">${name}</div>
          <div class="subtitle">${subtitle}</div>
        </div>
      </div>
    `;
  }

  private toggleCollapsed(event: Event) {
    event.stopPropagation();
    this.isCollapsed = !this.isCollapsed;
  }

  private renderControls(entity?: HassEntity) {
    if (!entity) {
      return "";
    }

    if (this.hasDualSetpoints(entity)) {
      return this.renderDualControls(entity);
    }

    const value = this.getTargetTemperature(entity);
    if (value === undefined) {
      return "";
    }

    return html`
      <div class="controls">
        ${this.renderSetpointRow(entity, "single", value, "Target temperature")}
      </div>
    `;
  }

  private renderDualControls(entity: HassEntity) {
    const low = this.asNumber(entity.attributes.target_temp_low);
    const high = this.asNumber(entity.attributes.target_temp_high);
    const layout = this.config.dual_setpoint_layout || DEFAULT_DUAL_LAYOUT;

    if (low === undefined || high === undefined) {
      return "";
    }

    if (layout === "single_row_toggle") {
      const selectedValue = this.selectedDualTarget === "low" ? low : high;

      return html`
        <div class="controls">
          <div class="target-toggle" role="group" aria-label="Setpoint target">
            ${this.renderTargetToggleButton("low", "Heat", low)}
            ${this.renderTargetToggleButton("high", "Cool", high)}
          </div>
          ${this.renderSetpointRow(entity, this.selectedDualTarget, selectedValue, this.selectedDualTarget === "low" ? "Heat setpoint" : "Cool setpoint")}
        </div>
      `;
    }

    if (layout === "side_by_side") {
      return html`
        <div class="controls side-by-side">
          ${this.renderCompactSetpoint(entity, "low", low, "Heat")}
          ${this.renderCompactSetpoint(entity, "high", high, "Cool")}
        </div>
      `;
    }

    return html`
      <div class="controls">
        ${this.renderSetpointRow(entity, "high", high, "Cool setpoint")}
        ${this.renderSetpointRow(entity, "low", low, "Heat setpoint")}
      </div>
    `;
  }

  private renderSetpointRow(entity: HassEntity, target: TemperatureTarget, value: number, label: string) {
    return html`
      <div class="setpoint-row" aria-label=${label}>
        <button type="button" @click=${(event: Event) => this.adjustTemperature(event, entity, target, -1)} aria-label=${`Decrease ${label}`}>
          −
        </button>
        <div class="setpoint-value">${this.formatTemperature(value, entity)}</div>
        <button type="button" @click=${(event: Event) => this.adjustTemperature(event, entity, target, 1)} aria-label=${`Increase ${label}`}>
          +
        </button>
      </div>
    `;
  }

  private renderCompactSetpoint(entity: HassEntity, target: DualSetpointTarget, value: number, label: string) {
    return html`
      <div class="compact-setpoint" aria-label=${`${label} setpoint`}>
        <div class="setpoint-label">${label}</div>
        <div class="compact-controls">
          <button type="button" @click=${(event: Event) => this.adjustTemperature(event, entity, target, -1)} aria-label=${`Decrease ${label} setpoint`}>
            −
          </button>
          <div class="setpoint-value">${this.formatTemperature(value, entity)}</div>
          <button type="button" @click=${(event: Event) => this.adjustTemperature(event, entity, target, 1)} aria-label=${`Increase ${label} setpoint`}>
            +
          </button>
        </div>
      </div>
    `;
  }

  private renderTargetToggleButton(target: DualSetpointTarget, label: string, value: number) {
    const active = this.selectedDualTarget === target;

    return html`
      <button
        class=${`target-toggle-button ${active ? "active" : ""}`}
        type="button"
        @click=${(event: Event) => this.selectDualTarget(event, target)}
        aria-pressed=${active ? "true" : "false"}
      >
        <span>${label}</span>
        <span>${this.formatTemperature(value, this.getClimateEntity())}</span>
      </button>
    `;
  }

  private renderModeRow(entity?: HassEntity) {
    if (!entity) {
      return "";
    }

    const hvacModes = this.asStringArray(entity.attributes.hvac_modes);
    const selectedModes = this.asStringArray(this.config.modes);
    const modeButtons = selectedModes.filter((mode) => hvacModes.includes(mode));

    if (this.config.show_off_mode && hvacModes.includes("off") && !modeButtons.includes("off")) {
      modeButtons.push("off");
    }

    const canShowFanMode = Boolean(this.config.show_fan_mode) && this.asStringArray(entity.attributes.fan_modes).length > 0;

    if (!modeButtons.length && !canShowFanMode) {
      return "";
    }

    return html`
      <div class="chip-row mode-row">
        ${modeButtons.map((mode) => this.renderModeButton(entity, mode))}
        ${canShowFanMode ? this.renderFanButton(entity) : ""}
      </div>
    `;
  }

  private renderModeButton(entity: HassEntity, mode: string) {
    const active = entity.state === mode;

    return html`
      <button
        class=${`chip mode-chip mode-${this.getModeClass(mode)} ${active ? "active" : ""}`}
        type="button"
        @click=${(event: Event) => this.setHvacMode(event, mode)}
        aria-pressed=${active ? "true" : "false"}
        title=${this.getModeLabel(mode)}
      >
        <ha-icon .icon=${this.getModeIcon(mode)}></ha-icon>
        <span>${this.getModeLabel(mode)}</span>
      </button>
    `;
  }

  private renderFanButton(entity: HassEntity) {
    const fanMode = String(entity.attributes.fan_mode || "");
    const label = fanMode ? this.toLabel(fanMode) : "Fan";

    return html`
      <button
        class="chip mode-chip mode-fan"
        type="button"
        @click=${(event: Event) => this.cycleFanMode(event, entity)}
        title=${`Fan: ${label}`}
      >
        <ha-icon icon="mdi:fan"></ha-icon>
        <span>${label}</span>
      </button>
    `;
  }

  private renderPresetRow(entity?: HassEntity) {
    if (!entity) {
      return "";
    }

    const presetModes = this.asStringArray(entity.attributes.preset_modes);
    const selectedPresets = this.asStringArray(this.config.presets);
    const presetButtons = selectedPresets.filter((preset) => presetModes.includes(preset));

    if (!presetButtons.length) {
      return "";
    }

    return html`
      <div class="chip-row preset-row">
        ${presetButtons.map((preset) => this.renderPresetButton(entity, preset))}
      </div>
    `;
  }

  private renderPresetButton(entity: HassEntity, preset: string) {
    const active = entity.attributes.preset_mode === preset;

    return html`
      <button
        class=${`chip preset-chip ${active ? "active" : ""}`}
        type="button"
        @click=${(event: Event) => this.setPresetMode(event, preset)}
        aria-pressed=${active ? "true" : "false"}
      >
        ${this.toLabel(preset)}
      </button>
    `;
  }

  private adjustTemperature(event: Event, entity: HassEntity, target: TemperatureTarget, direction: -1 | 1) {
    event.stopPropagation();

    const currentValue = target === "single"
      ? this.getTargetTemperature(entity)
      : this.asNumber(entity.attributes[target === "low" ? "target_temp_low" : "target_temp_high"]);

    if (currentValue === undefined) {
      return;
    }

    const nextValue = this.clampTemperature(entity, currentValue + this.getStep(entity) * direction);
    const serviceData: Record<string, any> = {
      entity_id: this.config.entity,
    };

    if (target === "single") {
      serviceData.temperature = nextValue;
      this.setOptimisticClimateState({
        attributes: { temperature: nextValue },
      });
    } else {
      const low = this.asNumber(entity.attributes.target_temp_low);
      const high = this.asNumber(entity.attributes.target_temp_high);
      serviceData.target_temp_low = target === "low" ? nextValue : low;
      serviceData.target_temp_high = target === "high" ? nextValue : high;
      this.setOptimisticClimateState({
        attributes: {
          target_temp_low: serviceData.target_temp_low,
          target_temp_high: serviceData.target_temp_high,
        },
      });
    }

    this.hass.callService("climate", "set_temperature", serviceData);
  }

  private selectDualTarget(event: Event, target: DualSetpointTarget) {
    event.stopPropagation();
    this.selectedDualTarget = target;
  }

  private setHvacMode(event: Event, mode: string) {
    event.stopPropagation();
    this.setOptimisticClimateState({ state: mode });
    this.hass.callService("climate", "set_hvac_mode", {
      entity_id: this.config.entity,
      hvac_mode: mode,
    });
  }

  private setPresetMode(event: Event, presetMode: string) {
    event.stopPropagation();
    this.setOptimisticClimateState({
      attributes: { preset_mode: presetMode },
    });
    this.hass.callService("climate", "set_preset_mode", {
      entity_id: this.config.entity,
      preset_mode: presetMode,
    });
  }

  private cycleFanMode(event: Event, entity: HassEntity) {
    event.stopPropagation();

    const fanModes = this.asStringArray(entity.attributes.fan_modes);
    if (!fanModes.length) {
      return;
    }

    const currentIndex = fanModes.indexOf(String(entity.attributes.fan_mode || ""));
    const nextFanMode = fanModes[(currentIndex + 1) % fanModes.length];

    this.setOptimisticClimateState({
      attributes: { fan_mode: nextFanMode },
    });
    this.hass.callService("climate", "set_fan_mode", {
      entity_id: this.config.entity,
      fan_mode: nextFanMode,
    });
  }

  private getClimateEntity() {
    const entity = this.getRawClimateEntity();
    const optimisticState = this.getOptimisticState();

    if (!entity || !optimisticState) {
      return entity;
    }

    return {
      ...entity,
      state: optimisticState.state ?? entity.state,
      attributes: {
        ...entity.attributes,
        ...(optimisticState.attributes || {}),
      },
    };
  }

  private getRawClimateEntity() {
    return this.hass?.states?.[this.config.entity] as HassEntity | undefined;
  }

  private getSubtitle(entity?: HassEntity) {
    if (!entity) {
      return "Unavailable";
    }

    const currentTemperature = this.formatTemperature(entity.attributes.current_temperature, entity);
    const mode = this.formatCurrentMode(entity);
    const action = this.formatCurrentAction(entity);

    return `${currentTemperature} • ${mode}${action ? ` (${action})` : ""}`;
  }

  private formatCurrentMode(entity: HassEntity) {
    const formatter = (this.hass as any).formatEntityState;
    if (formatter) {
      return formatter(entity);
    }

    return this.getModeLabel(entity.state);
  }

  private formatCurrentAction(entity: HassEntity) {
    const action = entity.attributes.hvac_action;
    if (!action) {
      return "";
    }

    const formatter = (this.hass as any).formatEntityAttributeValue;
    if (formatter) {
      return formatter(entity, "hvac_action");
    }

    return this.toLabel(String(action));
  }

  private formatTemperature(value: unknown, entity?: HassEntity) {
    const numericValue = this.asNumber(value);
    const unit = this.getTemperatureUnit(entity);

    if (numericValue === undefined) {
      return `-${unit}`;
    }

    return `${formatNumber(numericValue, this.hass?.locale)}${unit}`;
  }

  private getTemperatureUnit(entity?: HassEntity) {
    return entity?.attributes?.temperature_unit || (this.hass as any)?.config?.unit_system?.temperature || "";
  }

  private getStep(entity: HassEntity) {
    const configuredStep = this.asNumber(this.config.step_amount);
    if (configuredStep && configuredStep > 0) {
      return configuredStep;
    }

    const step = this.asNumber(entity.attributes.target_temp_step);
    return step && step > 0 ? step : 0.5;
  }

  private getTargetTemperature(entity: HassEntity) {
    const targetTemperature = this.asNumber(entity.attributes.temperature);
    if (targetTemperature !== undefined) {
      return targetTemperature;
    }

    return this.isIdle(entity) ? this.asNumber(entity.attributes.current_temperature) : undefined;
  }

  private getOptimisticState() {
    return this.optimisticState?.entityId === this.config.entity ? this.optimisticState : undefined;
  }

  private setOptimisticClimateState(state: Omit<OptimisticClimateState, "entityId">) {
    const currentState = this.getOptimisticState();
    this.optimisticState = {
      ...currentState,
      entityId: this.config.entity,
      state: state.state ?? currentState?.state,
      attributes: {
        ...(currentState?.attributes || {}),
        ...(state.attributes || {}),
      },
    };
    this.scheduleOptimisticStateClear();
  }

  private scheduleOptimisticStateClear() {
    if (this.optimisticStateTimer) {
      window.clearTimeout(this.optimisticStateTimer);
    }

    this.optimisticStateTimer = window.setTimeout(() => {
      this.optimisticState = undefined;
      this.optimisticStateTimer = undefined;
    }, OPTIMISTIC_STATE_TIMEOUT_MS);
  }

  private clearAcknowledgedOptimisticState() {
    const entity = this.getRawClimateEntity();
    const optimisticState = this.getOptimisticState();

    if (!entity || !optimisticState) {
      return;
    }

    const stateAcknowledged = optimisticState.state === undefined || entity.state === optimisticState.state;
    const attributesAcknowledged = Object.entries(optimisticState.attributes || {}).every(
      ([key, value]) => this.areValuesEqual(entity.attributes[key], value)
    );

    if (stateAcknowledged && attributesAcknowledged) {
      if (this.optimisticStateTimer) {
        window.clearTimeout(this.optimisticStateTimer);
        this.optimisticStateTimer = undefined;
      }

      this.optimisticState = undefined;
    }
  }

  private areValuesEqual(left: unknown, right: unknown) {
    const leftNumber = this.asNumber(left);
    const rightNumber = this.asNumber(right);

    if (leftNumber !== undefined && rightNumber !== undefined) {
      return leftNumber === rightNumber;
    }

    return left === right;
  }

  private clampTemperature(entity: HassEntity, value: number) {
    const min = this.asNumber(entity.attributes.min_temp);
    const max = this.asNumber(entity.attributes.max_temp);
    const lowerBound = min === undefined ? value : Math.max(value, min);
    const upperBound = max === undefined ? lowerBound : Math.min(lowerBound, max);

    return Number(upperBound.toFixed(2));
  }

  private hasDualSetpoints(entity: HassEntity) {
    return (
      this.asNumber(entity.attributes.target_temp_low) !== undefined &&
      this.asNumber(entity.attributes.target_temp_high) !== undefined
    );
  }

  private isHeating(entity?: HassEntity) {
    return entity?.attributes?.hvac_action === "heating" || entity?.state === "heat";
  }

  private isCooling(entity?: HassEntity) {
    return entity?.attributes?.hvac_action === "cooling" || entity?.state === "cool";
  }

  private isIdle(entity?: HassEntity) {
    return entity?.attributes?.hvac_action === "idle" || entity?.state === "idle";
  }

  private asNumber(value: unknown): number | undefined {
    const numericValue = Number(value);
    return value === null || value === undefined || value === "" || !Number.isFinite(numericValue)
      ? undefined
      : numericValue;
  }

  private asStringArray(value: unknown): string[] {
    return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
  }

  private getModeIcon(mode: string) {
    const icons: Record<string, string> = {
      heat: "mdi:fire",
      cool: "mdi:snowflake",
      heat_cool: "mdi:sun-snowflake",
      auto: "mdi:autorenew",
      fan_only: "mdi:fan",
      dry: "mdi:water-percent",
      off: "mdi:power",
    };

    return icons[mode] || "mdi:thermostat";
  }

  private getModeLabel(mode: string) {
    const labels: Record<string, string> = {
      heat: "Heat",
      cool: "Cool",
      heat_cool: "Heat/Cool",
      auto: "Auto",
      fan_only: "Fan",
      dry: "Dry",
      off: "Off",
    };

    return labels[mode] || this.toLabel(mode);
  }

  private getModeClass(mode: string) {
    const knownModes: Record<string, string> = {
      heat: "heat",
      cool: "cool",
      heat_cool: "heat-cool",
      auto: "auto",
      fan_only: "fan",
      dry: "dry",
      off: "off",
    };

    return knownModes[mode] || "default";
  }

  private toLabel(value: string) {
    return value
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }

  static styles = css`
    ha-card {
      --thermostat-heating-color: #fbb73c;
      --thermostat-cooling-color: #3a8dde;
      --thermostat-mode-heat-color: var(--error-color, #db4437);
      --thermostat-mode-cool-color: var(--thermostat-cooling-color);
      --thermostat-mode-heat-cool-color: var(--primary-color);
      --thermostat-mode-auto-color: var(--primary-color);
      --thermostat-mode-fan-color: var(--success-color, #43a047);
      --thermostat-mode-dry-color: var(--info-color, #00acc1);
      --thermostat-mode-off-color: var(--disabled-text-color);
      --thermostat-mode-default-color: var(--primary-color);
      --thermostat-card-background: var(--card-background-color);
      --thermostat-control-background: color-mix(in srgb, var(--primary-text-color) 8%, transparent);
      --thermostat-control-active-background: color-mix(in srgb, var(--primary-text-color) 14%, transparent);
      --thermostat-icon-background: color-mix(in srgb, var(--primary-color) 16%, transparent);
      --thermostat-chip-color: var(--primary-color);
      --thermostat-text-color: var(--primary-text-color);
      --thermostat-secondary-text-color: var(--secondary-text-color);
      --thermostat-active-chip-text-color: var(--thermostat-text-color);
      background: var(--thermostat-card-background);
      border: none;
      border-radius: 20px;
      color: var(--thermostat-text-color);
      overflow: hidden;
    }

    ha-card.heating {
      --thermostat-card-background: var(--thermostat-heating-color);
      --thermostat-control-background: rgba(120, 82, 0, 0.16);
      --thermostat-control-active-background: rgba(120, 82, 0, 0.24);
      --thermostat-icon-background: #ffd8d6;
      --thermostat-chip-color: #ff4545;
      --thermostat-mode-heat-color: #ff713d;
      --thermostat-text-color: #000;
      --thermostat-secondary-text-color: rgba(0, 0, 0, 0.42);
      --thermostat-active-chip-text-color: #000;
    }

    ha-card.cooling {
      --thermostat-card-background: var(--thermostat-cooling-color);
      --thermostat-icon-background: color-mix(in srgb, var(--primary-text-color) 10%, transparent);
      --thermostat-chip-color: var(--thermostat-mode-cool-color);
    }

    .card {
      display: grid;
      gap: 12px;
      padding: 12px;
    }

    .header {
      align-items: center;
      display: flex;
      gap: 12px;
      min-width: 0;
    }

    .thermostat-icon {
      align-items: center;
      background: var(--thermostat-icon-background);
      border: 0;
      border-radius: 999px;
      color: var(--thermostat-chip-color);
      cursor: pointer;
      display: flex;
      flex: 0 0 auto;
      height: 42px;
      justify-content: center;
      padding: 0;
      width: 42px;
    }

    .thermostat-icon ha-icon {
      --mdc-icon-size: 20px;
    }

    .heading {
      min-width: 0;
    }

    .name {
      color: var(--thermostat-text-color);
      font-size: 14px;
      font-weight: 700;
      line-height: 1.15;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .subtitle {
      color: var(--thermostat-secondary-text-color);
      font-size: 12px;
      font-weight: 600;
      line-height: 1.25;
      margin-top: 2px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .controls {
      display: grid;
      gap: 12px;
    }

    .controls.side-by-side {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .setpoint-row {
      align-items: center;
      display: grid;
      gap: 12px;
      grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
    }

    .setpoint-row button,
    .compact-controls button,
    .target-toggle-button,
    .chip {
      align-items: center;
      background: var(--thermostat-control-background);
      border: 0;
      border-radius: 14px;
      color: var(--thermostat-text-color);
      cursor: pointer;
      display: inline-flex;
      font: inherit;
      justify-content: center;
      min-height: 42px;
      padding: 0 12px;
      transition: background 120ms ease, filter 120ms ease, transform 120ms ease;
    }

    .setpoint-row button,
    .compact-controls button {
      font-size: 28px;
      line-height: 1;
      width: 100%;
    }

    button:active {
      filter: brightness(1.08);
      transform: scale(0.99);
    }

    button:focus {
      outline: none;
    }

    button:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 2px;
    }

    .setpoint-value {
      color: var(--thermostat-text-color);
      font-size: 20px;
      font-weight: 500;
      min-width: 72px;
      text-align: center;
      white-space: nowrap;
    }

    .target-toggle {
      display: grid;
      gap: 8px;
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .target-toggle-button {
      flex-direction: column;
      gap: 2px;
      min-height: 48px;
    }

    .target-toggle-button.active {
      background: var(--thermostat-control-active-background);
    }

    .compact-setpoint {
      display: grid;
      gap: 8px;
      min-width: 0;
    }

    .setpoint-label {
      color: var(--thermostat-secondary-text-color);
      font-size: 12px;
      font-weight: 700;
      text-align: center;
    }

    .compact-controls {
      align-items: center;
      display: grid;
      gap: 6px;
      grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
    }

    .compact-controls .setpoint-value {
      font-size: 16px;
      min-width: 54px;
    }

    .chip-row {
      display: grid;
      gap: 8px;
      grid-template-columns: repeat(auto-fit, minmax(0, 1fr));
    }

    .chip {
      gap: 8px;
      min-width: 0;
    }

    .chip ha-icon {
      --mdc-icon-size: 20px;
      flex: 0 0 auto;
    }

    .chip span {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .mode-chip.active,
    .preset-chip.active {
      background: color-mix(in srgb, var(--thermostat-active-mode-color, var(--primary-color)) 72%, transparent);
      color: var(--thermostat-active-chip-text-color);
    }

    .mode-heat {
      --thermostat-active-mode-color: var(--thermostat-mode-heat-color);
    }

    .mode-cool {
      --thermostat-active-mode-color: var(--thermostat-mode-cool-color);
    }

    .mode-heat-cool {
      --thermostat-active-mode-color: var(--thermostat-mode-heat-cool-color);
    }

    .mode-auto {
      --thermostat-active-mode-color: var(--thermostat-mode-auto-color);
    }

    .mode-fan {
      --thermostat-active-mode-color: var(--thermostat-mode-fan-color);
    }

    .mode-dry {
      --thermostat-active-mode-color: var(--thermostat-mode-dry-color);
    }

    .mode-off {
      --thermostat-active-mode-color: var(--thermostat-mode-off-color);
    }

    .mode-default {
      --thermostat-active-mode-color: var(--thermostat-mode-default-color);
    }

    .preset-chip.active {
      --thermostat-active-mode-color: var(--primary-color);
    }

    @media (max-width: 420px) {
      .controls.side-by-side {
        grid-template-columns: 1fr;
      }

      .setpoint-row {
        gap: 8px;
      }

      .setpoint-value {
        font-size: 18px;
        min-width: 64px;
      }
    }
  `;
}

customElements.define("thermostat-card", ThermostatCard);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "thermostat-card",
  name: "Thermostat Card",
  description: "Climate entity card with setpoints and modes",
});
