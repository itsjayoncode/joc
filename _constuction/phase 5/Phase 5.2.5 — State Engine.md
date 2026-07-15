# JOC ENGINEERING TASK
# Phase 5.2.5 — State Engine
# Package: @jayoncode/form-intelligent

===============================================================================
DEPENDENCIES
===============================================================================

Requires Phase 5.2.1 — Foundation.

===============================================================================
OBJECTIVE
===============================================================================

Implement form state store and subscriptions.

===============================================================================
OUTPUT
===============================================================================

```
packages/form-intelligent/src/state/
  store.ts
  selectors.ts
  history.ts
  snapshots.ts
  meta.ts
```

===============================================================================
STATE SHAPE
===============================================================================

- **values** — form data tree
- **errors** — field + form errors
- **touched** — user interacted
- **dirty** — differs from default
- **visited** — focused at least once
- **changed** — changed since last submit
- **history** — undo/redo stack (optional enable)
- **snapshots** — point-in-time clones

===============================================================================
API
===============================================================================

- `form.values()`, `form.setValue()`
- `form.errors()`, `form.setError()`, `form.clearErrors()`
- `form.getFieldState(path)`, `form.getFormState()`
- `form.use(selector)` — subscribe primitive

===============================================================================
TESTS
===============================================================================

Immutability, selectors, dirty detection, snapshots.

===============================================================================
STOP CONDITION
===============================================================================

STOP after State Engine.
