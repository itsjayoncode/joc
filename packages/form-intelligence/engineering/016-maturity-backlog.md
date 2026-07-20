# Form Intelligence — Maturity backlog (prioritized)

**Status:** Active  
**Date:** 2026-07-20  
**Strategy:** Stop expanding engines. Mature docs, playground, adapters, and consistency.

## Priority order

| #   | Item                                                                                    | Why now                                                         | Status                                                  |
| --- | --------------------------------------------------------------------------------------- | --------------------------------------------------------------- | ------------------------------------------------------- |
| 1   | **Submission docs** — `submissionGuard()` vs `form.ui.canSubmit` vs `explain("submit")` | Two similar APIs just shipped; users will confuse them          | Done                                                    |
| 2   | **UI Playground** — policy lab (`errorDisplay`, `disableSubmitWhen`) + live explain     | Interactive docs / best demo of `/ui`                           | Done (`/ui`)                                            |
| 3   | **Adapter contract** + Vue/Angular gaps                                                 | Define Field / Submit / ARIA / lifecycle surface; close PARTIAL | Done (`017-adapter-contract`)                           |
| 4   | **Schema → required sync** (ADR + impl)                                                 | Stop schema vs `when().require()` drift                         | Done (`018-schema-required-sync`)                       |
| 5   | **DevTools deepen** — UI projection / explain panels                                    | Incremental on existing `/devtools`, not a rewrite              | Done (`getUiProjection` + playground panels)            |
| 6   | **Plugin author guide**                                                                 | Platform conventions once ownership is documented               | Done (`docs/plugins` + `019-plugin-author-conventions`) |
| 7   | **Yup / Valibot / AJV depth**                                                           | Zod is reference; others thinner                                | Done (`020-schema-adapter-parity`)                      |
| 8   | **On demand only** — rich errors, more hard guards, projection memoization              | Wait for real consumers / measured hotspots                     | Deferred                                                |
| 9   | **HTML constraints Phase 1** — DOM attach → validators (ADR-VAL-002)                    | Semantic HTML as validation source for DOM-backed forms         | Done (Phase 1; min/max/step deferred)                   |

## Explicitly out of scope (for now)

- New engines
- Rebuilding `@jayoncode/form-intelligent*` shims (EOL)
- Inventing guards (`offline`, etc.) without a product case

## Working notes

- Construction ADRs (UI / Submission Guards) stay under `_construction/` (gitignored).
- Public docs live in `packages/form-intelligence/docs/`.
- Playground version bumps with playground UX changes (app `package.json`).
