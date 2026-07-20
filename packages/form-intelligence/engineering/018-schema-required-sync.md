# Schema → presentation `required` sync

**Status:** Active  
**Date:** 2026-07-20  
**Resolves:** Q10 (UI Phases open questions)  
**Related:** [016-maturity-backlog](./016-maturity-backlog.md), [Presentation ownership](../src/engines/presentation/resolve.ts)

## Problem

Schema / static validators that include the built-in `required` identity only fed **Validation**. UI `fieldUi.required` (presentation, `aria-required`, DOM `required`, `form.ui.requiredFields`) was written **only** by Workflow (`when().require()` / `ctx.require`). Schema-only forms never showed UI required.

## Decision

| Layer                                     | Role                                                                                                |
| ----------------------------------------- | --------------------------------------------------------------------------------------------------- |
| **Validation**                            | Still owns whether empty values fail (`required` / `requiredWhen`)                                  |
| **Presentation**                          | Owns UI `required` for a11y / DOM / collections                                                     |
| **Schema / static `required` validators** | Supply a **required baseline** seeded into Presentation at create (and on `field()` register)       |
| **Workflow rules**                        | Override baseline dynamically (match → true, unmatched `.require()` → false, `.optional()` → false) |

### Baseline sources

Paths whose merged validator list includes the built-in **`required` identity**:

- Schema `{ required: true }` / `validate.required`
- String shortcuts `"email"` | `"password"` | `"url"` (compiler injects `required`)
- `validators: { path: [required, …] }` and `field(path, { validators: [required] })`
- **HTML `required`** on DOM-backed controls (extracted once on attach — ADR-VAL-002)

**Not** baseline: `requiredWhen(...)` (conditional validation ≠ static UI intent).

### Evaluation rules (unchanged overrides)

1. **No workflow rules:** seed `fieldUi[path].required = true` for baseline paths.
2. **With rules:** `evaluateFormRules` initializes defaults from baseline (`required: true` when in baseline, else `undefined`), then applies existing rule patches. Unmatched `.require()` still forces `false` (preserves dual-channel “validate always / UI optional when Personal” patterns).

### Non-goals

- Validation must not write `fieldUi` on every validate tick
- `/ui` must not invent `required` from error strings
- Schema adapters (Zod/Yup/…) are out of scope for this ADR (no static `required` identity in field-schema compile)

## Verification

- Unit: schema / `validators` / `"email"` shortcut → `getPresentation().field.required === true`
- Unit: baseline + unmatched `.require()` → `false`
- Existing `rules.test.ts` dual-channel case still passes
