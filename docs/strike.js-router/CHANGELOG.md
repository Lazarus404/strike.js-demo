# Changelog

## 0.1.0

### Added

- `strike-fw-router`: hash, history, and memory adapters
- Nested `Routes` / `Route` / `Outlet`, `NavLink`, `Navigate`
- Hooks: `useLocation`, `useNavigate`, `useNavigationType`, `useParams`, `useMatch`, `useResolvedPath`, `useSearchParam`, `useSearchParams`, `useDocumentTitle`
- Pure helpers: `matchPath`, `matchRoutes`, `compilePattern`, `resolvePath`, `parseSearch`, `stringifySearch`
- Pack entry ~7kb gzip (soft target was 3-6kb; nested routes + three adapters kept)
