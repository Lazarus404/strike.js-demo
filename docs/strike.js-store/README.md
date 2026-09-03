# strike-fw-store

Platform-agnostic atoms for [Strike](https://www.npmjs.com/package/strike-fw), plus optional request groups under `strike-fw-store/query`.

Requires Node 18+. Hooks target `strike-fw@0.2.1`. Vanilla atoms can be used without Strike, but hook consumers should install the matching peer.

## Install

```bash
npm install strike-fw-store strike-fw@0.2.1
```

Use the main package for atoms, hooks, and binding helpers. Import async query helpers from the `./query` subpath.

## Atoms and hooks

```js
import { atom, computed, batch, useStoreValue, useBindStore, persist } from 'strike-fw-store';

const qty = atom(1);
const price = atom(10);
const total = computed([qty, price], (q, p) => q * p);

batch(() => {
  qty.set(2);
  price.set(12);
});
```

Strike hooks:

```js
const n = useStoreValue(cart, c => c.lines.length);
const { value, onChange } = useBindStore(nameAtom);
```

URL-backed UI chrome still belongs in `strike-fw-router`. Stores hold session, carts, drafts, and private app state.

## Query groups

```js
import { createQueryClient, useQueryGroup } from 'strike-fw-store/query';

const client = createQueryClient();
await client.run('catalog', async ({ signal }) => {
  const r = await fetch('/api/items', { signal });
  return r.json();
}, {
  parse: raw => raw.items,
  onSuccess: rows => products.set(rows)
});
```

Drive presentational Progress from `useQueryGroup(client, 'catalog').pending` and `.progress` (`0..1` or `null` for indeterminate work). Query helpers are only exported from `strike-fw-store/query`.

```js
// App imports Progress from strike-fw-ui; the store pack only exposes pending/progress.
function CatalogProgress() {
  const { pending, progress } = useQueryGroup(client, 'catalog');
  if (!pending) return null;
  return progress == null
    ? h(Progress, { indeterminate: true })
    : h(Progress, { value: progress });
}
```

## Persist and bind

`persist(store, opts)` hydrates once from storage and writes back on changes. `bindStore(store)` gives plain `get` / `set` / `onChange` handlers for non-hook integration, while `useBindStore(store)` returns reactive `{ value, onChange }` props for Strike components.

## License

MIT
