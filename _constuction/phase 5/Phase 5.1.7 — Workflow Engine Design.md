# JOC ENGINEERING TASK
# Phase 5.1.7 — Workflow Engine Design
# Package: @jayoncode/form-intelligent

===============================================================================
ROLE
===============================================================================

You are acting as a Workflow Systems Architect.

Design the workflow engine — primary JOC differentiator (⭐⭐⭐⭐⭐).

Do NOT implement code.

===============================================================================
DEPENDENCIES
===============================================================================

Requires

✓ Phase 5.1.4 — Architecture

✓ Phase 5.1.5 — Public API Design

===============================================================================
OBJECTIVE
===============================================================================

Produce `packages/form-intelligent/engineering/006-workflow-architecture.md`.

===============================================================================
OUTPUT
===============================================================================

packages/form-intelligent/engineering/006-workflow-architecture.md

===============================================================================
WORKFLOW CAPABILITIES
===============================================================================

--------------------------------------------------
Submit Workflow
--------------------------------------------------

State machine: idle → validating → submitting → success | failure

Hooks: `onBeforeSubmit`, `onSubmit`, `onSuccess`, `onError`, `onSettled`

--------------------------------------------------
Loading
--------------------------------------------------

Form-level and field-level loading flags.

Integration with submission engine.

--------------------------------------------------
Success / Failure
--------------------------------------------------

Configurable handlers, reset policy, redirect hooks.

--------------------------------------------------
Retry
--------------------------------------------------

Policy: max attempts, backoff, which errors are retryable.

Manual retry API.

--------------------------------------------------
Autosave
--------------------------------------------------

- Debounce interval
- Trigger on change / blur / interval
- Pause when form invalid (optional)
- **browser-lifecycle integration**: pause when document hidden
- Conflict detection with manual save

--------------------------------------------------
Drafts
--------------------------------------------------

- Persistence adapter interface (`loadDraft`, `saveDraft`, `clearDraft`)
- localStorage default adapter
- Restore on init prompt
- Draft versioning

--------------------------------------------------
Undo / Redo
--------------------------------------------------

- Snapshot stack (integrate object-diff for change summaries optional)
- Keyboard shortcut hooks via `@jayoncode/keyboard` (future)

--------------------------------------------------
Wizard / Multi-step
--------------------------------------------------

- Step definitions with field groups
- Per-step validation before advance
- `next`, `prev`, `goTo`, `canGoNext`
- Progress percentage
- Conditional steps

--------------------------------------------------
Conditional Logic
--------------------------------------------------

- Field visibility based on expressions
- Enable/disable fields
- Dynamic required rules

--------------------------------------------------
Dependencies
--------------------------------------------------

- Field A change triggers revalidation of Field B
- Declarative dependency graph

--------------------------------------------------
Navigation Guards
--------------------------------------------------

- Block route leave when dirty
- Adapter hooks for React Router, Vue Router

===============================================================================
WORKFLOW CONFIG EXAMPLE
===============================================================================

Provide full TypeScript config example (pseudocode) for checkout wizard with autosave.

===============================================================================
ACCEPTANCE CRITERIA
===============================================================================

✓ State machines documented

✓ Autosave + draft + wizard are first-class

✓ browser-lifecycle integration points listed

===============================================================================
STOP CONDITION
===============================================================================

STOP after Workflow Engine Design.

Proceed to Phase 5.1.8 — Adapter Architecture.
