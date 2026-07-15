# Engineering Note 020 — Configuration Playground

## Scope

Phase 3.13 adds `/configuration` for live Object Diff configuration management.

## Playground changes

- `src/lib/playground-configuration.ts`
- `src/features/configuration/use-configuration-playground.ts`
- `src/pages/ConfigurationPage.tsx`

## Design rules

- Validation uses `validateBrowserLifecycleConfig()` from the package
- Applying configuration restarts the real Object Diff session
- Presets and import/export are playground conveniences, not a parallel config store
