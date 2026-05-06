# AGENTS.md

## 🧭 Purpose

This repository contains a collection of custom Lovelace cards for Home Assistant, bundled into a single ES module for easy distribution and installation.

The goal is to:

* Maintain multiple cards in one repository
* Share common logic and styling
* Output a single bundled file for Home Assistant usage
* Keep development simple and scalable

---

## 🏗️ Architecture Overview

* **Frontend only** (no backend)
* Built using **Lit (Web Components)**
* Bundled with **Vite (library mode)**
* Output: `/dist/my-ha-cards.js`
* Loaded in Home Assistant as a Lovelace resource

---

## 📁 Project Structure

```
src/
  cards/        # Individual Lovelace cards
  shared/       # Shared utilities, base classes, styles
  index.ts      # Entry point (imports all cards)

dist/           # Build output (generated)
```

---

## 🧩 Cards

Each card:

* Lives in `src/cards/`
* Registers itself via `customElements.define`
* Uses kebab-case naming (e.g. `room-card`)
* Is referenced in HA as: `type: custom:room-card`

### Example

```ts
customElements.define("room-card", RoomCard);
```

### Card styling conventions

Use these defaults for custom card visuals unless the user asks for a different design:

* Keep outer `ha-card` corners at `20px`, hide overflow, and avoid default borders.
* Use `12px` inner card padding for compact cards.
* Use compact typography: primary card labels `14px`; secondary sensor/status text `12px`.
* Use compact icon sizing: standard card icons `20px`; sensor/status icons `12px`.


### Room Card conventions

When editing `src/cards/room-card.ts`:

* Treat the configured `entity` as the room light and derive visual state from `hass.states[entity]`.
* Keep `hass` reactive via `BaseCard` so card visuals update after light toggles.
* Override `getWatchedEntities()` to include every entity the card reads (light + sensors). See "Reactivity & rendering" below.
* When the light is off or unavailable, use `#1d1d1d` for the main card background and `mdi:lightbulb-off` for the light button icon.

---

## 🔁 Entry Point

`src/index.ts` is the single entry point for the bundle.

It must import all cards:

```ts
import "./cards/room-card";
```

If a card is not imported here, it will NOT be included in the build.

---

## 🧠 Shared Code

Shared logic goes in `src/shared/`.

Typical contents:

* Base card class (`BaseCard`)
* Helpers (entity formatting, state helpers)
* Shared styles

Avoid duplicating logic across cards.

### Editor UI helper methods (avoid duplication)

To keep card editors consistent and avoid copy/paste drift, common editor render helpers are shared in `src/shared/base-card.ts`.

Use these helpers in editors instead of re-implementing them:

* `renderEntityPicker`
* `renderTextField`
* `renderIconPicker`
* `renderSharedActionEditor`
* `renderActionEditor`
* `renderActionFields`
* `renderActionInput`

When creating or updating an editor (`getConfigElement`), prefer importing these helpers and wiring them to your editor’s `updateConfigValue` / `updateActionValue` handlers.

---

## ⚡ Reactivity & rendering

Home Assistant replaces the entire `hass` object on **every state change for any entity in the system**. If a card treats `hass` as a plain Lit reactive property without filtering, it will re-render on every state tick — frequently dozens of times per second — even when none of the entities it shows have changed. With multiple cards on a dashboard this caused severe browser lag.

### Rules for cards

* Always extend `BaseCard`. It implements a `shouldUpdate` that:
  * Re-renders on every `config` change.
  * On `hass` changes, re-renders only when one of the entity ids returned by `getWatchedEntities()` actually changed (reference equality on the per-entity state object — that's what HA replaces).
* **Override `getWatchedEntities()`** in any card that reads more than `config.entity`. List every entity id the render path depends on (primary entity + each sensor/secondary entity). The default returns `[config.entity]`, which is wrong for cards that also display sensors.
* Don't add ad-hoc reactive properties for derived state — derive it inside `render()` so `shouldUpdate` stays the single source of truth for re-render decisions.

### Rules for editors (`getConfigElement`)

* Editors are plain `LitElement`s, not `BaseCard`, so they need their own `shouldUpdate`.
* Re-render on `config` changes and on the **first** `hass` arrival only. Don't re-render on subsequent `hass` swaps — `ha-entity-picker` / `ha-icon-picker` manage their own internal state, and forwarding a fresh `hass` on every state tick forces them to re-derive a list of every entity in HA, which is the main cause of editor lag.
* When you add new pickers or fields to an editor, you do **not** need to widen the `shouldUpdate` — `config` changes already trigger a render with the latest `this.hass` forwarded to children.

### Symptoms to watch for

If the dashboard or "Edit card" dialog feels sluggish, profile re-renders before changing visuals. Common regressions:

* A card reads `hass.states[some_id]` but `some_id` isn't in `getWatchedEntities()` → stale UI.
* A card adds a new sensor field but forgets to extend `getWatchedEntities()` → stale UI.
* An editor's `shouldUpdate` is removed or widened to always re-render on `hass` → entity-picker lag returns.

---

## ⚙️ Build System

We use Vite in **library mode**.

### Build command

```
npm run build
```

### Output

```
dist/ha-cards.js
```

### Requirements

* Output must be ES module (`format: "es"`)
* No HTML entry point
* No framework-specific runtime (React/Vue not used)

---

## 🧪 Development

### Watch mode

```
npm run dev
```

This rebuilds on file changes.

### Optional: external dev server

You can load the dev bundle directly in Home Assistant:

```
http://<dev-server>:5173/src/index.ts
```

Ensure CORS is enabled.

---

## 🏠 Home Assistant Integration

### Resource config

```yaml
url: /local/ha-cards.js
type: module
```

### Example usage

```yaml
type: custom:room-card
entity: light.living_room
name: Living room
```

---

## 🌍 External Hosting (Optional)

Cards can be hosted externally:

```yaml
url: https://example.com/ha-cards.js
type: module
```

Requirements:

* HTTPS
* CORS headers (`Access-Control-Allow-Origin: *`)
* Cache busting (query params or hashed filenames)

---

## 📦 HACS Compatibility (Future)

To support HACS:

* Include built file in repo or release
* Add `hacs.json`
* Keep single bundle output
* Use semantic versioning

---

## ⚠️ Guidelines

### Do

* Keep cards small and focused
* Reuse shared utilities
* Use HA CSS variables for styling
* Validate config in `setConfig`
* Override `getWatchedEntities()` whenever a card reads more than `config.entity` (see "Reactivity & rendering")

### Don’t

* Don’t duplicate shared logic
* Don’t rely on external frameworks
* Don’t forget to import new cards in `index.ts`
* Don’t break existing card APIs
* Don’t let cards or editors re-render on every `hass` update — that's what made the browser lag

---

## 🐛 Debugging

* Use browser dev tools
* Check console errors
* Log `this.hass` and `this.config`
* Ensure entity IDs exist

---

## 🚀 Future Improvements

* Type definitions for Home Assistant
* Config editor UI (`getConfigElement`)
* Theming support
* Advanced cards (graphs, controls, dashboards)

---

## 🤝 Contributing

When adding a new card:

1. Create file in `src/cards/`
2. Register with `customElements.define`
3. Import it in `src/index.ts`
4. Rebuild and test in Home Assistant

---

## 📌 Notes

This project intentionally avoids backend dependencies and focuses purely on frontend extensibility within Home Assistant.

---
