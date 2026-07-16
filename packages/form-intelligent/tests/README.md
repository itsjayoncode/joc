# Form Intelligent — Test Strategy

Test layout for `@jayoncode/form-intelligent`:

```
tests/
  unit/            # Engines, validators, utils, plugins, adapters
  integration/     # Submit, wizard, autosave, edge flows
  performance/     # Benchmarks (e.g. 50-field validation)
  accessibility/   # DOM error announcement / ARIA patterns
  browser/         # Native HTML enhancer smoke (jsdom)
```

## How tests run

Root `pnpm test` uses `vitest.config.ts` projects:

| Project | Environment | Includes                                         |
| ------- | ----------- | ------------------------------------------------ |
| node    | `node`      | `**/*.{test,spec}.{ts,tsx}` except `*.browser.*` |
| browser | `jsdom`     | `**/*.browser.{test,spec}.{ts,tsx}`              |

Package scripts:

```bash
pnpm --filter @jayoncode/form-intelligent test
pnpm --filter @jayoncode/form-intelligent test:coverage
```

Coverage: `pnpm test:coverage` (v8). CI quality gate includes coverage via `ci:quality`. Target: **90%+ lines on core engines** (tracked via package `test:coverage`).

## Categories

| Category      | What to cover                                                          |
| ------------- | ---------------------------------------------------------------------- |
| Unit          | Each engine (validation, state, submission, workflow, format, plugins) |
| Integration   | Submit lifecycle, wizard steps, autosave / draft                       |
| Accessibility | `role="alert"`, `aria-invalid`, `aria-describedby` on native HTML      |
| Performance   | 50-field validate stays under budget                                   |
| Browser       | DOM discovery + submit enhancement                                     |
| Edge cases    | Empty form, nested arrays, rapid typing                                |

## Adding tests

- Prefer colocating engine tests under `unit/`
- Multi-engine flows → `integration/`
- DOM / ARIA → `accessibility/` or `browser/` (`*.browser.test.ts`)
- Keep imports relative to `src/` (`../../src/...` from nested folders)
