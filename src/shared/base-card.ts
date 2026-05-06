import { LitElement, PropertyValues } from "lit";

type HassLike = {
  states?: Record<string, unknown>;
};

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
