import { LitElement } from "lit";

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
}