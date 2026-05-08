import { css, html } from "lit";
import { styleMap } from "lit/directives/style-map.js";
import { ActionConfig, formatNumber, handleActionConfig, HomeAssistant } from "custom-card-helpers";
import { BaseCard } from "../../shared/base-card";
import "./room-card-editor";

type RoomCardConfig = {
  type: string;
  entity: string;
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

type HassEntity = {
  state: string;
  attributes: Record<string, any>;
};

const DEFAULT_TAP_ACTION: ActionConfig = { action: "more-info" };
const DEFAULT_LIGHT_TAP_ACTION: ActionConfig = { action: "toggle" };
const DEFAULT_LIGHT_HOLD_ACTION: ActionConfig = { action: "more-info" };
const DEFAULT_SENSOR1_ICON = "mdi:thermometer";
const DEFAULT_SENSOR2_ICON = "mdi:water-percent";

class RoomCard extends BaseCard {
  config!: RoomCardConfig;
  hass!: HomeAssistant;
  private holdTimer?: number;
  private lightHoldTriggered = false;

  static getConfigElement() {
    return document.createElement("room-card-editor");
  }

  static getStubConfig() {
    return {
      entity: "",
      name: "Living room",
      icon: "mdi:sofa",
      sensor1_icon: DEFAULT_SENSOR1_ICON,
      sensor2_icon: DEFAULT_SENSOR2_ICON,
      tap_action: DEFAULT_TAP_ACTION,
      light_tap_action: DEFAULT_LIGHT_TAP_ACTION,
      light_hold_action: DEFAULT_LIGHT_HOLD_ACTION,
    };
  }

  setConfig(config: RoomCardConfig) {
    if (!config.entity) {
      throw new Error("Room Card requires a light entity");
    }

    this.config = {
      icon: "mdi:sofa",
      sensor1_icon: DEFAULT_SENSOR1_ICON,
      sensor2_icon: DEFAULT_SENSOR2_ICON,
      tap_action: DEFAULT_TAP_ACTION,
      light_tap_action: DEFAULT_LIGHT_TAP_ACTION,
      light_hold_action: DEFAULT_LIGHT_HOLD_ACTION,
      ...config,
    };
  }

  protected getWatchedEntities(): string[] {
    return [
      this.config?.entity,
      this.config?.sensor1_entity,
      this.config?.sensor2_entity,
    ].filter((id): id is string => Boolean(id));
  }

  render() {
    const light = this.getLightEntity();
    const isLightOff = this.isLightOff(light);
    const name = this.config.name || light?.attributes?.friendly_name || "Room";
    const lightRgb = this.getLightRgb(light);
    const hasSensors = Boolean(this.config.sensor1_entity || this.config.sensor2_entity);
    const styles = lightRgb
      ? {
          "--room-light-rgb": lightRgb.join(","),
        }
      : {};

    return html`
      <ha-card class=${isLightOff ? "light-off" : ""} style=${styleMap(styles)} @click=${this.handleCardTap}>
        <div class="card" role="button" tabindex="0" @keydown=${this.handleCardKeydown}>
          <div class="top-row">
            <div class="room-icon">
              <ha-icon .icon=${this.config.icon || "mdi:sofa"}></ha-icon>
            </div>

            <button
              class=${`light-button ${isLightOff ? "light-button-off" : ""}`}
              type="button"
              aria-label="Light actions"
              @click=${this.handleLightTap}
              @pointerdown=${this.handleLightPointerDown}
              @pointerup=${this.handleLightPointerUp}
              @pointercancel=${this.cancelLightHold}
              @pointerleave=${this.cancelLightHold}
              @contextmenu=${this.preventContextMenu}
            >
              <ha-icon .icon=${isLightOff ? "mdi:lightbulb-off" : "mdi:lightbulb"}></ha-icon>
            </button>
          </div>

          <div class="details">
            <div class="name">${name}</div>
            ${hasSensors
              ? html`
                  <div class="sensors">
                    ${this.config.sensor1_entity
                      ? this.renderSensor(
                          this.config.sensor1_icon || DEFAULT_SENSOR1_ICON,
                          this.config.sensor1_entity
                        )
                      : ""}
                    ${this.config.sensor2_entity
                      ? this.renderSensor(
                          this.config.sensor2_icon || DEFAULT_SENSOR2_ICON,
                          this.config.sensor2_entity
                        )
                      : ""}
                  </div>
                `
              : ""}
          </div>
        </div>
      </ha-card>
    `;
  }

  private renderSensor(icon: string, entityId?: string) {
    const entity = entityId ? (this.hass?.states?.[entityId] as HassEntity | undefined) : undefined;
    const value = entity ? this.formatEntityState(entity) : "-";

    return html`
      <span class="sensor">
        <ha-icon .icon=${icon}></ha-icon>
        <span>${value}</span>
      </span>
    `;
  }

  private formatEntityState(entity: HassEntity) {
    const unit = entity.attributes?.unit_of_measurement || "";
    const value = this.formatSensorValue(entity.state);
    return `${value}${unit ? ` ${unit}` : ""}`;
  }

  private formatSensorValue(value: string) {
    const numericValue = Number(value);

    if (value.trim() === "" || !Number.isFinite(numericValue)) {
      return value;
    }

    return formatNumber(numericValue, this.hass?.locale, { maximumFractionDigits: 2 });
  }

  private getLightEntity() {
    return this.hass?.states?.[this.config.entity] as HassEntity | undefined;
  }

  private isLightOff(entity?: HassEntity) {
    return !entity || entity.state === "off" || entity.state === "unavailable";
  }

  private getLightRgb(entity?: HassEntity): [number, number, number] | undefined {
    if (this.isLightOff(entity)) {
      return undefined;
    }

    const rgbColor = entity.attributes?.rgb_color;
    if (Array.isArray(rgbColor) && rgbColor.length >= 3) {
      return [Number(rgbColor[0]), Number(rgbColor[1]), Number(rgbColor[2])];
    }

    const hsColor = entity.attributes?.hs_color;
    if (Array.isArray(hsColor) && hsColor.length >= 2) {
      return this.hslToRgb(Number(hsColor[0]), Number(hsColor[1]), 50);
    }

    return undefined;
  }

  private hslToRgb(hue: number, saturation: number, lightness: number): [number, number, number] {
    const s = saturation / 100;
    const l = lightness / 100;
    const chroma = (1 - Math.abs(2 * l - 1)) * s;
    const huePrime = hue / 60;
    const x = chroma * (1 - Math.abs((huePrime % 2) - 1));
    const match = l - chroma / 2;
    let rgb: [number, number, number] = [0, 0, 0];

    if (huePrime >= 0 && huePrime < 1) {
      rgb = [chroma, x, 0];
    } else if (huePrime < 2) {
      rgb = [x, chroma, 0];
    } else if (huePrime < 3) {
      rgb = [0, chroma, x];
    } else if (huePrime < 4) {
      rgb = [0, x, chroma];
    } else if (huePrime < 5) {
      rgb = [x, 0, chroma];
    } else {
      rgb = [chroma, 0, x];
    }

    return rgb.map((channel) => Math.round((channel + match) * 255)) as [number, number, number];
  }

  private handleCardTap(event: Event) {
    if ((event.target as HTMLElement).closest(".light-button")) {
      return;
    }

    this.runAction(this.config.tap_action || DEFAULT_TAP_ACTION);
  }

  private handleCardKeydown(event: KeyboardEvent) {
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }

    event.preventDefault();
    this.runAction(this.config.tap_action || DEFAULT_TAP_ACTION);
  }

  private handleLightTap(event: Event) {
    event.stopPropagation();

    if (this.lightHoldTriggered) {
      this.lightHoldTriggered = false;
      return;
    }

    this.cancelLightHold();
    this.runAction(this.config.light_tap_action || DEFAULT_LIGHT_TAP_ACTION);
  }

  private handleLightPointerDown(event: PointerEvent) {
    event.stopPropagation();
    this.lightHoldTriggered = false;
    this.cancelLightHold();

    this.holdTimer = window.setTimeout(() => {
      this.lightHoldTriggered = true;
      this.runAction(this.config.light_hold_action || DEFAULT_LIGHT_HOLD_ACTION);
    }, 500);
  }

  private handleLightPointerUp(event: PointerEvent) {
    event.stopPropagation();
    this.cancelLightHold();
  }

  private cancelLightHold() {
    if (this.holdTimer) {
      window.clearTimeout(this.holdTimer);
      this.holdTimer = undefined;
    }
  }

  private preventContextMenu(event: Event) {
    event.preventDefault();
  }

  private runAction(actionConfig: ActionConfig) {
    handleActionConfig(
      this,
      this.hass,
      {
        entity: this.config.entity,
      },
      actionConfig
    );
  }

  static styles = css`
    ha-card {
      --room-light-rgb: 94, 124, 84;
      background: #332d1d;
      border-radius: 20px;
      color: var(--primary-text-color);
      overflow: hidden;
      border: none;
    }

    ha-card.light-off {
      background: var(--card-background-color);
    }

    .card {
      cursor: pointer;
      padding: 12px 12px 12px 24px;
    }

    .card:focus {
      outline: none;
    }

    .card:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: -6px;
    }

    .top-row {
      align-items: center;
      display: flex;
      gap: 24px;
      justify-content: space-between;
    }

    .room-icon {
      align-items: center;
      background: rgba(255, 211, 76, 0.18);
      border-radius: 999px;
      color: #ffd34c;
      display: flex;
      height: 42px;
      justify-content: center;
      width: 42px;
    }

    ha-card.light-off .room-icon {
      background: #2b2b2b;
      color: #656565;
    }

    .room-icon ha-icon {
      --mdc-icon-size: 20px;
    }

    .light-button {
      align-items: center;
      background: rgba(var(--room-light-rgb), 0.33);
      border: 0;
      border-radius: 14px;
      color: #ffd968;
      cursor: pointer;
      display: flex;
      flex: 0 0 33%;
      height: 42px;
      justify-content: center;
      padding: 0;
      transition: filter 120ms ease, transform 120ms ease;
      width: 33%;
      min-width: 107px;
    }

    .light-button-off {
      background: #2b2b2b;
      color: #d7d7d7;
    }

    .light-button:active {
      filter: brightness(1.08);
      transform: scale(0.99);
    }

    .light-button:focus {
      outline: none;
    }

    .light-button:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 3px;
    }

    .light-button ha-icon {
      --mdc-icon-size: 20px;
    }

    .details {
      margin-top: 12px;
    }

    .name {
      color: #ffd968;
      font-size: 14px;
      font-weight: 700;
      line-height: 1.1;
    }

    ha-card.light-off .name {
      color: #9b9b9b;
    }

    .sensors {
      align-items: center;
      color: rgba(255, 217, 104, 0.68);
      display: flex;
      flex-wrap: wrap;
      font-size: 12px;
      font-weight: 700;
      gap: 14px;
      margin-top: 6px;
    }

    ha-card.light-off .sensors {
      color: #777;
    }

    .sensor {
      align-items: center;
      display: inline-flex;
      gap: 7px;
      white-space: nowrap;
    }

    .sensor ha-icon {
      --mdc-icon-size: 12px;
    }

    @media (max-width: 420px) {
      .card {
        padding: 20px;
      }

      .room-icon,
      .light-button {
        height: 72px;
      }

      .room-icon {
        width: 72px;
      }

      .light-button {
        flex-basis: 33%;
        width: 33%;
      }
    }
  `;
}

customElements.define("room-card", RoomCard);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "room-card",
  name: "Room Card",
  description: "Room card with light actions and sensors",
});
