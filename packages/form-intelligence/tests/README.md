# Form Intelligence — Test Strategy

Test layout for `@jayoncode/form-intelligence` (Spec [29](../../../_construction/form-intelligent/29_TESTING_STRATEGY.md)):

```
tests/
  unit/            # Engines, validators, utils, plugins, adapters
  integration/     # Submit, wizard, autosave, edge flows
  contracts/       # Shared adapter contract helpers (+ meta tests)
  ssr/             # Node import smoke (no window/document)
  stress/          # Create/destroy + rapid setValue
  performance/     # Timing budgets + leak stress
  accessibility/   # DOM error announcement / ARIA patterns
  browser/         # Native HTML enhancer smoke (jsdom)
```

## Pyramid

```
        E2E / playground (optional; no Playwright in-repo yet)
      integration (createForm flows)
    contract (Schema / Persistence / subscribe)
  unit (engines, validators, utils)
+ ssr + stress + performance
```

## How tests run

Root `pnpm test` uses `vitest.config.ts` projects:

| Project | Environment | Includes                                         |
| ------- | ----------- | ------------------------------------------------ |
| node    | `node`      | `**/*.{test,spec}.{ts,tsx}` except `*.browser.*` |
| browser | `jsdom`     | `**/*.browser.{test,spec}.{ts,tsx}`              |

Package scripts:

```bash
pnpm --filter @jayoncode/form-intelligence test
pnpm --filter @jayoncode/form-intelligence test:ssr
pnpm --filter @jayoncode/form-intelligence test:coverage
pnpm --filter @jayoncode/form-intelligence check:size   # after tsc -b
```

Coverage: `pnpm test:coverage` (v8). CI quality gate includes coverage via `ci:quality` / `.github/workflows/quality.yml`. Target: **90%+ lines on core engines** (aspirational).

## Categories

| Category      | What to cover                                                              |
| ------------- | -------------------------------------------------------------------------- |
| Unit          | Each engine (validation, state, submission, workflow, format, plugins)     |
| Integration   | Submit lifecycle, wizard steps, autosave / draft                           |
| Contract      | `tests/contracts/` — SchemaAdapter, PersistenceAdapter, subscribe/snapshot |
| SSR           | `tests/ssr/` — `createForm` in Node without DOM                            |
| Stress        | 1000× create/destroy; 200 fields rapid setValue                            |
| Accessibility | `role="alert"`, `aria-invalid`, `aria-describedby` on native HTML          |
| Performance   | Timing budgets + create/destroy leak stress (`tests/performance/`)         |
| Browser       | DOM discovery + submit enhancement                                         |
| Edge cases    | Empty form, nested arrays, rapid typing                                    |
| E2E           | Playground Vitest/jsdom; Playwright **deferred** (optional Phase later)    |

## Shared contracts (adapter packages)

```ts
import { runSchemaAdapterContract } from "../../form-intelligence/tests/contracts/schema-adapter.contract.js";

await runSchemaAdapterContract({
  name: "zod",
  adapter: zodAdapter(schema),
  validValues: { email: "a@b.com" },
  invalidValues: { email: "bad" },
  expectedInvalidPath: "email",
});
```

Also: `runPersistenceAdapterContract`, `runFrameworkSubscribeContract`.

## Timers

Prefer Vitest fake timers for debounce/autosave. Avoid real wall-clock sleeps in unit tests.

## Adding tests

- Prefer colocating engine tests under `unit/`
- Multi-engine flows → `integration/`
- DOM / ARIA → `accessibility/` or `browser/` (`*.browser.test.ts`)
- Keep imports relative to `src/` (`../../src/...` from nested folders)
- New adapter packages should import contract helpers rather than duplicating fixtures
