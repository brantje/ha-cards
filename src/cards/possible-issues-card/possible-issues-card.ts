import { css, html, PropertyValues } from "lit";
import { handleActionConfig, HomeAssistant } from "custom-card-helpers";
import { BaseCard } from "../../shared/base-card";
import "./possible-issues-card-editor";

type RowDetailMode = "none" | "count" | "entities";
type ValueCheckOperator = "equals" | "not_equals" | "gt" | "lt" | "lte" | "gte" | "contains" | "not_contains";

type ValueCheckConfig = {
  entity?: string;
  operator?: ValueCheckOperator;
  values?: string[] | string;
  message?: string;
  submessage?: string;
};

type NormalizedValueCheck = {
  entity: string;
  operator: ValueCheckOperator;
  values: string[];
  message?: string;
  submessage?: string;
};

type PossibleIssuesCardConfig = {
  type: string;
  title?: string;
  domains?: string[] | string;
  issue_states?: string[] | string;
  ignored_entities?: string[] | string;
  ignored_devices?: string[] | string;
  ignored_integrations?: string[] | string;
  ignored_name_patterns?: string[] | string;
  row_detail?: RowDetailMode;
  value_checks?: ValueCheckConfig[];
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

type IssueEntity = {
  check: NormalizedValueCheck;
  entity: HassEntity;
  matchedValue?: string;
};

const DEFAULT_TITLE = "Possible Issues";
const DEFAULT_DOMAINS = ["sensor", "light", "switch"];
const DEFAULT_ISSUE_STATES = ["unavailable"];
const DEFAULT_ROW_DETAIL: RowDetailMode = "none";

class PossibleIssuesCard extends BaseCard {
  config!: PossibleIssuesCardConfig;
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
    return document.createElement("possible-issues-card-editor");
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
      value_checks: [],
    };
  }

  setConfig(config: PossibleIssuesCardConfig) {
    this.config = {
      title: DEFAULT_TITLE,
      domains: DEFAULT_DOMAINS,
      issue_states: DEFAULT_ISSUE_STATES,
      ignored_entities: [],
      ignored_devices: [],
      ignored_integrations: [],
      ignored_name_patterns: [],
      row_detail: DEFAULT_ROW_DETAIL,
      value_checks: [],
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

      const watched = this.getWatchedEntityIds(this.hass);
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
    const entities = this.getValueCheckIssues();

    if (!devices.length && !entities.length) {
      return html``;
    }

    return html`
      <ha-card>
        <div class="card">
          <h2>${this.config.title || DEFAULT_TITLE}</h2>
          <div class="devices">
            ${devices.map((device) => this.renderDeviceRow(device))}
            ${entities.map((issue) => this.renderEntityRow(issue))}
          </div>
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

  private renderEntityRow(issue: IssueEntity) {
    const entityId = issue.check.entity;
    const name = issue.check.message || this.getEntityName(entityId, issue.entity);
    const detail = issue.check.submessage || this.getValueCheckDetail(issue);
    const icon = issue.entity.attributes?.icon || "mdi:alert-circle-outline";

    return html`
      <button class="device-row" type="button" @click=${() => this.openEntity(entityId)}>
        <ha-icon .icon=${icon}></ha-icon>
        <span class="row-text">
          <span class="name">${name}</span>
          <span class="detail">${detail}</span>
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

  private getValueCheckIssues(): IssueEntity[] {
    if (!this.hass) {
      return [];
    }

    return this.getValueChecks()
      .map((check) => {
        const entity = this.hass.states[check.entity] as HassEntity | undefined;
        const matchedValue = entity ? this.getMatchedValue(entity.state, check) : undefined;

        return entity && matchedValue !== undefined
          ? {
              check,
              entity,
              matchedValue,
            }
          : undefined;
      })
      .filter(Boolean) as IssueEntity[];
  }

  private getDomainEntityIds(hass: HomeAssistant) {
    const domains = new Set(this.normalizeList(this.config?.domains, DEFAULT_DOMAINS));
    return Object.keys(hass.states || {}).filter((entityId) => domains.has(this.getDomain(entityId)));
  }

  private getWatchedEntityIds(hass: HomeAssistant) {
    return [...new Set([...this.getDomainEntityIds(hass), ...this.getValueChecks().map((check) => check.entity)])];
  }

  private getDomain(entityId: string) {
    return entityId.split(".", 1)[0];
  }

  private getDeviceName(device: DeviceRegistryEntry) {
    return device.name_by_user || device.name || "Unknown device";
  }

  private getEntityName(entityId: string, entity: HassEntity) {
    return entity.attributes?.friendly_name || entityId;
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

  private getValueCheckDetail(issue: IssueEntity) {
    const operator = this.getOperatorLabel(issue.check.operator);
    const valueText =
      issue.check.operator === "not_contains" ? issue.check.values.join(", ") : issue.matchedValue || issue.check.values.join(", ");

    return `${issue.entity.state} ${operator} ${valueText}`;
  }

  private getOperatorLabel(operator: ValueCheckOperator) {
    const labels: Record<ValueCheckOperator, string> = {
      equals: "is",
      not_equals: "is not",
      gt: ">",
      lt: "<",
      lte: "<=",
      gte: ">=",
      contains: "contains",
      not_contains: "does not contain",
    };

    return labels[operator];
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

  private openEntity(entityId: string) {
    handleActionConfig(
      this,
      this.hass,
      {},
      {
        action: "more-info",
        entity: entityId,
      }
    );
  }

  private getValueChecks(): NormalizedValueCheck[] {
    return (this.config.value_checks || [])
      .map((check) => ({
        entity: String(check.entity || "").trim(),
        operator: this.normalizeOperator(check.operator),
        values: this.normalizeList(check.values),
        message: this.normalizeOptionalText(check.message),
        submessage: this.normalizeOptionalText(check.submessage),
      }))
      .filter((check) => check.entity && check.values.length);
  }

  private normalizeOptionalText(value?: string) {
    const normalized = String(value || "").trim();
    return normalized || undefined;
  }

  private normalizeOperator(operator?: string): ValueCheckOperator {
    const operators: ValueCheckOperator[] = ["equals", "not_equals", "gt", "lt", "lte", "gte", "contains", "not_contains"];
    return operators.includes(operator as ValueCheckOperator) ? (operator as ValueCheckOperator) : "equals";
  }

  private getMatchedValue(state: string, check: NormalizedValueCheck) {
    if (check.operator === "not_contains") {
      const normalizedState = state.toLowerCase();
      return check.values.every((value) => !normalizedState.includes(value.toLowerCase())) ? check.values.join(", ") : undefined;
    }

    return check.values.find((value) => this.matchesValue(state, value, check.operator));
  }

  private matchesValue(state: string, value: string, operator: ValueCheckOperator) {
    switch (operator) {
      case "equals":
        return state === value;
      case "not_equals":
        return state !== value;
      case "contains":
        return state.toLowerCase().includes(value.toLowerCase());
      case "gt":
      case "lt":
      case "lte":
      case "gte":
        return this.matchesNumericValue(state, value, operator);
      case "not_contains":
        return false;
    }
  }

  private matchesNumericValue(state: string, value: string, operator: ValueCheckOperator) {
    const stateNumber = Number(state);
    const valueNumber = Number(value);

    if (!Number.isFinite(stateNumber) || !Number.isFinite(valueNumber)) {
      return false;
    }

    switch (operator) {
      case "gt":
        return stateNumber > valueNumber;
      case "lt":
        return stateNumber < valueNumber;
      case "lte":
        return stateNumber <= valueNumber;
      case "gte":
        return stateNumber >= valueNumber;
      default:
        return false;
    }
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

customElements.define("possible-issues-card", PossibleIssuesCard);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "possible-issues-card",
  name: "Possible Issues Card",
  description: "Lists devices with unavailable entities and entities matching configurable value checks",
});
