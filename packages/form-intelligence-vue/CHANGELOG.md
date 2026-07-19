# Changelog

## 2.2.0

### Minor Changes

- 9223e6d: Add derived UI projection (`/ui`) and submission hard guards (`submissionGuard()` enforced in `submit()`). React/Vue/Angular/DOM adapters use `form.ui.canSubmit` / `showError` / `status` for button and field UX. Raise `core-login` entry-chunk gzip budget 24→26 KB (ADR-013) for the always-on projection graph. Remove `@jayoncode/form-intelligent*` compatibility packages from the monorepo (EOL — migrate to `form-intelligence*`).

## 2.1.0

### Minor Changes

- 06610ef: Rename Form Intelligence packages from `form-intelligent*` to `form-intelligence*` (core + adapters). Old `@jayoncode/form-intelligent*` packages remain compatibility re-exports so existing installs keep working; prefer the new names for new projects.

## 2.0.0

### Patch Changes

- Updated dependencies
  - @jayoncode/form-intelligent@3.1.0

## 1.0.0

### Patch Changes

- Updated dependencies
- Updated dependencies
  - @jayoncode/form-intelligent@3.0.0

## 0.1.0

Initial release of the Vue adapter for `@jayoncode/form-intelligence`.

### Added

- `useForm()`, `useFormState()`, `useField()`, and `provideForm()` composables
- Reactive `form.state` ref with automatic destroy on scope dispose
