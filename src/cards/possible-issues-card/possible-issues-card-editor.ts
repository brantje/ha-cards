import { css, html, LitElement, PropertyValues } from "lit";
import { fireEvent, HomeAssistant } from "custom-card-helpers";
import { renderEntityPicker, renderTextField } from "../../shared/base-card";

type RowDetailMode = "none" | "count" | "entities";
type ValueCheckOperator = "equals" | "not_equals" | "gt" | "lt" | "lte" | "gte" | "contains" | "not_contains";
type ListConfigKey =
  | "domains"
  | "issue_states"
  | "ignored_entities"
  | "ignored_devices"
  | "ignored_integrations"
  | "ignored_name_patterns";

type ValueCheckConfig = {
  entity?: string;
  operator?: ValueCheckOperator;
  values?: string[] | string;
  message?: string;
  submessage?: string;
  navigation_path?: string;
};

type PossibleIssuesCardEditorConfig = {
  type?: string;
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

type EntityRegistryEntry = {
  platform?: string | null;
};

const DEFAULT_TITLE = "Possible Issues";
const DEFAULT_DOMAINS = ["sensor", "light", "switch"];
const DEFAULT_ISSUE_STATES = ["unavailable"];
const COMMON_ISSUE_STATES = ["unavailable", "unknown", "none"];
const DEFAULT_ROW_DETAIL: RowDetailMode = "none";
const VALUE_CHECK_OPERATORS: Array<{ value: ValueCheckOperator; label: string }> = [
  { value: "equals", label: "Equals" },
  { value: "not_equals", label: "Does not equal" },
  { value: "gt", label: "Greater than (>)" },
  { value: "lt", label: "Less than (<)" },
  { value: "lte", label: "Less than or equal (<=)" },
  { value: "gte", label: "Greater than or equal (>=)" },
  { value: "contains", label: "Contains" },
  { value: "not_contains", label: "Does not contain" },
];

class PossibleIssuesCardEditor extends LitElement {
  hass?: HomeAssistant;
  config: PossibleIssuesCardEditorConfig = {};
  private integrationOptions: string[] = [];
  private integrationsLoading = false;
  private integrationsVersion = 0;

  static properties = {
    hass: { attribute: false },
    config: { attribute: false },
    integrationsVersion: { state: true },
  };

  connectedCallback() {
    super.connectedCallback();
    this.loadHomeAssistantPickers();
  }

  setConfig(config: PossibleIssuesCardEditorConfig) {
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
          ${this.renderValueChecksField()}
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
    key: ListConfigKey,
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

  private renderValueChecksField() {
    const checks = this.config.value_checks || [];

    return html`
      <div class="field-group">
        <div class="section-header">
          <span>Entity value checks</span>
          <button type="button" @click=${() => this.addValueCheck()}>Add check</button>
        </div>

        ${checks.length
          ? checks.map(
              (check, index) => html`
                <div class="value-check">
                  ${renderEntityPicker({
                    hass: this.hass,
                    label: "Entity",
                    value: String(check.entity || ""),
                    domains: [],
                    onValueChanged: (value) => this.updateValueCheck(index, "entity", value),
                  })}

                  <label>
                    <span>Operator</span>
                    <select
                      .value=${check.operator || "equals"}
                      @change=${(event: Event) =>
                        this.updateValueCheck(
                          index,
                          "operator",
                          (event.target as HTMLSelectElement).value as ValueCheckOperator
                        )}
                    >
                      ${VALUE_CHECK_OPERATORS.map(
                        (operator) => html`
                          <option value=${operator.value} ?selected=${(check.operator || "equals") === operator.value}>
                            ${operator.label}
                          </option>
                        `
                      )}
                    </select>
                  </label>

                  <label>
                    <span>Values</span>
                    <input
                      .value=${this.formatList(check.values, [])}
                      placeholder="error, jammed, offline"
                      @input=${(event: Event) =>
                        this.updateValueCheck(index, "values", this.parseList((event.target as HTMLInputElement).value))}
                    />
                  </label>

                  <label>
                    <span>Message</span>
                    <input
                      .value=${check.message || ""}
                      placeholder="Washing machine issue"
                      @input=${(event: Event) =>
                        this.updateValueCheck(index, "message", (event.target as HTMLInputElement).value)}
                    />
                  </label>

                  <label>
                    <span>Submessage</span>
                    <input
                      .value=${check.submessage || ""}
                      placeholder="Check the machine before starting a new cycle"
                      @input=${(event: Event) =>
                        this.updateValueCheck(index, "submessage", (event.target as HTMLInputElement).value)}
                    />
                  </label>

                  <label>
                    <span>Navigation path</span>
                    <input
                      .value=${check.navigation_path || ""}
                      placeholder="/lovelace/issues"
                      @input=${(event: Event) =>
                        this.updateValueCheck(index, "navigation_path", (event.target as HTMLInputElement).value)}
                    />
                  </label>

                  <button type="button" @click=${() => this.removeValueCheck(index)}>Remove check</button>
                </div>
              `
            )
          : html`<p class="hint">Add checks to show an entity when its state matches one or more configured values.</p>`}
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

  private updateConfigValue(key: keyof PossibleIssuesCardEditorConfig, value: unknown) {
    this.updateConfig({
      ...this.config,
      [key]: value === "" ? undefined : value,
    });
  }

  private updateListValue(key: ListConfigKey, value: string) {
    this.updateConfig({
      ...this.config,
      [key]: this.parseList(value),
    });
  }

  private addValueCheck() {
    this.updateConfig({
      ...this.config,
      value_checks: [...(this.config.value_checks || []), { entity: "", operator: "equals", values: [] }],
    });
  }

  private updateValueCheck(index: number, key: keyof ValueCheckConfig, value: unknown) {
    const checks = [...(this.config.value_checks || [])];
    checks[index] = {
      ...checks[index],
      [key]: value,
    };

    this.updateConfig({
      ...this.config,
      value_checks: checks,
    });
  }

  private removeValueCheck(index: number) {
    this.updateConfig({
      ...this.config,
      value_checks: (this.config.value_checks || []).filter((_, checkIndex) => checkIndex !== index),
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

  private updateConfig(config: PossibleIssuesCardEditorConfig) {
    this.config = config;
    fireEvent(this, "config-changed", { config });
  }

  private async loadHomeAssistantPickers() {
    const loadCardHelpers = (window as any).loadCardHelpers;

    if (customElements.get("ha-entity-picker") || !loadCardHelpers) {
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

    .field {
      display: block;
    }

    ha-entity-picker {
      display: block;
      width: 100%;
    }

    .field-group {
      display: grid;
      gap: 8px;
    }

    .section-header {
      align-items: center;
      display: flex;
      gap: 12px;
      justify-content: space-between;
    }

    .section-header span {
      color: var(--secondary-text-color);
      font-size: 12px;
      font-weight: 500;
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

    .value-check {
      border: 1px solid var(--divider-color, #ddd);
      border-radius: 10px;
      display: grid;
      gap: 8px;
      padding: 10px;
    }

    .hint {
      color: var(--secondary-text-color);
      font-size: 12px;
      margin: 0;
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

customElements.define("possible-issues-card-editor", PossibleIssuesCardEditor);
