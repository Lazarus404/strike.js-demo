# Harbor Goods demo for Strike

Multi-page ecommerce SPA that loads **only** Strike distribution files from `vendor/` (no Strike source imports). Source is split under `src/` like a small app.

```bash
node demo/build.mjs
cd demo && python3 -m http.server 8080
# open http://localhost:8080/
```

`build.mjs` clones [strike.js](https://github.com/Lazarus404/strike.js) into a temp directory, runs `npm install` + `node build.mjs` there, copies dist into `vendor/` (core+hooks, UI, jsx-runtime, html, CSS), then bundles `src/app/main.jsx` -> `app.js` (using esbuild from that temp install). Optional: `STRIKE_REF=tag-or-branch node demo/build.mjs`.

Routes: shop, product, cart, checkout, thanks, lab (html templates + hydrate island).
