# Changelog

All notable changes to this project are documented in this file.

## [0.1.0] - 2026-09-02

### Added

- Harbor Goods ecommerce SPA (hash routes): shop, product, cart, checkout, thanks
- Lab route: `html` templates, hydrate island, Strike UI control playground
- Feature-folder source under `src/` (app, cart, data, pages, lab, styles)
- Coastal-ink look-and-feel (`src/styles/shop.css`, DM Sans)
- `build.mjs` clones [strike.js](https://github.com/Lazarus404/strike.js) into a temp dir, builds dist, syncs `vendor/`, bundles `app.js`
- `smoke.mjs` vendor-only import checks and shop/cart/lab flow
- `.gitignore` for `app.js` and `vendor/`
