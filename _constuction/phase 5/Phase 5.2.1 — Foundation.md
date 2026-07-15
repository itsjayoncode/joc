# JOC ENGINEERING TASK
# Phase 5.2.1 — Foundation
# Package: @jayoncode/form-intelligent

===============================================================================
ROLE
===============================================================================

Principal TypeScript Engineer implementing package foundation.

This is a **production implementation** task.

Phase 5.1 engineering docs are frozen source of truth.

Do NOT redesign architecture or public APIs.

===============================================================================
DEPENDENCIES
===============================================================================

Requires Phase 5.1.1, 5.1.4, 5.1.5, 5.1.9.

===============================================================================
OBJECTIVE
===============================================================================

Implement foundation only — no form logic, no validation, no submission yet.

===============================================================================
OUTPUT
===============================================================================

```
packages/form-intelligent/src/
  core/
  types/
  errors/
  utils/
```

===============================================================================
IMPLEMENTATION
===============================================================================

1. **Configuration** — `FormConfig`, `normalizeFormOptions()`
2. **Errors** — `FormError`, `ValidationError`, `SubmitError`, error codes
3. **Types** — public + internal type separation
4. **Utilities** — path helpers, `getIn`/`setIn`, `isPlainObject`, feature detection
5. **Feature detection** — SSR-safe environment checks
6. **Lifecycle types** — `FormPhase`, event names (no engine yet)

===============================================================================
TESTS
===============================================================================

Unit tests for utils, options normalization, error classes.

===============================================================================
ACCEPTANCE CRITERIA
===============================================================================

✓ `pnpm build:packages` includes form package

✓ No circular imports

✓ 90%+ coverage on foundation modules

===============================================================================
STOP CONDITION
===============================================================================

STOP after Foundation. Proceed to 5.2.2 Form Core.
