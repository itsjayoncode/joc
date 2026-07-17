# Migration

Browser Lifecycle is currently at **v0.1.0** (initial pre-release).

## Naming migration

| Construction / legacy        | Canonical                      |
| ---------------------------- | ------------------------------ |
| Browser Session              | Browser Lifecycle              |
| `@jayoncode/browser-session` | `@jayoncode/browser-lifecycle` |
| `createBrowserSession()`     | `createBrowserLifecycle()`     |

## v0.1.0

This is the first versioned release of `@jayoncode/browser-lifecycle`. There is no migration path from earlier published npm versions because the package was not published before v0.1.0.

If you followed construction docs or local workspace sources during Phase 2/3 development:

- use `createBrowserLifecycle()` as the public entry point
- pin `@jayoncode/browser-lifecycle@0.1.0` once published
- review module configuration defaults in the [Configuration guide](/packages/browser-lifecycle/guides/configuration)

Future releases will document breaking API changes, configuration shape changes, and module behavior updates on this page.

## Changelog

See the [package changelog](/packages/browser-lifecycle/changelog).
