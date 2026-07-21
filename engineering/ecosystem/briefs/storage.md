# Package brief — `@jayoncode/storage`

**Status:** **Accepted** (2026-07-16)  
**Candidate:** `@jayoncode/storage`  
**Incubation:** Phase 8 flagship (only one at a time)  
**Next step:** `pnpm joc new package storage` · `pnpm joc new playground storage`  
**Constraint:** Do **not** create `packages/shared` during incubation unless the [shared candidates matrix](../shared-candidates.md) marks Extract.

See [governance.md](../governance.md) · [ecosystem README](../README.md).

---

## Problem

Apps repeatedly re-implement persistence beyond raw `localStorage`: namespaced keys, JSON (de)serialization, TTL/expiry, schema version metadata, and migration hooks — inconsistently, per project.

## Audience

Frontend engineers building SPAs / PWAs; authors of headless libraries that need predictable client persistence without owning form UX.

## Alternatives

| Option                            | Gap                                                                           |
| --------------------------------- | ----------------------------------------------------------------------------- |
| `localStorage` / `sessionStorage` | No TTL, versioning, migrations, or typed envelopes                            |
| `idb` / localForage               | Strong adapters; weaker JOC-style policies, docs/playground bar, SemVer story |
| DIY helpers                       | Fragmented; no shared mental model across apps                                |
| Form Intelligence drafts          | Solves **form** recovery — not general persistence                            |

## Why JOC?

Not “better localForage.”

**JOC Storage provides predictable, policy-driven client persistence through explicit APIs, typed envelopes, and version-aware lifecycle management — supported by the same documentation and interactive playground standards as every flagship JOC package.**

## Naming

Package id: **`@jayoncode/storage`**.

Considered `persistence` / `cache`; **Storage** wins as the broad, intuitive product name with room for policies beyond a single browser API. Revisit only before first npm publish if a stronger name emerges.

## Design principles

- Explicit over implicit
- Adapters over hidden runtime decisions
- Policy over configuration sprawl
- Compose with browser APIs; don’t replace them
- Valuable as a standalone package
- Configuration object first; fluent helpers only if they earn their keep later

## API shape (v1 expectation)

Preferred — explicit configuration:

```ts
const storage = createStorage({
  namespace: "app",
  adapter: localStorageAdapter,
  ttl: { hours: 1 },
});
```

Fluent chaining (e.g. `.namespace().ttl().adapter()`) is **optional** and must not be required. Prefer the `createStorage({ ... })` style for the public v1 surface.

Not a smart engine that secretly chooses backends.

## Relationship with existing packages

| Package           | Relationship                                                                                                 |
| ----------------- | ------------------------------------------------------------------------------------------------------------ |
| Browser Lifecycle | Compose in app code (e.g. persist on hide). **No dependency.**                                               |
| Form Intelligence | FI keeps draft/autosave APIs. Storage may become an **optional** persistence backend later — never required. |
| Object Diff       | Compose for snapshot compare before persist. **No dependency.**                                              |

Storage depends on **none** of the public JOC packages. Ideal composition shape.

## Non-goals

- Does **not** replace Form Intelligence draft management, autosave, or recovery UX.
- Does **not** automatically choose storage backends.
- Does **not** introduce a shared runtime / plugin host / store.
- Does **not** depend on Browser Lifecycle (or any other `@jayoncode/*` core).
- Does **not** ship encryption, compression, or cross-tab sync in v1.
- Does **not** invent `packages/shared` while incubating (Phase 6 stays blocked unless new Extract evidence appears).

## v1 scope

- Adapters: `localStorage`, `sessionStorage`, `memory`
- Namespaces
- Serialization (JSON default; pluggable)
- TTL / expiry
- Version metadata on envelopes
- Migration hooks

## v2+ (explicitly later)

- IndexedDB adapter (note: FI already has its own IndexedDB draft path — Storage IDB must not pretend to replace it)
- Encryption / compression
- Cross-tab sync helpers
- Quota management / simulation beyond basic playground demos

## Playground plan

**Storage Lab** (`apps/storage-playground` after scaffold):

- Switch adapters (memory / local / session)
- TTL countdown visualization
- Envelope / version inspector
- Migration dry-run
- Quota / failure simulation (honest, scoped)

## Success criteria

- Independently installable; valuable without any other `@jayoncode/*` package
- **No public API requires another `@jayoncode/*` package**
- Docs + playground demonstrate happy path before first public minor
- Brief’s non-goals still true after launch
- Leaves the ecosystem better: validated persistence patterns, docs lessons, optional composition notes for FI/BL/OD

## Acceptance

| Field       | Value                                                                 |
| ----------- | --------------------------------------------------------------------- |
| Maintainer  | Signed off (governance + ChatGPT/Cursor refinements)                  |
| Accepted on | 2026-07-16                                                            |
| Next step   | `pnpm joc new package storage` then `pnpm joc new playground storage` |
