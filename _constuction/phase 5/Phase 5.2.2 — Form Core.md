# JOC ENGINEERING TASK
# Phase 5.2.2 — Form Core
# Package: @jayoncode/form-intelligent

===============================================================================
DEPENDENCIES
===============================================================================

Requires Phase 5.2.1 — Foundation.

===============================================================================
OBJECTIVE
===============================================================================

Implement `createForm()` and form instance lifecycle.

===============================================================================
OUTPUT
===============================================================================

```
packages/form-intelligent/src/core/
  create-form.ts
  form-instance.ts
  events.ts
  registry.ts
```

===============================================================================
IMPLEMENTATION
===============================================================================

- `createForm(config)` factory
- Initialization with default values
- `form.destroy()` cleanup
- Event emitter: `change`, `submit`, `reset`, `error`
- Configuration registry (immutable after init option)
- Form ID generation
- Debug mode (dev-only logging)

===============================================================================
PUBLIC API
===============================================================================

Implement stubs delegating to future engines where needed:

- `form.submit()` — wires to submission engine (5.2.6)
- `form.reset()` — wires to state engine (5.2.5)
- `form.validate()` — wires to validation engine (5.2.4)

===============================================================================
TESTS
===============================================================================

Lifecycle, event subscription, destroy idempotency.

===============================================================================
STOP CONDITION
===============================================================================

STOP after Form Core. Proceed to 5.2.3 Field System.
