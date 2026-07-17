---
name: siloguard-design
description: Use this skill to generate well-branded interfaces and assets for SiloGuard, either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping. SiloGuard is a dark-first mobile app for intelligent grain-silo monitoring (CO₂ / temperature / humidity sensors + AI alerts) aimed at Argentine agricultural producers.
user-invocable: true
---

Read the `readme.md` file within this skill, and explore the other available files.

If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. If working on production code, you can copy assets and read the rules here to become an expert in designing with this brand.

If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.

## Quick orientation
- **Brand in one line:** dark-first instrument panel for grain health. Near-black canvas, one agronomic green (`#22C55E`) for brand + "OK", and amber/red/blue strictly for status. Inter throughout. Calm motion, no bounce. Spanish rioplatense (voseo), no emoji.
- **Global CSS:** link `styles.css` (it `@import`s all tokens). Author against the CSS custom properties (`--green`, `--surface`, `--text-muted`, `--radius-md`, `--shadow-md`, `--space-lg`, …) and the `.sg-*` type classes.
- **Components:** load `_ds_bundle.js` and read from `window.SiloGuardDesignSystem_633342` — `Button, Input, Icon (+ ICON_NAMES), StatusBadge, StatusDot, AlertCard, ListItem, NavBar, SensorStat`. Each has a `.prompt.md` next to it with usage.
- **UI kit:** `ui_kits/onboarding-v1/` [DEPRECATED] is an older interactive recreation of the account-creation flow — kept for reference only. The current auth flow lives in `templates/auth/`.
- **Assets:** `assets/logo-mark.svg` (sensor-ring + wordmark mark). Icons live in the `Icon` component.

Full voice, color, type, spacing, iconography and layout rules are in `readme.md`.
