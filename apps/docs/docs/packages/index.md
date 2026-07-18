---
title: JOC Packages | JayOnCode Monorepo Catalog
description: Browse the JayOnCode (JOC) monorepo package catalog — independently installable @jayoncode/* TypeScript libraries for browser lifecycle, forms, object diffing, and more.
---

# Packages

JayOnCode (**JOC**) is a monorepo of focused TypeScript packages. Each `@jayoncode/*` library solves one developer problem well, ships on its own version line, and documents under its own section on this site.

**Today:** three live packages with docs and playgrounds. **Next:** additional libraries — [to be announced](/roadmap/).

## How the docs are organized

| Level           | What you will find                                                                                                                                                                     |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Monorepo**    | [Getting started](/getting-started/introduction), [philosophy](/getting-started/philosophy), [ecosystem](/getting-started/ecosystem), [roadmap](/roadmap/), [playground](/playground/) |
| **Contributor** | [Contribution](/guides/contribution), [monorepo guide](/guides/monorepo), [package standards](/guides/package-standards)                                                               |
| **Package**     | Guides, API, examples, FAQ, patterns, and playgrounds scoped to that package                                                                                                           |

Start with a live package below. New libraries will appear here when they ship.

## Live on npm

### [Browser Lifecycle](/packages/browser-lifecycle/)

`@jayoncode/browser-lifecycle` — typed browser session lifecycle for page visibility, window focus, connectivity, idle detection, cross-tab sync, plugins, and diagnostics.

**Start here (in order):**

1. [Overview & learning path](/packages/browser-lifecycle/)
2. [Tutorial — your first session](/packages/browser-lifecycle/modules/getting-started)
3. [Visibility](/packages/browser-lifecycle/modules/visibility) → [Events](/packages/browser-lifecycle/modules/events) → [Session core](/packages/browser-lifecycle/modules/session-core)
4. [Interactive playground](/playground/browser-lifecycle/)

### [Object Diff](/packages/object-diff/)

`@jayoncode/object-diff` — deep object comparison, structured change reporting, and JSON Patch generation for state snapshots and change tracking.

**Start here (in order):**

1. [Overview & learning path](/packages/object-diff/)
2. [Tutorial — your first diff](/packages/object-diff/modules/getting-started)
3. [Diffing](/packages/object-diff/modules/diff) → [Patching](/packages/object-diff/modules/patch) → [Serialization](/packages/object-diff/modules/serialize) → [Engines](/packages/object-diff/modules/engines)
4. [Interactive playground](/playground/object-diff/)

### [Form Intelligence](/packages/form-intelligence/)

`@jayoncode/form-intelligence` — a headless form workflow engine for validation, submission, autosave, drafts, and multi-step wizards.

**Start here (in order):**

1. [Overview & learning path](/packages/form-intelligence/)
2. [Tutorial — your first form](/packages/form-intelligence/modules/getting-started)
3. [Validation](/packages/form-intelligence/modules/validation) → [Submission](/packages/form-intelligence/modules/submission) → [Workflow](/packages/form-intelligence/modules/workflow)
4. [Rules](/packages/form-intelligence/modules/rules) · [Calculations](/packages/form-intelligence/modules/calculations) · [State](/packages/form-intelligence/modules/state)
5. [Migration](/packages/form-intelligence/modules/migration) · [Patterns](/packages/form-intelligence/modules/patterns)
6. [Interactive playground](/playground/form-intelligence/)

## What’s next

Additional `@jayoncode/*` packages will be **announced** as they enter active development. We won’t list unreleased package names here — watch the [roadmap](/roadmap/), [GitHub Discussions](https://github.com/itsjayoncode/joc/discussions), and this catalog when new libraries ship.

## New to JOC?

1. Read [Introduction](/getting-started/introduction) — what JOC is, the vision, and live packages.
2. Skim [Philosophy](/getting-started/philosophy) — why packages stay independent.
3. Pick a library from this catalog (or try the [playground](/playground/)).
4. Follow the [roadmap](/roadmap/) for what’s next — and [contribute](/guides/contribution) if you want to help.
