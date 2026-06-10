import { css, html, LitElement, PropertyValues, type TemplateResult } from "lit";
import type { AssistPipeline } from "./assist-pipeline";
import type { ActionConfig, HomeAssistant } from "custom-card-helpers";
import "./jinja-code-editor";

type HassLike = {
  states?: Record<string, unknown>;
};

export type EditorActionOption<TAction extends string> = { value: TAction; label: string };

export class BaseCard extends LitElement {
  hass: any;
  config: any;

  static properties = {
    hass: { attribute: false },
    config: { attribute: false },
  };

  setConfig(config: any) {
    this.config = config;
  }

  getEntity() {
    return this.hass?.states?.[this.config?.entity];
  }

  /**
   * Entity ids whose state changes should trigger a re-render.
   * Override in subclasses that depend on more than the primary entity.
   */
  protected getWatchedEntities(): string[] {
    return this.config?.entity ? [this.config.entity] : [];
  }

  shouldUpdate(changedProperties: PropertyValues): boolean {
    if (changedProperties.has("config")) {
      return true;
    }

    if (changedProperties.has("hass")) {
      const oldHass = changedProperties.get("hass") as HassLike | undefined;
      const newHass = this.hass as HassLike | undefined;

      if (!oldHass) {
        return true;
      }

      if (!newHass) {
        return false;
      }

      const watched = this.getWatchedEntities();
      if (watched.length === 0) {
        return false;
      }

      return watched.some((id) => oldHass.states?.[id] !== newHass.states?.[id]);
    }

    return false;
  }

  /**
   * For cards that do not read entity state: re-render on config and declared
   * reactive state, but only treat the first `hass` arrival as significant.
   */
  protected shouldUpdateNonEntityCard(
    changedProperties: PropertyValues,
    extraStateKeys: string[] = []
  ): boolean {
    if (changedProperties.has("config")) {
      return true;
    }

    if (extraStateKeys.some((key) => changedProperties.has(key))) {
      return true;
    }

    if (changedProperties.has("hass")) {
      const oldHass = changedProperties.get("hass") as HassLike | undefined;
      return !oldHass && Boolean(this.hass);
    }

    return false;
  }
}

export function renderEntityPicker(params: {
  hass?: HomeAssistant;
  label: string;
  value: string;
  domains: string[];
  disabled?: boolean;
  onValueChanged: (value: string) => void;
}): TemplateResult {
  const { hass, label, value, domains, disabled = false, onValueChanged } = params;

  if (!domains.length) {
    return html`
      <div class="field">
        <ha-entity-picker
          .hass=${hass}
          .label=${label}
          .value=${value}
          ?disabled=${disabled}
          allow-custom-entity
          @value-changed=${(event: CustomEvent) => onValueChanged(event.detail.value)}
        ></ha-entity-picker>
      </div>
    `;
  }

  return html`
    <div class="field">
      <ha-entity-picker
        .hass=${hass}
        .label=${label}
        .value=${value}
        .includeDomains=${domains}
        ?disabled=${disabled}
        allow-custom-entity
        @value-changed=${(event: CustomEvent) => onValueChanged(event.detail.value)}
      ></ha-entity-picker>
    </div>
  `;
}

export function renderJinjaCodeEditor(params: {
  hass?: HomeAssistant;
  label: string;
  fieldName: string;
  value: string;
  onValueChanged: (value: string) => void;
}): TemplateResult {
  const { hass, label, fieldName, value, onValueChanged } = params;

  return html`
    <ha-cards-jinja-editor
      .hass=${hass}
      .label=${label}
      .fieldName=${fieldName}
      .value=${value}
      @value-changed=${(event: CustomEvent) => onValueChanged(event.detail.value ?? "")}
    ></ha-cards-jinja-editor>
  `;
}

export function renderTemplateSelector(params: {
  hass?: HomeAssistant;
  label: string;
  value: string;
  helper?: string;
  onValueChanged: (value: string) => void;
}): TemplateResult {
  const { hass, label, value, helper, onValueChanged } = params;

  if (!customElements.get("ha-selector-template")) {
    return html`
      <label>
        <span>${label}</span>
        <textarea
          .value=${value}
          rows="3"
          @input=${(event: InputEvent) => onValueChanged((event.target as HTMLTextAreaElement).value)}
        ></textarea>
        ${helper ? html`<span class="hint">${helper}</span>` : ""}
      </label>
    `;
  }

  return html`
    <div class="field template-field">
      <ha-selector-template
        .hass=${hass}
        .selector=${{ preview: true }}
        .value=${value}
        .label=${label}
        .helper=${helper}
        ?required=${false}
        @value-changed=${(event: CustomEvent) => onValueChanged(event.detail.value ?? "")}
      ></ha-selector-template>
    </div>
  `;
}

export function renderTextField(params: {
  label: string;
  value: string;
  placeholder?: string;
  onInput: (value: string) => void;
}): TemplateResult {
  const { label, value, placeholder = "", onInput } = params;

  return html`
    <label>
      <span>${label}</span>
      <input .value=${value} placeholder=${placeholder} @input=${(event: InputEvent) => onInput((event.target as HTMLInputElement).value)} />
    </label>
  `;
}

export function renderIconPicker(params: {
  hass?: HomeAssistant;
  label: string;
  value: string;
  fallback: string;
  onValueChanged: (value: string) => void;
}): TemplateResult {
  const { hass, label, value, fallback, onValueChanged } = params;

  return html`
    <div class="field">
      <ha-icon-picker
        .hass=${hass}
        .label=${label}
        .value=${value || fallback}
        @value-changed=${(event: CustomEvent) => onValueChanged(event.detail.value)}
      ></ha-icon-picker>
    </div>
  `;
}

export function renderActionInput(params: {
  label: string;
  value: string;
  placeholder: string;
  onInput: (value: string) => void;
}): TemplateResult {
  const { label, value, placeholder, onInput } = params;

  return html`
    <label>
      <span>${label}</span>
      <input .value=${value} placeholder=${placeholder} @input=${(event: InputEvent) => onInput((event.target as HTMLInputElement).value)} />
    </label>
  `;
}

export function renderActionFields(params: {
  actionConfig: ActionConfig;
  formatJson: (value: unknown) => string;
  onActionValueChanged: (property: string, value: string) => void;
  onServiceDataChanged: (value: string) => void;
  serviceDataError?: string;
}): TemplateResult | string {
  const { actionConfig, formatJson, onActionValueChanged, onServiceDataChanged, serviceDataError } = params;

  switch (actionConfig.action) {
    case "more-info":
      return renderActionInput({
        label: "Entity override",
        value: String((actionConfig as any).entity || ""),
        placeholder: "Optional entity",
        onInput: (value) => onActionValueChanged("entity", value),
      });
    case "navigate":
      return renderActionInput({
        label: "Navigation path",
        value: String((actionConfig as any).navigation_path || ""),
        placeholder: "/lovelace/0",
        onInput: (value) => onActionValueChanged("navigation_path", value),
      });
    case "url":
      return renderActionInput({
        label: "URL path",
        value: String((actionConfig as any).url_path || ""),
        placeholder: "https://example.com",
        onInput: (value) => onActionValueChanged("url_path", value),
      });
    case "call-service":
      return html`
        ${renderActionInput({
          label: "Service",
          value: String((actionConfig as any).service || ""),
          placeholder: "light.turn_on",
          onInput: (value) => onActionValueChanged("service", value),
        })}
        <label>
          <span>Service data JSON</span>
          <textarea
            .value=${formatJson((actionConfig as any).service_data)}
            placeholder='{"brightness_pct": 50}'
            @change=${(event: Event) => onServiceDataChanged((event.target as HTMLTextAreaElement).value)}
          ></textarea>
        </label>
        ${serviceDataError ? html`<div class="error">${serviceDataError}</div>` : ""}
      `;
    default:
      return "";
  }
}

export function renderActionEditor<TAction extends string>(params: {
  label: string;
  actionConfig: { action: TAction } & ActionConfig;
  actionOptions: EditorActionOption<TAction>[];
  onActionTypeChanged: (action: TAction) => void;
  fields: TemplateResult | string;
  className?: string;
}): TemplateResult {
  const { label, actionConfig, actionOptions, onActionTypeChanged, fields, className } = params;
  const action = actionConfig.action as TAction;

  return html`
    <fieldset class=${className || ""}>
      <legend>${label}</legend>

      <label>
        <span>Action</span>
        <select
          .value=${action}
          @change=${(event: Event) => onActionTypeChanged((event.target as HTMLSelectElement).value as TAction)}
        >
          ${actionOptions.map(
            (option) => html` <option value=${option.value} ?selected=${option.value === action}>${option.label}</option> `
          )}
        </select>
      </label>

      ${fields}
    </fieldset>
  `;
}

export function renderSharedActionEditor<TAction extends string>(params: {
  label: string;
  actionConfig: { action: TAction } & ActionConfig;
  actionOptions: EditorActionOption<TAction>[];
  onActionTypeChanged: (action: TAction) => void;
  onActionValueChanged: (property: string, value: string) => void;
  onServiceDataChanged: (value: string) => void;
  formatJson: (value: unknown) => string;
  serviceDataError?: string;
  className?: string;
}): TemplateResult {
  const {
    label,
    actionConfig,
    actionOptions,
    onActionTypeChanged,
    onActionValueChanged,
    onServiceDataChanged,
    formatJson,
    serviceDataError,
    className,
  } = params;

  return renderActionEditor<TAction>({
    label,
    className,
    actionConfig,
    actionOptions,
    onActionTypeChanged,
    fields: renderActionFields({
      actionConfig,
      formatJson,
      onActionValueChanged,
      onServiceDataChanged,
      serviceDataError,
    }),
  });
}

export function renderCheckbox(params: {
  label: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (checked: boolean) => void;
}): TemplateResult {
  const { label, checked, disabled = false, onChange } = params;

  return html`
    <label class="checkbox">
      <input
        type="checkbox"
        .checked=${checked}
        ?disabled=${disabled}
        @change=${(event: Event) => onChange((event.target as HTMLInputElement).checked)}
      />
      <span>${label}</span>
    </label>
  `;
}

export function renderNumberField(params: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  disabled?: boolean;
  onInput: (value: number) => void;
}): TemplateResult {
  const { label, value, min, max, step = 1, disabled = false, onInput } = params;

  return html`
    <label>
      <span>${label}</span>
      <input
        type="number"
        min=${min}
        max=${max}
        step=${step}
        .value=${String(value)}
        ?disabled=${disabled}
        @input=${(event: InputEvent) => {
          const parsed = clampNumber((event.target as HTMLInputElement).value, value, min, max);
          onInput(parsed);
        }}
      />
    </label>
  `;
}

export function clampNumber(
  raw: string | number,
  fallback: number,
  min: number,
  max: number
): number {
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? Math.min(Math.max(Math.round(parsed), min), max) : fallback;
}

export function toColorInputValue(value: string, fallback: string) {
  return /^#[0-9a-f]{6}$/i.test(value) ? value : fallback;
}

export function renderAssistPipelinePicker(params: {
  hass?: HomeAssistant;
  label: string;
  value: string;
  pipelines: AssistPipeline[];
  loading?: boolean;
  error?: string;
  preferredLabel?: string;
  onChange: (value: string) => void;
}): TemplateResult {
  const {
    hass,
    label,
    value,
    pipelines,
    loading = false,
    error = "",
    preferredLabel = "Preferred pipeline",
    onChange,
  } = params;

  return html`
    <label>
      <span>${label}</span>
      <select
        .value=${value}
        ?disabled=${loading || !hass}
        @change=${(event: Event) => onChange((event.target as HTMLSelectElement).value)}
      >
        <option value="preferred">${preferredLabel}</option>
        ${pipelines.map(
          (pipeline) => html`
            <option value=${pipeline.id} ?selected=${pipeline.id === value}>${pipeline.name}</option>
          `
        )}
      </select>
      ${error ? html`<small>${error}</small>` : ""}
    </label>
  `;
}

export const sharedEditorStyles = css`
  .editor {
    display: grid;
    gap: 16px;
  }

  .grid,
  fieldset {
    display: grid;
    gap: 12px;
  }

  fieldset {
    border: 1px solid var(--divider-color, #ddd);
    border-radius: 12px;
    margin: 0;
    padding: 12px;
  }

  legend {
    color: var(--secondary-text-color);
    font-size: 12px;
    font-weight: 700;
    padding: 0 6px;
  }

  label {
    color: var(--primary-text-color);
    display: grid;
    gap: 6px;
    font-size: 12px;
    font-weight: 600;
  }

  input,
  select,
  textarea {
    background: var(--card-background-color, #fff);
    border: 1px solid var(--divider-color, #ddd);
    border-radius: 10px;
    box-sizing: border-box;
    color: var(--primary-text-color);
    font: inherit;
    min-height: 40px;
    padding: 8px 10px;
  }

  .checkbox {
    align-items: center;
    display: flex;
    flex-direction: row;
    gap: 10px;
  }

  .checkbox input {
    min-height: auto;
    width: auto;
  }

  .hint {
    color: var(--secondary-text-color);
    font-size: 11px;
    font-weight: 400;
    line-height: 1.45;
    margin: 0;
  }
`;
