# JOC ENGINEERING TASK
# Phase 5.1.6 — Validation Architecture
# Package: @jayoncode/form-intelligent

===============================================================================
ROLE
===============================================================================

You are acting as a Validation Systems Architect and TypeScript Engineer.

Design the validation subsystem — one of the highest-priority engines (⭐⭐⭐⭐⭐).

Do NOT implement code in this phase.

===============================================================================
DEPENDENCIES
===============================================================================

Requires

✓ Phase 5.1.4 — Architecture

✓ Phase 5.1.5 — Public API Design

===============================================================================
OBJECTIVE
===============================================================================

Produce `packages/form-intelligent/engineering/005-validation-architecture.md`.

===============================================================================
OUTPUT
===============================================================================

packages/form-intelligent/engineering/005-validation-architecture.md

===============================================================================
BUILT-IN VALIDATORS
===============================================================================

Specify each built-in validator:

| Validator | Rules | Default message |
|-----------|-------|-----------------|
| required | non-empty | |
| email | RFC practical subset | |
| number | finite, optional min/max | |
| url | URL parse | |
| date | ISO / Date parse | |
| phone | E.164 or locale plugin | |
| currency | decimal precision | |
| password | min length, optional strength | |
| regex | pattern | |
| min / max | length or value | |
| minLength / maxLength | string/array | |

--------------------------------------------------
Custom Validators
--------------------------------------------------

`(value, context) => boolean | string | Promise<...>`

Document `ValidationContext`: form values, field path, siblings.

--------------------------------------------------
Async Validators
--------------------------------------------------

- Debounce policy
- Cancel in-flight on value change
- Race handling
- Loading state per field

--------------------------------------------------
Cross-field Validation
--------------------------------------------------

- Dependent field triggers
- Form-level validators
- Examples: password confirm, date range, conditional required

--------------------------------------------------
Schema Validation
--------------------------------------------------

Core defines adapter interface only.

Implementations live in optional packages:

- `@jayoncode/form-intelligent-zod`
- `@jayoncode/form-intelligent-yup`
- `@jayoncode/form-intelligent-valibot`

Document `SchemaAdapter` interface.

--------------------------------------------------
Validation Modes
--------------------------------------------------

- `onChange`
- `onBlur`
- `onSubmit`
- `onTouched`
- `all`

Per-field and form-level overrides.

--------------------------------------------------
Validation Pipeline
--------------------------------------------------

Order of execution:

1. Parse/format (optional)
2. Field sync validators
3. Field async validators
4. Cross-field rules
5. Schema validation (if adapter)
6. Form-level validators

Short-circuit rules documented.

--------------------------------------------------
Error System
--------------------------------------------------

- Error shape: `{ path, message, code?, meta? }`
- Global vs field errors
- Server error mapping API
- i18n message keys (optional)

===============================================================================
ACCEPTANCE CRITERIA
===============================================================================

✓ Pipeline order is unambiguous

✓ Built-in validators listed with behavior

✓ Schema stays optional via adapters

===============================================================================
STOP CONDITION
===============================================================================

STOP after Validation Architecture.

Proceed to Phase 5.1.7 — Workflow Engine Design.
