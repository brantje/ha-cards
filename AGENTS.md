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

### Don’t

* Don’t duplicate shared logic
* Don’t rely on external frameworks
* Don’t forget to import new cards in `index.ts`
* Don’t break existing card APIs

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
