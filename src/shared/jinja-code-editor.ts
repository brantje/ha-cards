import { css, html, LitElement } from "lit";
import type { HomeAssistant } from "custom-card-helpers";

type HaFormSchema = {
  name: string;
  selector: { template: Record<string, never> };
  required?: boolean;
};

class HaCardsJinjaEditor extends LitElement {
  hass?: HomeAssistant;
  label = "";
  fieldName = "template";
  value = "";

  static properties = {
    hass: { attribute: false },
    label: { type: String },
    fieldName: { type: String },
    value: { type: String },
  };

  render() {
    if (this.hass && customElements.get("ha-form")) {
      return html`
        <ha-form
          class="template-form"
          .hass=${this.hass}
          .data=${{ [this.fieldName]: this.value }}
          .schema=${this._schema}
          .computeLabel=${this._computeLabel}
          @value-changed=${this._handleFormChange}
        ></ha-form>
      `;
    }

    if (customElements.get("ha-selector-template") && this.hass) {
      return html`
        <div class="template-field">
          <ha-selector-template
            .hass=${this.hass}
            .selector=${{ template: {} }}
            .value=${this.value}
            .label=${this.label}
            ?required=${false}
            @value-changed=${this._handleSelectorChange}
          ></ha-selector-template>
        </div>
      `;
    }

    return html`
      <label>
        <span>${this.label}</span>
        <textarea
          .value=${this.value}
          rows="4"
          placeholder="{{ ... }}"
          @input=${(event: InputEvent) => this._emitValueChanged((event.target as HTMLTextAreaElement).value)}
        ></textarea>
      </label>
    `;
  }

  private get _schema(): HaFormSchema[] {
    return [{ name: this.fieldName, selector: { template: {} }, required: false }];
  }

  private _computeLabel = (schema: HaFormSchema) => {
    return schema.name === this.fieldName ? this.label : schema.name;
  };

  private _emitValueChanged(value: string) {
    this.dispatchEvent(
      new CustomEvent("value-changed", {
        detail: { value },
        bubbles: true,
        composed: true,
      })
    );
  }

  private _handleFormChange(event: CustomEvent) {
    event.stopPropagation();
    const data = event.detail.value as Record<string, string | undefined>;
    this._emitValueChanged(data[this.fieldName] ?? "");
  }

  private _handleSelectorChange(event: CustomEvent) {
    event.stopPropagation();
    this._emitValueChanged(event.detail.value ?? "");
  }

  static styles = css`
    :host {
      display: block;
    }

    ha-form,
    ha-selector-template {
      display: block;
      width: 100%;
    }

    label {
      display: grid;
      gap: 6px;
    }

    label span {
      color: var(--secondary-text-color);
      font-size: 12px;
      font-weight: 500;
    }
  `;
}

customElements.define("ha-cards-jinja-editor", HaCardsJinjaEditor);
