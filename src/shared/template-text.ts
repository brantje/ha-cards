import { css, html, LitElement, PropertyValues } from "lit";
import type { HomeAssistant } from "custom-card-helpers";

type RenderTemplateResult = {
  result: string | Record<string, unknown>;
};

type RenderTemplateError = {
  error: string;
  level?: "ERROR" | "WARNING";
};

type ValueCheckOperator = "equals" | "not_equals" | "gt" | "lt" | "lte" | "gte" | "contains" | "not_contains";

export type ValueCheckTemplateContext = {
  check: {
    entity: string;
    operator: ValueCheckOperator;
    values: string[];
  };
  entity: {
    state: string;
    attributes: Record<string, unknown>;
  };
  matchedValue: string;
};

const OPERATOR_LABELS: Record<ValueCheckOperator, string> = {
  equals: "is",
  not_equals: "is not",
  gt: ">",
  lt: "<",
  lte: "<=",
  gte: ">=",
  contains: "contains",
  not_contains: "does not contain",
};

export function buildValueCheckTemplateVariables(
  issue: ValueCheckTemplateContext,
  getEntityName: (entityId: string, entity: ValueCheckTemplateContext["entity"]) => string
) {
  const matchedValue =
    issue.check.operator === "not_contains"
      ? issue.check.values.join(", ")
      : issue.matchedValue || issue.check.values.join(", ");
  const unitOfMeasurement = String(issue.entity.attributes?.unit_of_measurement || "");

  return {
    entity: issue.check.entity,
    entity_id: issue.check.entity,
    name: getEntityName(issue.check.entity, issue.entity),
    state: issue.entity.state,
    matched: matchedValue,
    matched_value: matchedValue,
    operator: issue.check.operator,
    operator_label: OPERATOR_LABELS[issue.check.operator],
    unit: unitOfMeasurement,
    unit_of_measurement: unitOfMeasurement,
    values: issue.check.values.join(", "),
    attributes: issue.entity.attributes,
  };
}

class HaCardsTemplateText extends LitElement {
  hass?: HomeAssistant;
  template = "";
  variables: Record<string, unknown> = {};
  entityIds: string[] = [];
  fallback = "";

  private _rendered = "";
  private _unsubRenderTemplate?: Promise<(() => void) | undefined>;

  static properties = {
    hass: { attribute: false },
    template: { type: String },
    variables: { attribute: false },
    entityIds: { attribute: false },
    fallback: { type: String },
  };

  connectedCallback() {
    super.connectedCallback();
    this._subscribeTemplate();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    void this._unsubscribeTemplate();
  }

  protected updated(changedProperties: PropertyValues) {
    if (
      changedProperties.has("template") ||
      changedProperties.has("variables") ||
      changedProperties.has("entityIds") ||
      changedProperties.has("hass")
    ) {
      this._subscribeTemplate();
    }
  }

  render() {
    return html`<span>${this._rendered || this.fallback}</span>`;
  }

  private _formatResult(result: RenderTemplateResult["result"]) {
    if (typeof result === "object") {
      try {
        return JSON.stringify(result);
      } catch {
        return this.fallback;
      }
    }

    return String(result ?? "");
  }

  private async _subscribeTemplate() {
    await this._unsubscribeTemplate();

    if (!this.hass?.connection || !this.template) {
      this._rendered = "";
      return;
    }

    try {
      this._unsubRenderTemplate = this.hass.connection.subscribeMessage(
        (message: RenderTemplateResult | RenderTemplateError) => {
          if ("error" in message) {
            this._rendered = this.fallback;
          } else {
            this._rendered = this._formatResult(message.result);
          }
          this.requestUpdate();
        },
        {
          type: "render_template",
          template: this.template,
          variables: this.variables,
          entity_ids: this.entityIds.length ? this.entityIds : undefined,
          report_errors: true,
        }
      );
      await this._unsubRenderTemplate;
    } catch {
      this._rendered = this.fallback;
      this._unsubRenderTemplate = undefined;
      this.requestUpdate();
    }
  }

  private async _unsubscribeTemplate() {
    if (!this._unsubRenderTemplate) {
      return;
    }

    try {
      const unsub = await this._unsubRenderTemplate;
      unsub?.();
    } catch (error: unknown) {
      if ((error as { code?: string })?.code !== "not_found") {
        throw error;
      }
    } finally {
      this._unsubRenderTemplate = undefined;
    }
  }

  static styles = css`
    :host {
      display: inline;
    }
  `;
}

customElements.define("ha-cards-template-text", HaCardsTemplateText);
