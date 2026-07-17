# Form Intelligent — Performance

**Package:** `@jayoncode/form-intelligent`  
**Gates:** `pnpm --filter @jayoncode/form-intelligent check:size`  
**Policy:** ADR-013 (performance budget) — see **Ratcheting** below.

## Tree-shaking — what you import, you pay for

Optional engines (`/devtools`, `/format`, `/plugins`, offline queue implementation) stay out of the login graph **until you import them**. Prefer:

- Main entry for `createForm` + validators + `when`
- Narrow subpaths only when needed ([Entrypoints](/packages/form-intelligent/modules/entrypoints))
- Dynamic `import()` for DevTools in non-production builds

Budgets below measure **entry chunks**, not “all features in one bundle.”

## Bundle budgets

Measured as **entry chunk** gzip (esbuild minify + `splitting: true`) so dynamic `import()` of offline/analytics/object-diff/integrations stays out of the login graph.

| Fixture          | maxGzipKb | Notes                                                                               |
| ---------------- | --------- | ----------------------------------------------------------------------------------- |
| `core-login`     | 24        | `createForm` login graph; forbids DevTools / offline queue class / analytics module |
| `workflow-rules` | 3         | Rules-only subpath                                                                  |
| `format-only`    | 2         | Format subpath                                                                      |

### Ratcheting (ADR-013)

1. Prefer tree-shake / lazy `import()` over raising `maxGzipKb`
2. Re-measure with `pnpm exec tsc -b packages/form-intelligent && pnpm --filter @jayoncode/form-intelligent check:size`
3. Update `scripts/bundle-budgets.json`, this doc, and a changeset with rationale
4. Optional: add `forbid` needles proving optional engines stayed out of the entry chunk

### Phase 18 measurement note (2026-07)

- Node 20 / esbuild budget script
- core-login entry ≈ **22.8 KB** gzip after removing static `workflow` → browser-lifecycle re-export and lazy keyboard/draft modules
- Raised budget **19 → 24** for engines shipped in Phases 1–17 (middleware, presentation, a11y, controllers, …) while keeping forbid list for `/devtools` + offline queue implementation

## Timing budgets (Vitest)

See `tests/performance/performance-budgets.test.ts`.

Budgets catch **order-of-magnitude** regressions. Limits scale by **1.5× locally** and **3× on CI** (`CI` / `GITHUB_ACTIONS`) because shared runners are noisy.

| Workload                         | Base   | Local (×1.5) | CI (×3) |
| -------------------------------- | ------ | ------------ | ------- |
| Validate 50 fields (warm median) | 150 ms | 225 ms       | 450 ms  |
| setValue 50 × 100                | 300 ms | 450 ms       | 900 ms  |
| Undo depth 50                    | 200 ms | 300 ms       | 600 ms  |

## Complexity (Big-O targets)

| Operation               | Target                     |
| ----------------------- | -------------------------- |
| `setValue` (no rules)   | O(1) path + O(L) listeners |
| `setValue` + rules      | O(R + F_affected)          |
| Sync validate one field | O(V_field)                 |
| Validate all            | O(Σ V)                     |
| Async schedule          | O(1) debounce map          |
| Subscribe notify        | O(L)                       |

## Memory

- `form.destroy()` owns teardown (timers, plugins, DOM, history, DevTools unregister)
- Offline **queue data** in `localStorage` survives destroy by design — not a leak (Spec 25)
- Stress: `tests/performance/memory-leak-stress.test.ts`
