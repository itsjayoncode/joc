# HTML constraint integration (Phase 1)

**Status:** Active  
**Date:** 2026-07-20  
**Related:** ADR-VAL-002 / MVP-VAL-002 (construction), [018-schema-required-sync](./018-schema-required-sync.md)

## Decision

DOM-backed forms (`target` / `form.ref` / `form.form()`) extract Phase 1 HTML constraint attributes **once on attach** into tagged validators. Merge is by kind with **Field > Schema > HTML**. HTML `required` feeds the Presentation required baseline (018). Browser validation stays off (`novalidate`).

## Phase 1 kinds

`required` · `email` · `url` · `minLength` · `maxLength` · `regex`

## Code

| Piece              | Location                                                  |
| ------------------ | --------------------------------------------------------- |
| Kind tags          | `src/validation/validator-kind.ts`                        |
| Merge              | `src/validation/merge-validators-by-kind.ts`              |
| Extract            | `src/dom/extract-html-constraints.ts`                     |
| Attach wire-up     | `src/core/create-form.ts` (`applyHtmlConstraintsFromDom`) |
| Schema/field split | `src/core/resolve-create-form-config.ts`                  |

## Bundle budget (ADR-013)

Extract stays **sync** on attach so `createForm({ target })` / `form.ref` apply constraints before the first validate. That keeps extract on the `core-login` entry chunk (~26.1 KB gzip). Budget raised **26 → 27** KB in `scripts/bundle-budgets.json` + `docs/performance.md`.

## Deferred

`min` / `max` / `step` / `multiple` / temporal types / MutationObserver / `refreshConstraints`.
