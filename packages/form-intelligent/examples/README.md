# Form Intelligent examples

Runnable demos for `@jayoncode/form-intelligent`. Interactive UI lives in
[`apps/form-intelligent-playground`](../../apps/form-intelligent-playground).

## Minimum (0.1.x)

| File                                           | What it shows                                      |
| ---------------------------------------------- | -------------------------------------------------- |
| [`vanilla-html.ts`](./vanilla-html.ts)         | Native `<form>` + `createForm({ target, schema })` |
| [`basic-validation.ts`](./basic-validation.ts) | Headless validators + `submit()`                   |
| [`wizard-workflow.ts`](./wizard-workflow.ts)   | Wizard steps, autosave, draft key                  |

### Verify

```bash
# Typecheck the core examples
pnpm --filter @jayoncode/form-intelligent typecheck:examples

# Smoke-run them (vitest + jsdom)
pnpm -w exec vitest run packages/form-intelligent/tests/integration/examples-smoke.test.ts
```

Each file exports a `run*Example()` function you can import from app code or tests.

## Framework adapters

| File                                     | Package                               |
| ---------------------------------------- | ------------------------------------- |
| [`react-basic.tsx`](./react-basic.tsx)   | `@jayoncode/form-intelligent-react`   |
| [`vue-basic.ts`](./vue-basic.ts)         | `@jayoncode/form-intelligent-vue`     |
| [`angular-basic.ts`](./angular-basic.ts) | `@jayoncode/form-intelligent-angular` |

These are **compile-checked illustrations**, not standalone apps. Open the playground for a live shell.

## Planned (stubs)

| File                   | Status                                     |
| ---------------------- | ------------------------------------------ |
| `svelte-basic.ts`      | Awaiting Svelte adapter (Phase 5.4)        |
| `nextjs-wizard.tsx`    | Docs recipe TBD                            |
| `electron-autosave.ts` | Docs recipe TBD                            |
| `rhf-bridge.tsx`       | Awaiting `@jayoncode/form-intelligent-rhf` |

## Docs

- [Getting started](../docs/getting-started.md)
- [Patterns](../docs/patterns.md)
- [Migration](../docs/migration.md)
