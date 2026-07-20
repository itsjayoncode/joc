# Changelog

## 3.8.1

### Patch Changes

- adb77b9: Add a Become a Sponsor badge linking to GitHub Sponsors.

## 3.8.0

### Minor Changes

- 6f40b2b: Import Phase 1 HTML constraint attributes into validators on DOM attach (Field > Schema > HTML merge). Raise `core-login` entry-chunk gzip budget 26→27 KB (ADR-013) for sync kind-merge + HTML extract on the createForm graph.

## 3.7.0

### Minor Changes

- 6134105: Add `@jayoncode/form-intelligence/captcha` Security Stage with Turnstile, reCAPTCHA, hCaptcha, and `mockCaptcha`; token at `meta.security.captcha`.

## 3.6.0

### Minor Changes

- af981ea: Deepen DevTools UI projection snapshots with hard `submissionGuard` vs UX explain, presentation flags, and structured playground explain panels.
- af981ea: Seed Presentation `field.required` (ARIA / DOM / `requiredFields`) from schema and static `required` validators; workflow rules still override (Q10).

### Patch Changes

- af981ea: Align Vue/Angular adapters with the shared adapter contract: `controller`, `fieldController`, `focusFirstInvalid`; Angular `fiField` syncs projection attrs; docs teach `ui()` + `showError`.
- af981ea: Add a plugin author guide (ownership, extension map, conventions, testing) and maintainer note `019-plugin-author-conventions`.
- af981ea: Bring Yup/Valibot/AJV to Zod-level schema adapter depth: shared contract harness, nested/array path mapping (Yup brackets, AJV required params), and core nested-adapter error merge fix.
- af981ea: Document hard `submissionGuard()` vs `form.ui.canSubmit` / `explain("submit")` on the Submission guide; link from UI projection. Add maturity backlog `engineering/016-maturity-backlog.md`. Point UI projection docs at the `/ui` playground lab.

## 3.5.0

### Minor Changes

- 9223e6d: Add derived UI projection (`/ui`) and submission hard guards (`submissionGuard()` enforced in `submit()`). React/Vue/Angular/DOM adapters use `form.ui.canSubmit` / `showError` / `status` for button and field UX. Raise `core-login` entry-chunk gzip budget 24→26 KB (ADR-013) for the always-on projection graph. Remove `@jayoncode/form-intelligent*` compatibility packages from the monorepo (EOL — migrate to `form-intelligence*`).

## 3.4.1

### Patch Changes

- Enhance document introduction

## 3.4.0

### Minor Changes

- 06610ef: Rename Form Intelligence packages from `form-intelligent*` to `form-intelligence*` (core + adapters). Old `@jayoncode/form-intelligent*` packages remain compatibility re-exports so existing installs keep working; prefer the new names for new projects.

## 3.3.1

### Patch Changes

- Fix `validateOn` mode gating: `onChange` is value-change only; wire `all` / `onTouched` for change+blur; keep `onBlur` / `onSubmit` from validating on the wrong triggers.

## 3.3.0

### Minor Changes

- Add `createForm({ subscribe })` for one or many create-time state listeners (same store as `form.subscribe()`, fires once after init, until destroy).
- Additive subscribe to createForm()

## 3.2.1

### Patch Changes

- Fix incorrect types / docs mismatch

## 3.2.0

### Minor Changes

- Support `createForm({ plugins })` for declarative registration (same as sequential `form.use()`).
- form-intelligent 3.2.0 — engines, plugins, a11y, format rename
- Add Field/Form Controllers, `field.aria` / `setAriaIds`, `focusFirstInvalid`, and `/accessibility` helpers.
- Add analytics path allow/deny, timing fields on snapshots, and privacy tests (values never captured).
- Add `asyncValidator({ … })` options overload with cache, retry, timeout, debounce, and duplicate coalescing.
- Add fluent `form.calculate(path).from(…).compute(…)`, markDirty/lazy/memoized options, and calculation loop guards.
- Add createCheckpoint/restoreCheckpoint and richer fieldMeta (labels + isValidating) for durable state restore without overloading getSnapshot.
- Add Dependency Engine: `dependencies()` map/registrar, cycle detection, and cascade clear/revalidate on parent change.
- Add DevTools performance marks, plugin introspection, RingBuffer, and value redaction helpers.
- Add `form.restoreDraft()`, optional draft envelopes/migrate, pollution-safe merge, and `DraftStorageError` for quota failures.
- Harden offline queue: maxItems/overflow policies, OfflineQueueError, idempotency keys, and onConflict flush callbacks.
- Add plugin error isolation, engines/version metadata, and documented pipeline stages (`PLUGIN_PIPELINE_STAGES`).
- Add Presentation Engine accessors (`getPresentation`, `field.ui`), `/presentation` entry, and consistent DOM apply of UI flags.
- Add submit phase machine, `form.useMiddleware` (shared with plugin hooks), and `/middleware` entry.
- Add Transform Engine: inbound trim/normalize/sanitize/parse pipeline, `form.transform`, and `/transform` entry (Format stays display-only).
- Add wizard branching MVP (`when`/`next`/guards), configurable `goTo` validation modes, step graph helpers, and optional `persistStepInDraft`.
- Rename `/format` formatter exports to `format*` (`formatPhone`, `formatCurrency`, …); keep `trim`. Clarifies validators vs masks.

### Patch Changes

- Harden async validation: abort/debounce races, AbortSignal on ValidationContext, and no hung onChange schedules.
- Sync Phase 20 docs: migration breaks, capabilities matrix, performance nav, and diagrams checklist.
- Lock Phase 18 performance budgets (entry-chunk size), Vitest timing gates, and create/destroy leak stress.
- Add shared adapter contract helpers, SSR/stress suites, and CI SSR + size budget steps.
- Harden validation: catch throwing validators as field errors; expand built-in/mode/cross-field coverage and document normalized error shape.
- Harden workflow: registration rule order, typed WorkflowError, populate race guards, and autosave cancel on submit/destroy.

## Unreleased

### Minor Changes

- Phases 9–20: presentation, middleware, draft/wizard/offline/analytics harden, plugin isolation, controllers/`field.aria`, DevTools marks, performance budgets, testing contracts.

### Patch / migration notes

- DevTools: `captureStateOnWorkflowEvents` defaults to `false`; `redactValues` defaults to `true` when capturing.
- `createBrowserLifecyclePlugin` is only exported from `/plugins` (removed from `/workflow` re-exports).
- Accessibility subpath is `/accessibility` (not `/a11y`); use `createFormController` for controllers.
- `core-login` entry-chunk gzip budget is 24 KB — see `docs/performance.md`.

## 3.1.0

### Minor Changes

- Fixed. DiffType gained "moved", which broke form-intelligent’s narrower FormChangeType.

## 3.0.0

### Minor Changes

- Align FormChangeType / FormDiffMetadata with object-diff `moved` records and movedCount.
- Fixed DiffTye gained "moved" which broke FI FormChangeType

### Patch Changes

- Updated dependencies [8c0a09f]
- Updated dependencies [8c0a09f]
- Updated dependencies [8c0a09f]
- Updated dependencies [8c0a09f]
- Updated dependencies [8c0a09f]
- Updated dependencies [8c0a09f]
- Updated dependencies [8c0a09f]
- Updated dependencies [8c0a09f]
- Updated dependencies [8c0a09f]
- Updated dependencies [8c0a09f]
- Updated dependencies [8c0a09f]
- Updated dependencies [8c0a09f]
  - @jayoncode/object-diff@0.3.0

## 2.0.0

### Patch Changes

- Updated dependencies [36dc43a]
  - @jayoncode/browser-lifecycle@0.3.0

## 1.1.0

### Minor Changes

- 0f961ff: Change package title in npm server

## 1.0.0

### Major Changes

- 926fd56: JOC Docs v1.3.0 — Form Intelligence, playground hub, per-package changelogs

### Patch Changes

- Updated dependencies [926fd56]
  - @jayoncode/browser-lifecycle@0.2.0
  - @jayoncode/object-diff@0.2.0

## 0.1.1

### Patch Changes

- 1745931: Improve npm README title formatting and docs playground sidebar links (open in new tab).

## 0.1.0

Initial public release of the headless form workflow engine for the JOC ecosystem.

### Added

- `createForm()` with field registration and headless bindings
- Validation pipeline with built-in validators (`required`, `email`, `url`, `minLength`, `regex`)
- Submission orchestration with double-submit guard
- Workflow primitives: autosave, drafts, multi-step wizard
- Formatters: `phone`, `currency`, `slug`, `trim`, `uppercase`, `lowercase`
- Plugin registry and adapter interfaces
- Interactive playground and package documentation on the JOC docs site

All notable changes to `@jayoncode/form-intelligence` are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Modular engines: fields, validation, state, submission, workflow, format, plugins, adapters
- Plugin hook API (`beforeValidate`, `beforeSubmit`, …) and middleware helpers
- Core adapter interfaces (`SchemaAdapter`, `PersistenceAdapter`, `FrameworkAdapter`, `SubmitTransportAdapter`)
- Documentation: migration guide and common patterns
- Examples: `vanilla-html`, `basic-validation`, `wizard-workflow` (+ framework stubs)

## 0.1.1
