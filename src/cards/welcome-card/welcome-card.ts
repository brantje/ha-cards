import { css, html, PropertyValues } from "lit";
import { styleMap } from "lit/directives/style-map.js";
import { ActionConfig, handleActionConfig, HomeAssistant } from "custom-card-helpers";
import { BaseCard } from "../../shared/base-card";
import "./welcome-card-editor";

type WelcomeTabConfig = {
  icon: string;
  label: string;
  color?: string;
  tap_action?: ActionConfig;
};

type WelcomeCardConfig = {
  type: string;
  weather_entity?: string;
  show_temperature?: boolean;
  use_ha_weather_icons?: boolean;
  temperature_entity?: string;
  settings_navigation_path?: string;
  tabs?: WelcomeTabConfig[];
};

type HassEntity = {
  state: string;
  attributes: Record<string, any>;
};

const DEFAULT_SETTINGS_NAVIGATION_PATH = "/config/dashboard";
const DEFAULT_TAB_ACTION: ActionConfig = { action: "none" };

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

const WEATHER_EMOJI_ICON_MAP: Record<string, string> = {
  "clear-night": "\ud83c\udf19",
  cloudy: "\u2601\ufe0f",
  exceptional: "\ud83c\udf1e",
  fog: "\ud83c\udf2b\ufe0f",
  hail: "\u26c8\ufe0f",
  lightning: "\u26a1",
  "lightning-rainy": "\u26c8\ufe0f",
  partlycloudy: "\u26c5",
  pouring: "\ud83c\udf27\ufe0f",
  rainy: "\ud83d\udca7",
  snowy: "\u2744\ufe0f",
  "snowy-rainy": "\ud83c\udf28\ufe0f",
  sunny: "\u2600\ufe0f",
  windy: "\ud83c\udf2a\ufe0f",
  default: "\ud83c\udf21\ufe0f",
};

const HA_WEATHER_ICON_MAP: Record<string, string> = {
  "clear-night": "mdi:weather-night",
  cloudy: "mdi:weather-cloudy",
  exceptional: "mdi:alert-circle-outline",
  fog: "mdi:weather-fog",
  hail: "mdi:weather-hail",
  lightning: "mdi:weather-lightning",
  "lightning-rainy": "mdi:weather-lightning-rainy",
  partlycloudy: "mdi:weather-partly-cloudy",
  pouring: "mdi:weather-pouring",
  rainy: "mdi:weather-rainy",
  snowy: "mdi:weather-snowy",
  "snowy-rainy": "mdi:weather-snowy-rainy",
  sunny: "mdi:weather-sunny",
  windy: "mdi:weather-windy",
  "windy-variant": "mdi:weather-windy-variant",
};

class WelcomeCard extends BaseCard {
  config!: WelcomeCardConfig;
  hass!: HomeAssistant;
  private _collapsed = false;
  private _now = new Date();
  private clockTimer?: number;

  static properties = {
    hass: { attribute: false },
    config: { attribute: false },
    _collapsed: { state: true },
    _now: { state: true },
  };

  static getConfigElement() {
    return document.createElement("welcome-card-editor");
  }

  static getStubConfig() {
    return {
      weather_entity: "",
      show_temperature: true,
      use_ha_weather_icons: false,
      settings_navigation_path: DEFAULT_SETTINGS_NAVIGATION_PATH,
      tabs: DEFAULT_TABS,
    };
  }

  setConfig(config: WelcomeCardConfig) {
    this.config = {
      show_temperature: true,
      use_ha_weather_icons: false,
      settings_navigation_path: DEFAULT_SETTINGS_NAVIGATION_PATH,
      tabs: DEFAULT_TABS,
      ...config,
    };
  }

  connectedCallback() {
    super.connectedCallback();
    this.clockTimer = window.setInterval(() => {
      this._now = new Date();
    }, 60000);
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    if (this.clockTimer) {
      window.clearInterval(this.clockTimer);
      this.clockTimer = undefined;
    }
  }

  shouldUpdate(changedProperties: PropertyValues): boolean {
    if (changedProperties.has("_collapsed") || changedProperties.has("_now")) {
      return true;
    }

    return super.shouldUpdate(changedProperties);
  }

  protected getWatchedEntities(): string[] {
    return [
      this.config?.weather_entity,
      this.config?.show_temperature ? this.config?.temperature_entity : undefined,
    ].filter((id): id is string => Boolean(id));
  }

  render() {
    const tabs = this.config.tabs || [];

    return html`
      <ha-card>
        <div class="card">
          <div class="top-row">
            <button
              class="circle-button"
              type="button"
              aria-label=${this._collapsed ? "Expand welcome card" : "Collapse welcome card"}
              @click=${this.toggleCollapsed}
            >
              <ha-icon .icon=${this._collapsed ? "mdi:chevron-down" : "mdi:chevron-up"}></ha-icon>
            </button>

            <button
              class="date-pill"
              type="button"
              aria-label="Open weather details"
              @click=${this.handleWeatherTap}
            >
              ${this.renderWeatherIcon()}
              <span>${this.formatDate()}</span>
              ${this.config.show_temperature
                ? html`<span class="temperature">${this.formatTemperature()}</span>`
                : ""}
            </button>

            <button
              class="circle-button"
              type="button"
              aria-label="Open dashboard settings"
              @click=${this.handleSettingsTap}
            >
              <ha-icon icon="mdi:cog"></ha-icon>
            </button>
          </div>

          <div class="content">
            <h2>${this.getGreeting()},<br />${this.getUserName()}!</h2>
            ${!this._collapsed && tabs.length
              ? html`<div class="tabs">${tabs.map((tab) => this.renderTab(tab))}</div>`
              : ""}
          </div>
        </div>
      </ha-card>
    `;
  }

  private renderTab(tab: WelcomeTabConfig) {
    const color = tab.color || "var(--primary-color)";
    const styles = {
      "--tab-color": color,
    };

    return html`
      <button
        class="tab"
        style=${styleMap(styles)}
        type="button"
        aria-label=${tab.label}
        @click=${() => this.runTabAction(tab)}
      >
        <span class="tab-icon">
          <ha-icon .icon=${tab.icon || "mdi:shape"}></ha-icon>
        </span>
        <span class="tab-label">${tab.label || "Tab"}</span>
      </button>
    `;
  }

  private toggleCollapsed() {
    this._collapsed = !this._collapsed;
  }

  private handleSettingsTap() {
    handleActionConfig(
      this,
      this.hass,
      {},
      {
        action: "navigate",
        navigation_path: this.config.settings_navigation_path || DEFAULT_SETTINGS_NAVIGATION_PATH,
      }
    );
  }

  private handleWeatherTap() {
    const entity = this.config.weather_entity || this.config.temperature_entity;

    if (!entity) {
      return;
    }

    handleActionConfig(this, this.hass, { entity }, { action: "more-info" });
  }

  private runTabAction(tab: WelcomeTabConfig) {
    handleActionConfig(this, this.hass, {}, tab.tap_action || DEFAULT_TAB_ACTION);
  }

  private getGreeting() {
    const hour = this._now.getHours();

    if (hour < 12) {
      return "Good morning";
    }

    if (hour < 18) {
      return "Good afternoon";
    }

    return "Good evening";
  }

  private getUserName() {
    return this.hass?.user?.name || "there";
  }

  private getWeatherEntity() {
    return this.config.weather_entity
      ? (this.hass?.states?.[this.config.weather_entity] as HassEntity | undefined)
      : undefined;
  }

  private getTemperatureEntity() {
    return this.config.temperature_entity
      ? (this.hass?.states?.[this.config.temperature_entity] as HassEntity | undefined)
      : undefined;
  }

  private getWeatherIcon() {
    const weatherState = this.getWeatherEntity()?.state;

    return weatherState
      ? HA_WEATHER_ICON_MAP[weatherState] || "mdi:weather-cloudy"
      : "mdi:weather-cloudy";
  }

  private getWeatherEmoji() {
    const weatherState = this.getWeatherEntity()?.state;

    return weatherState
      ? WEATHER_EMOJI_ICON_MAP[weatherState] || WEATHER_EMOJI_ICON_MAP.default
      : WEATHER_EMOJI_ICON_MAP.default;
  }

  private renderWeatherIcon() {
    if (this.config.use_ha_weather_icons) {
      return html`<ha-icon .icon=${this.getWeatherIcon()}></ha-icon>`;
    }

    return html`<span class="weather-emoji" aria-hidden="true">${this.getWeatherEmoji()}</span>`;
  }

  private formatDate() {
    const language = this.hass?.locale?.language;

    return new Intl.DateTimeFormat(language, {
      month: "short",
      day: "numeric",
    }).format(this._now);
  }

  private formatTemperature() {
    const temperatureEntity = this.getTemperatureEntity();
    if (temperatureEntity) {
      return this.formatTemperatureValue(
        temperatureEntity.state,
        temperatureEntity.attributes?.unit_of_measurement
      );
    }

    const weatherEntity = this.getWeatherEntity();
    const temperature = weatherEntity?.attributes?.temperature;
    if (temperature === undefined || temperature === null || temperature === "") {
      return "-";
    }

    return this.formatTemperatureValue(
      temperature,
      weatherEntity?.attributes?.temperature_unit || this.hass?.config?.unit_system?.temperature
    );
  }

  private formatTemperatureValue(value: unknown, unit?: string) {
    const formattedValue = String(value);
    const formattedUnit = this.formatTemperatureUnit(unit);

    return `${formattedValue}${formattedUnit}`;
  }

  private formatTemperatureUnit(unit?: string) {
    if (!unit) {
      return "\u00b0";
    }

    if (unit.startsWith("\u00b0")) {
      return unit;
    }

    if (unit === "C" || unit === "F") {
      return `\u00b0${unit}`;
    }

    return unit;
  }

  static styles = css`
    ha-card {
      background: #1d1d1d;
      border: none;
      border-radius: 20px;
      color: var(--primary-text-color);
      overflow: hidden;
    }

    .card {
      padding: 17px 19px 14px;
    }

    .top-row {
      align-items: center;
      display: grid;
      gap: 12px;
      grid-template-columns: 36px minmax(0, 1fr) 36px;
    }

    .circle-button,
    .date-pill {
      align-items: center;
      background: #242424;
      border: 0;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.45);
      color: rgb(221, 221, 221);
      display: inline-flex;
      justify-content: center;
    }

    .circle-button {
      border-radius: 999px;
      cursor: pointer;
      height: 36px;
      padding: 0;
      transition: filter 120ms ease, transform 120ms ease;
      width: 36px;
    }

    .circle-button:active,
    .tab:active {
      filter: brightness(1.08);
      transform: scale(0.98);
    }

    .circle-button:focus,
    .tab:focus {
      outline: none;
    }

    .circle-button:focus-visible,
    .tab:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 3px;
    }

    .circle-button ha-icon {
      --mdc-icon-size: 18px;
    }

    .date-pill {
      border-radius: 999px;
      box-sizing: border-box;
      cursor: pointer;
      font-size: 14px;
      font-weight: 800;
      gap: 5px;
      justify-self: center;
      line-height: 1;
      min-height: 36px;
      min-width: 125px;
      padding: 0 18px;
    }

    .date-pill ha-icon {
      --mdc-icon-size: 14px;
    }

    .weather-emoji {
      font-size: 13px;
      line-height: 1;
    }

    .temperature::before {
      content: "\\00b7";
      margin: 0 6px 0 1px;
      opacity: 0.55;
    }

    .content {
      margin-top: 17px;
      font-weight: bold;
      font-size: 24px;
    }

    h2 {
      color: #ddd;
      font-size: 20px;
      font-weight: 800;
      letter-spacing: -0.03em;
      line-height: 1.2;
      margin: 0;
    }

    .tabs {
      display: grid;
      grid-template-columns: repeat(4, 55px);
      justify-content: space-between;
      margin-top: 16px;
    }

    .tab {
      align-items: center;
      background: #202020;
      border: 0;
      border-radius: 29px;
      box-shadow: 0 5px 12px rgba(0, 0, 0, 0.38);
      color: rgb(221, 221, 221);
      cursor: pointer;
      display: grid;
      gap: 8px;
      justify-items: center;
      min-height: 74px;
      padding: 6px 5px 10px;
      transition: filter 120ms ease, transform 120ms ease;
    }

    .tab-icon {
      align-items: center;
      background: color-mix(in srgb, var(--tab-color) 28%, transparent);
      border-radius: 999px;
      color: var(--tab-color);
      display: flex;
      height: 43px;
      justify-content: center;
      width: 43px;
    }

    .tab-icon ha-icon {
      --mdc-icon-size: 22px;
    }

    .tab-label {
      font-size: 12px;
      font-weight: 800;
      line-height: 1.1;
      max-width: 48px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    @media (max-width: 720px) {
      .card {
        padding: 17px 19px 14px;
      }

      .top-row {
        grid-template-columns: 36px minmax(0, 1fr) 36px;
      }

      .circle-button {
        height: 36px;
        width: 36px;
      }

      .circle-button ha-icon {
        --mdc-icon-size: 18px;
      }

      .date-pill {
        font-size: 16px;
        min-height: 36px;
        min-width: 125px;
        padding: 0 18px;
      }

      h2 {
        font-size: 20px;
      }

      .tabs {
        grid-template-columns: repeat(4, 55px);
      }

      .tab {
        min-height: 74px;
      }

      .tab-icon {
        height: 43px;
        width: 43px;
      }

      .tab-icon ha-icon {
        --mdc-icon-size: 22px;
      }

      .tab-label {
        font-size: 12px;
      }
    }
  `;
}

customElements.define("welcome-card", WelcomeCard);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "welcome-card",
  name: "Welcome Card",
  description: "Greeting, weather/date pill, and quick-action tabs",
});
