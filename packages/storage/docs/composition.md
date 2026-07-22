# Composition

**Status:** Stable (guidance)

**Previous:** [Cross-tab](/packages/storage/modules/cross-tab) · **Next:** [Recipes](/packages/storage/modules/recipes)

`@jayoncode/storage` has **no** runtime dependency on other `@jayoncode/*` packages. Compose in app code.

## Browser Lifecycle

Persist from app handlers (e.g. on `hidden` / pagehide) — Storage does not subscribe to lifecycle APIs.

## Object Diff

Diff or patch in the app, then `storage.set` the result. Undo/history is not a shipped Storage capability.

## Form Intelligence

FI owns draft UX. Storage may hold opaque blobs later; it does not replace FI drafts.

Dogfood: Object Diff playground shell prefs use Storage without a package dependency edge.

See also: [Recipes](/packages/storage/modules/recipes) · [Overview](/packages/storage/overview)
