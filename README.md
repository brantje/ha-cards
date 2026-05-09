# HA Cards (Lovelace)

[![Open your Home Assistant instance and open a repository inside the Home Assistant Community Store.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=brantje&repository=https%3A%2F%2Fgithub.com%2Fbrantje%2Fha-cards&category=Lovelace)

A small collection of **custom Lovelace cards** built with **Lit** and bundled into a single module: `ha-cards.js`.

## Installation

### HACS (recommended)

1. Add this repository to HACS (click the button above).
2. Install it as a **Lovelace** repository.
3. Add the resource in Home Assistant:

```yaml
url: /hacsfiles/ha-cards/ha-cards.js
type: module
```

### Manual

1. Download/copy `dist/ha-cards.js` to your Home Assistant `config/www/` folder (so it becomes `/local/ha-cards.js`).
2. Add the resource:

```yaml
url: /local/ha-cards.js
type: module
```

## Cards

### `welcome-card`
![welcome-card example](./images/welcome-card.png)

Greeting card with a **date/weather pill**, optional **temperature**, a **settings** button, and configurable **quick tabs**.

**Config**

- **`type`**: `custom:welcome-card`
- **`weather_entity`** (optional): Weather entity (domain `weather.*`) used for icon/emoji and (by default) temperature.
- **`show_temperature`** (optional, default `true`): Show temperature on the date pill.
- **`use_ha_weather_icons`** (optional, default `false`): Use HA MDI weather icons instead of emoji.
- **`temperature_entity`** (optional): Override temperature sensor (domain `sensor.*`) used when `show_temperature` is enabled.
- **`settings_navigation_path`** (optional, default `/config/dashboard`): Navigation path for the settings button.
- **`tabs`** (optional): Array of tabs with:
  - **`icon`**: MDI icon
  - **`label`**: Tab label
  - **`color`** (optional): Accent color
  - **`tap_action`** (optional): Home Assistant action config (e.g. `navigate`, `more-info`, `call-service`, etc.)

**Example**


```yaml
type: custom:welcome-card
weather_entity: weather.home
show_temperature: true
use_ha_weather_icons: false
settings_navigation_path: /config/dashboard
tabs:
  - icon: mdi:home
    label: Home
    color: "#86a9f8"
    tap_action:
      action: navigate
      navigation_path: /lovelace/home
  - icon: mdi:lightbulb
    label: Lights
    color: "#ffd34c"
    tap_action:
      action: navigate
      navigation_path: /lovelace/lights
```

---

### `room-card`
![room-card example](./images/room-card.png)

Room tile for a **light** with a prominent **light action button** and up to **two sensor readouts**.

**Config**

- **`type`**: `custom:room-card`
- **`entity`**: Required light entity (`light.*`)
- **`name`** (optional): Display name (falls back to the light friendly name)
- **`icon`** (optional, default `mdi:sofa`): Room icon
- **`sensor1_entity`** / **`sensor2_entity`** (optional): Sensor entities (`sensor.*`)
- **`sensor1_icon`** / **`sensor2_icon`** (optional): Sensor icons (defaults: `mdi:thermometer`, `mdi:water-percent`)
- **`tap_action`** (optional, default `more-info`): Card tap action
- **`light_tap_action`** (optional, default `toggle`): Short press on the light button
- **`light_hold_action`** (optional, default `more-info`): Long press on the light button (500ms)

**Example**

```yaml
type: custom:room-card
entity: light.living_room
name: Living room
icon: mdi:sofa
sensor1_entity: sensor.living_room_temperature
sensor1_icon: mdi:thermometer
sensor2_entity: sensor.living_room_humidity
sensor2_icon: mdi:water-percent
tap_action:
  action: more-info
light_tap_action:
  action: toggle
light_hold_action:
  action: more-info
```

---

### `possible-issues-card`
![possible-issues-card example](./images/unavailable-devices-card.png)
Lists **devices** that have **entities in “issue” states** (defaults to `unavailable`) and **entities** that match custom value checks. Useful for quickly spotting flaky devices/integrations and known problem states.

Clicking a device row navigates to the device page in Home Assistant. Clicking an entity value-check row opens more info for that entity.

**Config**

- **`type`**: `custom:possible-issues-card`
- **`title`** (optional, default `Possible Issues`): Card title
- **`domains`** (optional, default `["sensor","light","switch"]`): Domains to consider (array or comma-separated string)
- **`issue_states`** (optional, default `["unavailable"]`): Entity states considered problematic (array or comma-separated string)
- **`value_checks`** (optional): List of entity state checks. Each item supports:
  - **`entity`**: Entity ID to check
  - **`operator`**: `equals` | `gt` | `lt` | `lte` | `gte` | `contains` | `not_contains`
  - **`values`**: One or more values (array or comma-separated string). Operators match if any value matches, except `not_contains`, which matches only when none of the values are contained.
- **`ignored_entities`** (optional): Entity IDs or substrings to ignore (array or comma-separated string)
- **`ignored_devices`** (optional): Device IDs or substrings to ignore (array or comma-separated string)
- **`ignored_integrations`** (optional): Integration/platform identifiers to ignore (array or comma-separated string)
- **`ignored_name_patterns`** (optional): Substrings matched against device/entity names to ignore
- **`row_detail`** (optional, default `none`): `none` | `count` | `entities`
  - `none`: show only device name
  - `count`: show affected entity count
  - `entities`: show affected entity names

**Example**

```yaml
type: custom:possible-issues-card
title: Possible Issues
domains: sensor, light, switch
issue_states: unavailable, unknown
value_checks:
  - entity: sensor.washing_machine_status
    operator: contains
    values:
      - error
      - jammed
  - entity: sensor.freezer_temperature
    operator: gt
    values: "-12"
ignored_integrations: openweathermap, hue
ignored_name_patterns: Test device, Printer
row_detail: count
```

## Development

```bash
npm install
npm run dev
```

Build output:

- `dist/ha-cards.js`

