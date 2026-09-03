# Harbor Goods demo for Strike

Multi-page ecommerce SPA on Strike (`strike-fw`, `strike-fw-ui`, `strike-fw-datagrid`, `strike-fw-router`, `strike-fw-store`).

This demo showcases a simple multi-page e-commerce single-page application (SPA) built using the Strike framework and its related UI, data grid, and router packages. It demonstrates common shop flows (browsing products, viewing product details, adding items to the cart, and checking out), as well as a routed tab interface under `/lab`. The project is intended as a reference or starting point for building apps with Strike and the Strike UI packs, highlighting the framework's approach to routing, UI composition, and data handling in a real-world example.

## Live Demo

You can view this demo live, [here](https://www.jah.red/strike.js-demo/)!

## Run locally

```bash
node build.mjs
python3 -m http.server 8080
```

Open http://localhost:8080/

`build.mjs` installs published packs (`strike-fw@0.2.1`, `strike-fw-ui@0.2.0`, `strike-fw-datagrid@0.1.0`, `strike-fw-router@0.1.0`, `strike-fw-store@0.1.0`), writes `vendor/` and local pack copies, and bundles `src/` into `app.js`. Override with `STRIKE_*_LOCAL=1` or `STRIKE_*_NPM` when developing against siblings.

## GitHub Pages (`docs/`)

Snapshot the site into `docs/`:

```bash
node publish-docs.mjs
```

### Pre-push hook

On push, the hook rebuilds `docs/`, commits when it changed (`chore: refresh GitHub Pages build`), then pushes that tip. Enable once per clone:

```bash
./scripts/install-hooks.sh
```

Skip for one push: `SKIP_DOCS_PUBLISH=1 git push` or `git push --no-verify`.

## Routes

Shop, product, cart, checkout, thanks, and lab (`/lab/:section?` for tab IA).
