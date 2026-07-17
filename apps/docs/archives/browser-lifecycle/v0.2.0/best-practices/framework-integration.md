# Framework Integration

## Recommended

Use a dedicated adapter package so the session is owned once per scope and disposed on unmount:

- [Framework adapters](/packages/browser-lifecycle/modules/adapters) — React, Vue, Svelte, Solid, Angular
- Wrap with the adapter Provider / `provide` / context helpers
- Read state via snapshot hooks / signals / stores

## Core-only apps

If you are not using a framework adapter, create **one** `createBrowserLifecycle()` per tab and share it through your own context.

## Examples

See [Framework Examples](/packages/browser-lifecycle/examples/) for monorepo demos, and the adapter module for package APIs.

## Not recommended

Importing `createBrowserLifecycle()` directly inside every leaf component (duplicate sessions and leaked listeners).
