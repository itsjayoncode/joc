# FAQ

**Status:** Stable (guidance)

**Previous:** [Best practices](/packages/storage/modules/best-practices) · **Next:** [Browser support](/packages/storage/modules/browser-support)

Quick answers. For “how do I…?” start with [Recipes](/packages/storage/modules/recipes); for option tables use [Core](/packages/storage/modules/core).

### I just want prefs to survive reload — where do I start?

[Tutorial](/packages/storage/modules/getting-started) → swap to `createLocalStorageAdapter()` → copy [Preferences recipe](/packages/storage/modules/recipes#preferences-long-ttl).

### Why not just use `localStorage`?

You can. Storage adds namespaces, envelopes, TTL, `schemaVersion` / `migrate`, policies, and typed errors so you don’t reimplement them per app.

### Is this IndexedDB?

No. v1 is **sync** Web Storage–shaped (memory / `localStorage` / `sessionStorage`). IndexedDB is a later phase.

### How is this different from Form Intelligence drafts?

FI owns draft UX. Storage is persistence policy only — you can still use Storage as an adapter under FI in app code ([Composition](/packages/storage/modules/composition)).

### What does `has()` mean?

“Is there a non-expired entry?” — same as `peek(key) !== null`. It does **not** run `migrate`. Call `get` when you need the migrated value.

### Why did `get` return `null` but DevTools still shows a key?

Usually: expired (deleted on read), migrate returned drop, or you’re looking at a different namespace / adapter. Use `peek` and [Diagnostics](/packages/storage/modules/diagnostics) in DEV.

### Why did `clear()` throw?

It needs `adapter.keys()`. Built-in adapters provide it; custom adapters must implement `keys` for `clear` / cleanup / snapshot / report.

### Why isn’t `stats()` on the main instance?

Tooling stays on `@jayoncode/storage/diagnostics` so the default import stays small.

### Cross-tab observe / ACID transactions?

No. Observe is **in-process** (same JS realm). Transactions are **same-tab** journal + commit — not multi-tab ACID.

### Collections API? (`push` / `filter` on keys)

Rejected by design. Store an array (or map) under one key — see [Recipes](/packages/storage/modules/recipes).

### Encryption / secrets?

Not in core. Don’t store passwords or tokens in web storage expecting confidentiality from XSS. See [Security](/packages/storage/modules/security).

### Where is the full API?

[Core](/packages/storage/modules/core) (guide) · [TypeDoc](/packages/storage/api/) (symbols) · [Playground](/playground/storage/)

See also: [Best practices](/packages/storage/modules/best-practices) · [Errors](/packages/storage/modules/errors) · [Overview paths](/packages/storage/overview#pick-your-path)
