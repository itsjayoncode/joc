---
title: JOC Packages | JayOnCode Monorepo Catalog
description: Browse the JayOnCode (JOC) monorepo package catalog — independently installable @jayoncode/* TypeScript libraries for browser lifecycle, forms, scroll, themes, requests, and more.
---

# Packages

JayOnCode (JOC) is a **monorepo of focused TypeScript packages**. Each `@jayoncode/*` library solves one developer problem well, ships on its own version line, and documents under its own package section in this site.

## How the docs are organized

| Level           | What you will find                                                                                                                                                                     |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Monorepo**    | [Getting started](/getting-started/introduction), [philosophy](/getting-started/philosophy), [ecosystem](/getting-started/ecosystem), [roadmap](/roadmap/), [playground](/playground/) |
| **Contributor** | [Contribution](/guides/contribution), [monorepo guide](/guides/monorepo), [package standards](/guides/package-standards)                                                               |
| **Package**     | Guides, API, examples, FAQ, patterns, and playgrounds scoped to that package                                                                                                           |

Start with the live package today, then explore planned libraries as they land.

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
3. [Diffing](/packages/object-diff/modules/diff) → [Patching](/packages/object-diff/modules/patch) → [Serialization](/packages/object-diff/modules/serialize)
4. [Interactive playground](/playground/object-diff/)

### [Form Intelligent](/packages/form-intelligent/)

`@jayoncode/form-intelligent` — a headless form workflow engine for validation, submission, autosave, drafts, and multi-step wizards.

**Start here (in order):**

1. [Overview & learning path](/packages/form-intelligent/)
2. [Tutorial — your first form](/packages/form-intelligent/modules/getting-started)
3. [Validation](/packages/form-intelligent/modules/validation) → [Submission](/packages/form-intelligent/modules/submission) → [Workflow](/packages/form-intelligent/modules/workflow)
4. [Rules](/packages/form-intelligent/modules/rules) · [Calculations](/packages/form-intelligent/modules/calculations) · [State](/packages/form-intelligent/modules/state)
5. [Migration](/packages/form-intelligent/modules/migration) · [Patterns](/packages/form-intelligent/modules/patterns)
6. [Interactive playground](/playground/form-intelligent/)

## Coming soon

These packages are tracked in the monorepo and documented as stubs until they publish:

| Package     | npm name                 | Docs                               |
| ----------- | ------------------------ | ---------------------------------- |
| Request     | `@jayoncode/request`     | [Overview](/packages/request/)     |
| Scroll      | `@jayoncode/scroll`      | [Overview](/packages/scroll/)      |
| Keyboard    | `@jayoncode/keyboard`    | [Overview](/packages/keyboard/)    |
| Responsive  | `@jayoncode/responsive`  | [Overview](/packages/responsive/)  |
| Theme       | `@jayoncode/theme`       | [Overview](/packages/theme/)       |
| Layers      | `@jayoncode/layers`      | [Overview](/packages/layers/)      |
| Audit       | `@jayoncode/audit`       | [Overview](/packages/audit/)       |
| Permissions | `@jayoncode/permissions` | [Overview](/packages/permissions/) |
| Workflow    | `@jayoncode/workflow`    | [Overview](/packages/workflow/)    |

## New to JOC?

1. Read [Introduction](/getting-started/introduction) to understand the monorepo model.
2. Pick a package — start with [Browser Lifecycle](/packages/browser-lifecycle/) if you manage browser session behavior.
3. Follow the [roadmap](/roadmap/) for what ships next across the collection.
