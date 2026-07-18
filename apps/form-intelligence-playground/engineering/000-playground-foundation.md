# 000 Playground Foundation

## Why This Document Exists

This document records the implementation shape of the Form Intelligence Playground foundation.

## Architecture Summary

The app is organized around four seams:

1. shell UI
2. route pages (module explorers)
3. application state and preferences
4. Form Intelligence integration

This lets future module pages plug into the shell without forcing architectural changes.

## Folder Responsibilities

- `src/app`: composition root
- `src/layouts`: app-wide shell layout
- `src/pages`: routed screens
- `src/components`: reusable UI building blocks
- `src/hooks`: focused React helpers (`useFormSnapshot`, `useEventLog`)
- `src/services`: persistence and environment helpers
- `src/providers`: state ownership for theme and shell UI
- `src/contexts`: React contexts for providers
- `src/routes`: route composition
- `src/styles`: tokens, global styles, and component modules
- `src/lib`: **Form Intelligence integration boundary** (see below)
- `src/config`: `app-metadata.ts` and environment-facing metadata
- `src/constants`, `src/types`, `src/utils`, `src/icons`: shared support code

## Package Integration Boundary

All runtime imports from `@jayoncode/form-intelligence` and `@jayoncode/form-intelligence-react` flow through `src/lib/form-intelligence.ts`.

Responsibilities of that file:

- re-export public APIs used by explorers
- provide `createSampleForm()` with playground defaults
- expose `getFormIntelligentIntegrationSummary()` for dashboard metadata

Route pages must not import workspace packages directly. Type-only imports from package entry points are acceptable.

## Version Metadata

The shell displays live package versions without hard-coding strings in React components.

### Process

1. **`vite.config.ts`** reads versions from monorepo `package.json` files:
   - `packages/form-intelligence`
   - `packages/form-intelligence-react`
   - `apps/form-intelligence-playground`
2. Versions are injected through Vite **`define`**:
   - `__FORM_INTELLIGENT_VERSION__`
   - `__FORM_INTELLIGENT_REACT_VERSION__`
   - `__PLAYGROUND_VERSION__`
3. **`src/config/app-metadata.ts`** maps those constants in `getPlaygroundMetadata().versions`.
4. **`src/vite-env.d.ts`** declares the globals for TypeScript.

### Operational notes

- Renaming packages or moving folders requires updating `readPackageVersion(...)` paths in `vite.config.ts`.
- If a referenced `package.json` is missing, Vite fails to load the config and the dev server will not start.
- After config or package layout changes, restart the dev server (default port `4277`).
- Production `vite build` statically inlines version strings into the bundle.

## Technology Decisions

### React Router

React Router gives the playground a stable nested routing model that can grow into future module pages without rewriting the shell.

### CSS Modules

CSS Modules were chosen over Tailwind because:

- the app needs minimal dependencies
- design tokens remain close to component ownership
- local scoping keeps future module styling predictable

### Context for UI State

Context is enough for the foundation because the state is local to shell behavior:

- theme
- sidebar density
- mobile sidebar state
- recent route activity

Redux would add overhead without solving a current problem.

## Future Expansion Path

The shell is ready to absorb:

- additional module route pages
- Form Intelligence inspectors
- configuration controls
- diagnostics panels
- event explorers
- developer tools

Future work should plug into the existing route and shell structure instead of adding parallel layout systems.
