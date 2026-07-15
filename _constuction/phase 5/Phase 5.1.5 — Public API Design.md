# JOC ENGINEERING TASK
# Phase 5.1.5 — Public API Design
# Package: @jayoncode/form-intelligent

===============================================================================
ROLE
===============================================================================

You are acting as a Principal API Designer and TypeScript Library Architect.

You are designing the **permanent public API contract** for `@jayoncode/form-intelligent`.

Do NOT implement anything.

===============================================================================
DEPENDENCIES
===============================================================================

Requires

✓ Phase 5.1.4 — Architecture

===============================================================================
OBJECTIVE
===============================================================================

Produce `packages/form-intelligent/engineering/004-public-api-design.md`.

===============================================================================
OUTPUT
===============================================================================

packages/form-intelligent/engineering/004-public-api-design.md

===============================================================================
API PHILOSOPHY
===============================================================================

Document:

- Why one core package vs many micro-packages for v1
- Headless instance API vs hook-only API
- How `form.use()` enables framework adapters
- Stability guarantees for v1

===============================================================================
CORE API — FULL SPECIFICATION
===============================================================================

Specify each public function with parameters, return types, options, examples, edge cases.

--------------------------------------------------
createForm(config?)
--------------------------------------------------

Factory. Returns form instance.

Config: initial values, validators, workflow, submission handler, plugins.

--------------------------------------------------
form.field(path, options?)
--------------------------------------------------

Register or get field handle.

Options: default value, validators, formatters, metadata.

--------------------------------------------------
form.submit(options?)
--------------------------------------------------

Trigger validation + submission workflow.

Options: preventDefault, retry, silent.

--------------------------------------------------
form.reset(options?)
--------------------------------------------------

Reset values and meta state.

Options: keepDirty, values override.

--------------------------------------------------
form.validate(options?)
--------------------------------------------------

Run validation pipeline.

Options: fields, mode (change/blur/submit), async.

--------------------------------------------------
form.values(path?)
--------------------------------------------------

Read current values (full tree or path).

--------------------------------------------------
form.errors(path?)
--------------------------------------------------

Read validation errors.

--------------------------------------------------
form.use(selector?, options?)
--------------------------------------------------

Subscribe to form state (adapter primitive for React/Vue).

Document selector pattern for performance.

--------------------------------------------------
form.destroy()
--------------------------------------------------

Cleanup subscriptions, timers, plugins.

===============================================================================
SUPPLEMENTARY API
===============================================================================

Also specify:

- `form.setValue(path, value, options?)`
- `form.setError(path, error)`
- `form.clearErrors(path?)`
- `form.getFieldState(path)`
- `form.getFormState()`
- `form.on(event, listener)` / `form.off`
- `form.registerPlugin(plugin)`
- Workflow: `form.workflow.next()`, `form.workflow.prev()`, `form.workflow.goTo(step)`

===============================================================================
TYPES TO EXPORT
===============================================================================

- `FormInstance`
- `FieldHandle`
- `FormConfig`
- `FormState`
- `FieldState`
- `ValidationResult`
- `SubmitResult`
- `WorkflowState`

===============================================================================
ERROR HANDLING
===============================================================================

When to throw vs return result objects.

===============================================================================
VERSIONING POLICY
===============================================================================

What is stable in 1.0 vs experimental.

===============================================================================
ACCEPTANCE CRITERIA
===============================================================================

✓ Another engineer can implement without inventing APIs

✓ All listed methods fully specified

✓ Adapter integration points documented

===============================================================================
STOP CONDITION
===============================================================================

STOP after Public API Design.

Proceed to Phase 5.1.6 — Validation Architecture.
