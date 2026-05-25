type ConfigElementCard = {
  getConfigElement?: () => Promise<unknown>;
};

export async function loadHaEditorComponents(): Promise<boolean> {
  if (customElements.get("ha-form") && customElements.get("ha-entity-picker")) {
    return true;
  }

  let loaded = false;

  if (!customElements.get("ha-form")) {
    loaded = (await loadCardConfigElement("hui-tile-card", {
      type: "tile",
      entity: "sun.sun",
    })) || loaded;
  }

  if (!customElements.get("ha-entity-picker")) {
    loaded =
      (await loadCardConfigElement("hui-entities-card", {
        type: "entities",
        entities: [],
      })) || loaded;
  }

  return loaded || Boolean(customElements.get("ha-form"));
}

async function loadCardConfigElement(
  tagName: string,
  config: Record<string, unknown>
): Promise<boolean> {
  let cardClass = customElements.get(tagName) as ConfigElementCard | undefined;

  if (typeof cardClass?.getConfigElement !== "function") {
    const loadCardHelpers = window.loadCardHelpers;
    if (!loadCardHelpers) {
      return false;
    }

    try {
      const helpers = await loadCardHelpers();
      await helpers.createCardElement(config);
      cardClass = customElements.get(tagName) as ConfigElementCard | undefined;
    } catch {
      return false;
    }
  }

  if (typeof cardClass?.getConfigElement === "function") {
    await cardClass.getConfigElement();
    return true;
  }

  return false;
}
