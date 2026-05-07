import { css, html, PropertyValues } from "lit";
import { handleActionConfig, HomeAssistant } from "custom-card-helpers";
import { BaseCard } from "../../shared/base-card";
import "./unavailable-devices-card-editor";

type RowDetailMode = "none" | "count" | "entities";

type UnavailableDevicesCardConfig = {
  type: string;
  title?: string;
  domains?: string[] | string;
  issue_states?: string[] | string;
  ignored_entities?: string[] | string;
  ignored_devices?: string[] | string;
  ignored_integrations?: string[] | string;
  ignored_name_patterns?: string[] | string;
  row_detail?: RowDetailMode;
};

type HassEntity = {
  state: string;
  attributes: Record<string, any>;
};

type EntityRegistryEntry = {
  entity_id: string;
  device_id?: string | null;
  icon?: string | null;
  original_icon?: string | null;
  name?: string | null;
  original_name?: string | null;
  platform?: string | null;
};

type DeviceRegistryEntry = {
  id: string;
  name?: string | null;
  name_by_user?: string | null;
};

type IssueDevice = {
  device: DeviceRegistryEntry;
  entities: EntityRegistryEntry[];
};

const DEFAULT_TITLE = "Possible Issues";
const DEFAULT_DOMAINS = ["sensor", "light", "switch"];
const DEFAULT_ISSUE_STATES = ["unavailable"];
const DEFAULT_ROW_DETAIL: RowDetailMode = "none";

class UnavailableDevicesCard extends BaseCard {
  config!: UnavailableDevicesCardConfig;
  hass!: HomeAssistant;
  private entityRegistry: EntityRegistryEntry[] = [];
  private deviceRegistry: DeviceRegistryEntry[] = [];
  private registryLoading = false;
  private registryError = false;
  private registryVersion = 0;

  static properties = {
    hass: { attribute: false },
    config: { attribute: false },
    registryVersion: { state: true },
  };

  static getConfigElement() {
    return document.createElement("unavailable-devices-card-editor");
  }

  static getStubConfig() {
    return {
      title: DEFAULT_TITLE,
      domains: DEFAULT_DOMAINS,
      issue_states: DEFAULT_ISSUE_STATES,
      ignored_entities: [],
      ignored_devices: [],
      ignored_integrations: [],
      ignored_name_patterns: [],
      row_detail: DEFAULT_ROW_DETAIL,
    };
  }

  setConfig(config: UnavailableDevicesCardConfig) {
    this.config = {
      title: DEFAULT_TITLE,
      domains: DEFAULT_DOMAINS,
      issue_states: DEFAULT_ISSUE_STATES,
      ignored_entities: [],
      ignored_devices: [],
      ignored_integrations: [],
      ignored_name_patterns: [],
      row_detail: DEFAULT_ROW_DETAIL,
      ...config,
    };
  }

  shouldUpdate(changedProperties: PropertyValues): boolean {
    if (changedProperties.has("config") || changedProperties.has("registryVersion")) {
      return true;
    }

    if (changedProperties.has("hass")) {
      const oldHass = changedProperties.get("hass") as HomeAssistant | undefined;
      if (!oldHass) {
        return true;
      }

      if (!this.hass) {
        return false;
      }

      const watched = this.getDomainEntityIds(this.hass);
      return watched.some((entityId) => oldHass.states?.[entityId] !== this.hass.states?.[entityId]);
    }

    return false;
  }

  updated(changedProperties: PropertyValues) {
    if (changedProperties.has("hass")) {
      this.loadRegistries();
    }
  }

  render() {
    const devices = this.getIssueDevices();

    if (!devices.length) {
      return html``;
    }

    return html`
      <ha-card>
        <div class="card">
          <h2>${this.config.title || DEFAULT_TITLE}</h2>
          <div class="devices">${devices.map((device) => this.renderDeviceRow(device))}</div>
        </div>
      </ha-card>
    `;
  }

  private renderDeviceRow(issueDevice: IssueDevice) {
    const name = this.getDeviceName(issueDevice.device);
    const icon = this.getIssueIcon(issueDevice.entities[0]);
    const detail = this.getRowDetail(issueDevice);

    return html`
      <button class="device-row" type="button" @click=${() => this.openDevice(issueDevice.device.id)}>
        <ha-icon .icon=${icon}></ha-icon>
        <span class="row-text">
          <span class="name">${name}</span>
          ${detail ? html`<span class="detail">${detail}</span>` : ""}
        </span>
      </button>
    `;
  }

  private getIssueDevices(): IssueDevice[] {
    if (this.registryError || !this.entityRegistry.length || !this.deviceRegistry.length || !this.hass) {
      return [];
    }

    const issueStates = new Set(this.normalizeList(this.config.issue_states, DEFAULT_ISSUE_STATES));
    const ignoredEntities = this.normalizeList(this.config.ignored_entities);
    const ignoredDevices = this.normalizeList(this.config.ignored_devices);
    const ignoredIntegrations = new Set(
      this.normalizeList(this.config.ignored_integrations).map((integration) => integration.toLowerCase())
    );
    const ignoredNames = this.normalizeList(this.config.ignored_name_patterns);
    const deviceById = new Map(this.deviceRegistry.map((device) => [device.id, device]));
    const grouped = new Map<string, EntityRegistryEntry[]>();

    for (const entry of this.entityRegistry) {
      const entity = this.hass.states[entry.entity_id] as HassEntity | undefined;
      const deviceId = entry.device_id || "";
      const device = deviceById.get(deviceId);

      if (!entity || !device || !issueStates.has(entity.state)) {
        continue;
      }

      if (entry.platform && ignoredIntegrations.has(entry.platform.toLowerCase())) {
        continue;
      }

      if (this.isIgnored(entry.entity_id, ignoredEntities) || this.isIgnored(deviceId, ignoredDevices)) {
        continue;
      }

      const searchableName = [this.getDeviceName(device), entity.attributes?.friendly_name, entry.name, entry.original_name]
        .filter(Boolean)
        .join(" ");

      if (this.isIgnored(searchableName, ignoredNames)) {
        continue;
      }

      grouped.set(deviceId, [...(grouped.get(deviceId) || []), entry]);
    }

    return [...grouped.entries()]
      .map(([deviceId, entities]) => ({
        device: deviceById.get(deviceId)!,
        entities,
      }))
      .sort((a, b) => this.getDeviceName(a.device).localeCompare(this.getDeviceName(b.device)));
  }

  private getDomainEntityIds(hass: HomeAssistant) {
    const domains = new Set(this.normalizeList(this.config?.domains, DEFAULT_DOMAINS));
    return Object.keys(hass.states || {}).filter((entityId) => domains.has(this.getDomain(entityId)));
  }

  private getDomain(entityId: string) {
    return entityId.split(".", 1)[0];
  }

  private getDeviceName(device: DeviceRegistryEntry) {
    return device.name_by_user || device.name || "Unknown device";
  }

  private getIssueIcon(entry?: EntityRegistryEntry) {
    const entity = entry ? (this.hass?.states?.[entry.entity_id] as HassEntity | undefined) : undefined;
    return entity?.attributes?.icon || entry?.icon || entry?.original_icon || "mdi:devices";
  }

  private getRowDetail(issueDevice: IssueDevice) {
    const mode = this.config.row_detail || DEFAULT_ROW_DETAIL;

    if (mode === "count") {
      const count = issueDevice.entities.length;
      return `${count} unavailable ${count === 1 ? "entity" : "entities"}`;
    }

    if (mode === "entities") {
      return issueDevice.entities
        .map((entry) => {
          const entity = this.hass.states[entry.entity_id] as HassEntity | undefined;
          return entity?.attributes?.friendly_name || entry.name || entry.original_name || entry.entity_id;
        })
        .join(", ");
    }

    return "";
  }

  private openDevice(deviceId: string) {
    handleActionConfig(
      this,
      this.hass,
      {},
      {
        action: "navigate",
        navigation_path: `/config/devices/device/${deviceId}`,
      }
    );
  }

  private normalizeList(value?: string[] | string, fallback: string[] = []) {
    const source = value === undefined || value === null || value === "" ? fallback : value;
    const values = Array.isArray(source) ? source : String(source).split(",");

    return values.map((item) => String(item).trim()).filter(Boolean);
  }

  private isIgnored(value: string, ignoredPatterns: string[]) {
    const normalizedValue = value.toLowerCase();
    return ignoredPatterns.some((pattern) => normalizedValue.includes(pattern.toLowerCase()));
  }

  private async loadRegistries() {
    if (!this.hass || this.registryLoading || this.entityRegistry.length || this.registryError) {
      return;
    }

    this.registryLoading = true;

    try {
      const [entities, devices] = await Promise.all([
        this.hass.callWS<EntityRegistryEntry[]>({ type: "config/entity_registry/list" }),
        this.hass.callWS<DeviceRegistryEntry[]>({ type: "config/device_registry/list" }),
      ]);

      this.entityRegistry = entities;
      this.deviceRegistry = devices;
    } catch {
      this.registryError = true;
    } finally {
      this.registryLoading = false;
      this.registryVersion += 1;
    }
  }

  static styles = css`
    ha-card {
      background: rgba(68, 115, 158, 1);
      border: none;
      border-radius: 20px;
      color: white;
      overflow: hidden;
      --primary-color: white;
      --paper-item-icon-color: white;
      --secondary-text-color: white;
    }

    .card {
      padding: 12px;
    }

    h2 {
      color: white;
      font-size: 22px;
      font-weight: 400;
      line-height: 1.2;
      margin: 12px 4px 18px;
    }

    .devices {
      display: grid;
      gap: 2px;
    }

    .device-row {
      align-items: center;
      background: transparent;
      border: 0;
      color: white;
      cursor: pointer;
      display: grid;
      font: inherit;
      gap: 20px;
      grid-template-columns: 36px minmax(0, 1fr);
      min-height: 46px;
      padding: 4px 8px;
      text-align: left;
      width: 100%;
    }

    .device-row:active {
      filter: brightness(1.08);
    }

    .device-row:focus {
      outline: none;
    }

    .device-row:focus-visible {
      outline: 2px solid white;
      outline-offset: -2px;
    }

    .device-row ha-icon {
      justify-self: center;
      --mdc-icon-size: 20px;
    }

    .row-text {
      display: grid;
      gap: 3px;
      min-width: 0;
    }

    .name {
      font-size: 14px;
      line-height: 1.25;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .detail {
      color: rgba(255, 255, 255, 0.76);
      font-size: 12px;
      line-height: 1.25;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  `;
}

customElements.define("unavailable-devices-card", UnavailableDevicesCard);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "unavailable-devices-card",
  name: "Unavailable Devices Card",
  description: "Lists devices with unavailable entities across configurable domains",
});
