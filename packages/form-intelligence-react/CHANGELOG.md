# Changelog

## 2.2.0

### Minor Changes

- 06610ef: Rename Form Intelligence packages from `form-intelligent*` to `form-intelligence*` (core + adapters). Old `@jayoncode/form-intelligent*` packages remain compatibility re-exports so existing installs keep working; prefer the new names for new projects.

## 2.1.0

### Minor Changes

- Expose FormController, fieldController, aria props on field(), and focusFirstInvalid.

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

Initial release of the React adapter for `@jayoncode/form-intelligence`.

### Added

- `useForm()` hook with `form()`, `field()`, and `submit()` binding helpers
- `useFormState()` selector hook for fine-grained re-renders
- StrictMode-safe lifecycle with automatic `destroy()` on unmount
