# Composition without coupling

How `@jayoncode/*` packages work **together in your app** — without a shared runtime or meta-package.

## Principle

Install only what you need. Wire signals in application code (or thin FI plugins). Cores stay independently useful.

## Recipe index

| Story               | Packages                               | Where                                                                                                                 |
| ------------------- | -------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| Draft on tab hide   | Browser Lifecycle + Form Intelligence  | [Patterns](/packages/form-intelligence/modules/patterns#composition-draft-on-tab-hide-browser-lifecycle)              |
| Dirty audit / patch | Object Diff + Form Intelligence        | [Patterns](/packages/form-intelligence/modules/patterns#composition-dirty-audit--patch-object-diff)                   |
| Idle soft-save      | Browser Lifecycle + Form Intelligence  | [Patterns](/packages/form-intelligence/modules/patterns#composition-idle-soft-save-browser-lifecycle)                 |
| Hide + dirty check  | Browser Lifecycle + Object Diff (+ FI) | [Patterns](/packages/form-intelligence/modules/patterns#composition-hide--dirty-check-browser-lifecycle--object-diff) |

Runnable starter: [`examples/composition-form-lifecycle`](https://github.com/itsjayoncode/joc/tree/master/examples/composition-form-lifecycle).

## Start with one package

Most apps should begin with a single library (forms, session signals, or diffs), then compose when a real cross-cutting story appears.

## What we will not do

- Ship `@jayoncode/ecosystem` that forces all packages
- Invent a shared store/signals runtime for composition (see Architecture Convergence)
- Treat playgrounds as multi-package frameworks
