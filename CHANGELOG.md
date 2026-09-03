# Changelog

All notable changes to this project are documented in this file.

## [0.1.0] - 2026-09-03

### Added

- Harbor Goods ecommerce SPA (hash routes): shop, product, cart, checkout, thanks
- Lab route with Tabs: templates, hydrate, core UI, foundations, structure, overlays, media, DataGrid
- Feature-folder source under `src/` (app, cart, data, pages, lab, styles)
- Coastal-ink look-and-feel (`src/styles/shop.css`, DM Sans); Lab hero, shell panel, control cards
- Demo motion via `strike-fw/transition`: route fade, snackbar host, dialog/alert exits, cart list FLIP
- `build.mjs` syncs Strike / UI / DataGrid from npm by default (`strike-fw@0.2.1`, `strike-fw-ui@0.2.0`, `strike-fw-datagrid@0.1.0`), bundles `app.js`
- Import map includes `strike-fw/transition` (vendor copy for snackbar stack motion)
- `smoke.mjs` vendor-only import checks and shop/cart/lab flow
- `.gitignore` for `app.js`, `vendor/`, and linked sibling packs
- `strike-fw-router@0.1.0` wiring; lab path `/lab/:section?`
- GitHub Pages snapshot via `docs/` + `publish-docs.mjs`; `.githooks/pre-push` refreshes and auto-commits on push
