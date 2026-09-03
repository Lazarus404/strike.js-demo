# strike-fw-router

Client-side router for [Strike](https://www.npmjs.com/package/strike-fw): location adapters, nested routes, `NavLink`, and URL-backed control state.

## Install

```bash
npm install strike-fw strike-fw-router
```

Peer: `strike-fw` >= 0.2.1.

## Quick start

```jsx
import {
  Router,
  Routes,
  Route,
  Outlet,
  NavLink,
  useParams,
  useSearchParam,
  createHashAdapter
} from 'strike-fw-router';

function Shell() {
  return (
    <div>
      <nav>
        <NavLink to="/" end class={on => (on ? 'is-active' : undefined)}>
          Home
        </NavLink>
        <NavLink to="/app">App</NavLink>
      </nav>
      <Outlet />
    </div>
  );
}

function Section() {
  const { section = 'general' } = useParams();
  const [q, setQ] = useSearchParam('q', { defaultValue: '' });
  return (
    <div>
      <p>section: {section}</p>
      <input value={q} onInput={e => setQ(e.target.value || null)} />
    </div>
  );
}

export function App() {
  return (
    <Router adapter={createHashAdapter()}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/app" element={<Shell />}>
          <Route index element={<AppHome />} />
          <Route path=":section?" element={<Section />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
```

Default adapter is **hash** (works on static hosts). Use `createHistoryAdapter({ basename })` when you control path serving. Use `createMemoryAdapter` in tests.

## Search bindings

```js
const [tab, setTab] = useSearchParam('tab', { defaultValue: 'general' });
// Absent key -> defaultValue. Setter null/undefined removes the key.
// Writes default to replace: true (no extra history entries).
```

`useSearchParams()` returns a record and setter (functional updates supported). Multi-value keys: last wins.

## Relative paths

`navigate`, `NavLink`, and `Navigate` resolve relative `to` against the **current route match pathname** (fallback: `location.pathname`).

## Pure helpers

`matchPath`, `matchRoutes`, `compilePattern`, `resolvePath`, `parseSearch`, `stringifySearch` are public for menus and non-component code.

## License

MIT
