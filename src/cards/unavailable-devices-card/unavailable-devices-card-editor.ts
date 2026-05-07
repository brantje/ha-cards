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
  ignored_integrations?: string[] | string;
  ignored_name_patterns?: string[] | string;
  row_detail?: RowDetailMode;
};

type EntityRegistryEntry = {
  platform?: string | null;
};

const DEFAULT_TITLE = "Possible Issues";
const DEFAULT_DOMAINS = ["sensor", "light", "switch"];
const DEFAULT_ISSUE_STATES = ["unavailable"];
const COMMON_ISSUE_STATES = ["unavailable", "unknown", "none"];
const DEFAULT_ROW_DETAIL: RowDetailMode = "none";

class UnavailableDevicesCardEditor extends LitElement {
  hass?: HomeAssistant;
  config: UnavailableDevicesCardEditorConfig = {};
  private integrationOptions: string[] = [];
  private integrationsLoading = false;
  private integrationsVersion = 0;

  static properties = {
    hass: { attribute: false },
    config: { attribute: false },
    integrationsVersion: { state: true },
  };

  setConfig(config: UnavailableDevicesCardEditorConfig) {
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
    if (changedProperties.has("config") || changedProperties.has("integrationsVersion")) {
      return true;
    }

    if (changedProperties.has("hass")) {
      const oldHass = changedProperties.get("hass") as HomeAssistant | undefined;
      return !oldHass && Boolean(this.hass);
    }

    return false;
  }

  updated(changedProperties: PropertyValues) {
    if (changedProperties.has("hass")) {
      this.loadIntegrationOptions();
    }
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
          ${this.renderIssueStatesField()}
          ${this.renderListField("Ignored entity IDs or patterns", "ignored_entities", [], "sensor.openweathermap_weather")}
          ${this.renderListField("Ignored device IDs or patterns", "ignored_devices", [], "nuki, 65oled855")}
          ${this.renderIgnoredIntegrationsField()}
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

  private renderIssueStatesField() {
    const selected = this.parseConfigList(this.config.issue_states);
    const selectedSet = new Set(selected);
    const available = COMMON_ISSUE_STATES.filter((state) => !selectedSet.has(state));

    return html`
      <div class="field-group">
        <label>
          <span>Issue states</span>
          <select ?disabled=${available.length === 0} @change=${(event: Event) => this.handleIssueStateSelected(event)}>
            <option value="">${available.length ? "Add state" : "All common states selected"}</option>
            ${available.map((state) => html`<option value=${state}>${state}</option>`)}
          </select>
        </label>

        <div class="custom-row">
          <input
            class="custom-issue-state"
            placeholder="Custom state"
            @keydown=${(event: KeyboardEvent) => this.handleCustomIssueStateKeydown(event)}
          />
          <button type="button" @click=${() => this.addCustomIssueState()}>Add</button>
        </div>

        ${selected.length
          ? html`
              <div class="chips" aria-label="Issue states">
                ${selected.map(
                  (state) => html`
                    <button class="chip" type="button" @click=${() => this.removeIssueState(state)}>
                      ${state}
                      <span aria-hidden="true">x</span>
                    </button>
                  `
                )}
              </div>
            `
          : ""}
      </div>
    `;
  }

  private renderIgnoredIntegrationsField() {
    const selected = this.parseConfigList(this.config.ignored_integrations);
    const selectedSet = new Set(selected);
    const available = this.integrationOptions.filter((integration) => !selectedSet.has(integration));
    const isDisabled = this.integrationsLoading || available.length === 0;

    return html`
      <label>
        <span>Ignored integrations</span>
        <select ?disabled=${isDisabled} @change=${(event: Event) => this.handleIgnoredIntegrationSelected(event)}>
          <option value="">
            ${this.integrationsLoading
              ? "Loading integrations..."
              : available.length
              ? "Add integration"
              : "No integrations available"}
          </option>
          ${available.map((integration) => html`<option value=${integration}>${this.formatIntegrationName(integration)}</option>`)}
        </select>
      </label>
      ${selected.length
        ? html`
            <div class="chips" aria-label="Ignored integrations">
              ${selected.map(
                (integration) => html`
                  <button class="chip" type="button" @click=${() => this.removeIgnoredIntegration(integration)}>
                    ${this.formatIntegrationName(integration)}
                    <span aria-hidden="true">x</span>
                  </button>
                `
              )}
            </div>
          `
        : ""}
    `;
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

  private handleIssueStateSelected(event: Event) {
    const select = event.target as HTMLSelectElement;
    const state = select.value;
    select.value = "";

    if (!state) {
      return;
    }

    this.addIssueState(state);
  }

  private handleCustomIssueStateKeydown(event: KeyboardEvent) {
    if (event.key !== "Enter") {
      return;
    }

    event.preventDefault();
    this.addCustomIssueState(event.target as HTMLInputElement);
  }

  private addCustomIssueState(input?: HTMLInputElement) {
    const customInput = input || this.renderRoot.querySelector<HTMLInputElement>(".custom-issue-state");
    const state = customInput?.value.trim();

    if (!state) {
      return;
    }

    this.addIssueState(state);

    if (customInput) {
      customInput.value = "";
    }
  }

  private addIssueState(state: string) {
    const selected = this.parseConfigList(this.config.issue_states);

    if (selected.includes(state)) {
      return;
    }

    this.updateConfig({
      ...this.config,
      issue_states: [...selected, state],
    });
  }

  private removeIssueState(state: string) {
    this.updateConfig({
      ...this.config,
      issue_states: this.parseConfigList(this.config.issue_states).filter((selected) => selected !== state),
    });
  }

  private handleIgnoredIntegrationSelected(event: Event) {
    const select = event.target as HTMLSelectElement;
    const integration = select.value;
    select.value = "";

    if (!integration) {
      return;
    }

    this.updateConfig({
      ...this.config,
      ignored_integrations: [...this.parseConfigList(this.config.ignored_integrations), integration],
    });
  }

  private removeIgnoredIntegration(integration: string) {
    this.updateConfig({
      ...this.config,
      ignored_integrations: this.parseConfigList(this.config.ignored_integrations).filter(
        (selected) => selected !== integration
      ),
    });
  }

  private parseList(value: string) {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  private parseConfigList(value?: string[] | string) {
    if (value === undefined || value === null || value === "") {
      return [];
    }

    return Array.isArray(value) ? value : this.parseList(String(value));
  }

  private formatList(value: string[] | string | undefined, fallback: string[]) {
    const source = value === undefined || value === null || value === "" ? fallback : value;
    return Array.isArray(source) ? source.join(", ") : String(source);
  }

  private formatIntegrationName(integration: string) {
    return integration
      .split("_")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");
  }

  private updateConfig(config: UnavailableDevicesCardEditorConfig) {
    this.config = config;
    fireEvent(this, "config-changed", { config });
  }

  private async loadIntegrationOptions() {
    if (!this.hass || this.integrationsLoading || this.integrationOptions.length) {
      return;
    }

    this.integrationsLoading = true;
    this.integrationsVersion += 1;

    try {
      const entities = await this.hass.callWS<EntityRegistryEntry[]>({
        type: "config/entity_registry/list",
      });

      this.integrationOptions = [...new Set(entities.map((entry) => entry.platform).filter(Boolean) as string[])].sort();
    } finally {
      this.integrationsLoading = false;
      this.integrationsVersion += 1;
    }
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

    .field-group {
      display: grid;
      gap: 8px;
    }

    label span {
      color: var(--secondary-text-color);
      font-size: 12px;
      font-weight: 500;
    }

    input,
    select,
    button {
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

    button {
      cursor: pointer;
      width: auto;
    }

    button:disabled,
    select:disabled {
      cursor: default;
      opacity: 0.55;
    }

    .custom-row {
      display: grid;
      gap: 8px;
      grid-template-columns: minmax(0, 1fr) auto;
    }

    .chips {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .chip {
      align-items: center;
      background: var(--card-background-color, #fff);
      border: 1px solid var(--divider-color, #ddd);
      border-radius: 999px;
      color: var(--primary-text-color);
      cursor: pointer;
      display: inline-flex;
      font: inherit;
      gap: 8px;
      min-height: 32px;
      padding: 5px 10px;
    }

    .chip span {
      color: var(--secondary-text-color);
      font-size: 13px;
      line-height: 1;
    }
  `;
}

customElements.define("unavailable-devices-card-editor", UnavailableDevicesCardEditor);
