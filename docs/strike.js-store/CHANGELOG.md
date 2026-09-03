# Changelog

## 0.1.0

### Added

- `atom`, `computed`, `batch`, `map`, `persist`, `bindStore`, `shallow`
- Hooks: `useStoreValue`, `useStoreSet`, `useBindStore`
- `strike-fw-store/query`: `createQueryClient`, `useQueryGroup`
- Targets Node `>=18`; peer `strike-fw@0.2.1`; tests with `linkedom@^0.18.0`
- Main package exports stores and hooks; query helpers stay on the `./query` subpath
