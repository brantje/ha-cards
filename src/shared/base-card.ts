import { html, LitElement, PropertyValues, type TemplateResult } from "lit";
import type { ActionConfig, HomeAssistant } from "custom-card-helpers";

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
