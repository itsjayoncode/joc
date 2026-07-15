# JOC ENGINEERING TASK
# Phase 5.2.4 — Validation Engine
# Package: @jayoncode/form-intelligent

===============================================================================
PRIORITY: ⭐⭐⭐⭐⭐
===============================================================================

===============================================================================
DEPENDENCIES
===============================================================================

Requires Phase 5.1.6 — Validation Architecture, 5.2.3 — Field System.

===============================================================================
OBJECTIVE
===============================================================================

Implement full validation pipeline per `005-validation-architecture.md`.

===============================================================================
OUTPUT
===============================================================================

```
packages/form-intelligent/src/validation/
  pipeline.ts
  validators/
  async-validator.ts
  cross-field.ts
  modes.ts
```

===============================================================================
BUILT-IN VALIDATORS (REQUIRED)
===============================================================================

required, email, number, url, date, phone, currency, password, regex, min, max, minLength, maxLength, custom

===============================================================================
FEATURES
===============================================================================

- Sync + async validators with cancel
- Cross-field validation
- Validation modes (change, blur, submit)
- Error normalization
- `form.validate()` public API

===============================================================================
TESTS
===============================================================================

Each validator, async race, cross-field, pipeline order.

===============================================================================
STOP CONDITION
===============================================================================

STOP after Validation Engine. Proceed to 5.2.5 State Engine.
