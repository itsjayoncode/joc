# Plugin author conventions

**Status:** Active  
**Date:** 2026-07-20  
**Audience:** Maintainers + authors of reusable Form Intelligence plugins  
**User docs:** [docs/plugins.md — Plugin author guide](../docs/plugins.md#plugin-author-guide)  
**Related:** [016-maturity-backlog](./016-maturity-backlog.md), [017-adapter-contract](./017-adapter-contract.md), UI ownership (Presentation / `/ui`)

## Goal

Keep extensions **additive**: observe, cancel, or integrate — without forking engines or inventing parallel ownership for `fieldUi`, validation, or submit eligibility.

## Extension map

| Concern                                                            | Owner                                       | Plugin role                                                                      |
| ------------------------------------------------------------------ | ------------------------------------------- | -------------------------------------------------------------------------------- |
| Validation errors                                                  | Validation                                  | Observe / cancel via hooks; do not write `errors` maps ad hoc                    |
| UI intent (`visible` / `disabled` / `required` / `submitDisabled`) | Workflow → Presentation                     | Read via `getPresentation` / `field.ui`; drive via `when()`, not direct mutation |
| Soft button UX                                                     | `/ui` projection                            | Use or mirror `ui()` policies; compose `canSubmit` / `explain` — do not redefine |
| Hard submit start                                                  | `submissionGuard()`                         | Optional `beforeSubmit` cancel; do not invent a second hard API                  |
| Framework bind / ARIA                                              | Adapters ([017](./017-adapter-contract.md)) | Separate packages; plugins are form-instance scoped                              |

## Factory conventions

1. **`createXPlugin(options?) → FormPlugin`** — no import-time side effects.
2. **Stable `name`** — appears in `listPlugins()` and `onPluginError`.
3. **`engines`** — declare a range against `@jayoncode/form-intelligence` when publishing.
4. **Cleanup** — return `() => void` or `{ onDestroy }`; unregister hooks and clear any WeakMap/policy stores.
5. **Heavy code** — ship behind an optional subpath (same rationale as `/devtools`).

## Reference implementations in-repo

| Plugin                       | Path                     | Lesson                                                |
| ---------------------------- | ------------------------ | ----------------------------------------------------- |
| `ui()`                       | `src/ui/plugin.ts`       | Policies only; Presentation keys stay owned elsewhere |
| `createDevToolsPlugin`       | `src/devtools/plugin.ts` | Opt-in inspector; redaction defaults                  |
| Browser lifecycle / keyboard | `src/integrations/*`     | Thin wrappers over sibling packages                   |

## Non-goals

- New engines “as plugins”
- Rebuilding EOL `@jayoncode/form-intelligent*` shims
- Silent overwrite of Presentation from validation ticks
