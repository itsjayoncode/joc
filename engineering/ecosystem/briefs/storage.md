# Package brief — `@jayoncode/storage`

**Status:** **Shipped** — public `@jayoncode/storage@0.3.0` (sync core + `/async` + `/cross-tab` + `/quota` + `/transforms`)  
**Candidate:** `@jayoncode/storage`  
**Incubation:** Phase 8 flagship — **complete**  
**Next step:** Dogfood **0.3**; continue Product Maturation; next ecosystem flagship TBA  
**Constraint:** Do **not** create `packages/shared` unless the [shared candidates matrix](../shared-candidates.md) marks Extract.

See [governance.md](../governance.md) · [ecosystem README](../README.md) · Accepted [storage-v2.md](./storage-v2.md).

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
- Does **not** ship silent encryption/compression defaults (opt-in `/transforms` in **0.3**). Cross-tab notify shipped in **0.2**. Soft quota guards shipped in **0.3**.
- Does **not** invent `packages/shared` (Phase 6 stays blocked unless new Extract evidence appears).

## v1 scope

- Adapters: `localStorage`, `sessionStorage`, `memory`
- Namespaces
- Serialization (JSON default; pluggable)
- TTL / expiry
- Version metadata on envelopes
- Migration hooks

## Shipped in 0.2

- IndexedDB via `@jayoncode/storage/async` (DB `jayoncode-storage` — not FI drafts)
- Cross-tab notify via `@jayoncode/storage/cross-tab` (sync adapters)

## Product Maturation checklist

Stay on **0.x / 1.x** polish. Quota + transforms landed in **0.3** per Accepted [storage-v2.md](./storage-v2.md).

| Area         | Check                                                                                                        |
| ------------ | ------------------------------------------------------------------------------------------------------------ |
| Docs dogfood | Async + cross-tab + quota + transforms examples match real exports; FAQ FI DB boundary accurate              |
| Lab dogfood  | Cross-tab two-tab path; soft quota guard + Lab sim; demo transform codec labeled non-crypto; IDB on `/async` |
| SemVer       | Changesets → CI publish; changelog / roadmap / npm status aligned (`0.3.0`)                                  |
| Integrity    | Export paths `/async`, `/cross-tab`, `/quota`, `/transforms` covered by DX platform tests                    |
| Honesty      | Soft quota uses approx bytes; Lab sim ≠ browser remaining; diagnostics `approxBytes` honest                  |
| Composition  | FI / Browser Lifecycle / Object Diff still **no dependency**                                                 |

## Shipped in 0.3

- Soft quota via `@jayoncode/storage/quota` (`enableQuotaGuard`, `estimateNamespaceBytes`)
- Payload transforms via `@jayoncode/storage/transforms` (`withPayloadTransforms`)

## Deferred (later)

- Async ports of maintenance / snapshots / transactions / observable / quota / transforms

## Playground plan

**Storage Lab** (`apps/storage-playground`):

- Switch adapters (memory / local / session)
- TTL countdown visualization
- Envelope / version inspector
- Migration dry-run
- Quota / failure simulation (honest, scoped)
- Cross-tab notify event log (0.2+)

## Success criteria

- Independently installable; valuable without any other `@jayoncode/*` package
- **No public API requires another `@jayoncode/*` package**
- Docs + playground demonstrate happy path before first public minor
- Brief’s non-goals still true after launch
- Leaves the ecosystem better: validated persistence patterns, docs lessons, optional composition notes for FI/BL/OD

## Acceptance

| Field       | Value                                                                   |
| ----------- | ----------------------------------------------------------------------- |
| Maintainer  | Signed off (governance + ChatGPT/Cursor refinements)                    |
| Accepted on | 2026-07-16                                                              |
| Shipped on  | 2026-07-21 (`0.1.0`); `0.2.0` async/cross-tab; `0.3.0` quota/transforms |
| Next step   | Dogfood 0.3; next ecosystem flagship TBA                                |
