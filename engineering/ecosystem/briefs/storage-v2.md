# Package brief (v2) — `@jayoncode/storage` quota + transforms

**Status:** **Accepted**  
**Package:** `@jayoncode/storage` (same package; not a new flagship)  
**Depends on:** Product Maturation of the shipped surface — see [storage.md](./storage.md)  
**SemVer stance:** Prefer additive `0.x` / `1.x` minors. Breaking sync `createStorage` only if this brief requires an explicit major.  
**Constraint:** No JOC-wide plugin host / shared runtime (Phase 10 Closed). Transforms stay **package-local**.  
**Shipped in:** `@jayoncode/storage@0.3.0` — `/quota` + `/transforms` (sync-first)

See [governance.md](../governance.md) · live brief [storage.md](./storage.md).

---

## Problem

Shipped Storage covers namespaced envelopes, TTL, migrate, sync Web Storage adapters, async IndexedDB, and cross-tab **notify**. Two gaps remain for serious client persistence:

1. **Quota** — Lab can simulate `QuotaExceededError`, and diagnostics report `approxBytes`, but apps lack productized soft limits, warnings, and honest pre-write guidance when the browser cannot expose remaining quota.
2. **Payload transforms** — teams need optional compression and/or encryption-at-rest without forking the core factory or inventing a silent “secure mode.”

## Audience

Same as [storage.md](./storage.md): SPA/PWA authors and headless library authors who already use `@jayoncode/storage` and need quota awareness or explicit transform hooks without coupling to other `@jayoncode/*` packages.

## Alternatives

| Option                       | Gap                                                         |
| ---------------------------- | ----------------------------------------------------------- |
| Keep Lab quota sim only      | Does not help production apps manage size or fail softly    |
| App-only wrap of `set`/`get` | Easy to get wrong (TTL, migrate, envelopes, async path)     |
| Full encrypted DB products   | Heavy; different trust model; not JOC’s docs/playground bar |
| JOC shared plugin host       | Forbidden while Phase 10 is Closed; not earned              |

## Why JOC?

Extend the **same** policy-driven Storage product: envelopes, adapters, and docs/playground standards — with **explicit**, opt-in quota helpers and transform hooks — rather than a second persistence package or a platform plugin runtime.

## Relationship with existing packages

Unchanged from [storage.md](./storage.md): **no** dependency on Browser Lifecycle, Form Intelligence, or Object Diff. Compose in app code only.

Encryption keys and compression codecs stay **app-owned** (or third-party libs the app chooses). Storage does not ship a key vault.

## Non-goals

- Exact browser “bytes remaining” when the platform cannot provide it
- Silent encryption or compression defaults
- JOC-wide plugin host / shared runtime / signals store
- Auto-merge of cross-tab remote values (still rejected; notify-only stays)
- Replacing Form Intelligence draft IndexedDB (`jayoncode-form-intelligent-drafts`)
- Requiring another `@jayoncode/*` package
- Async ports of `/maintenance`, `/snapshots`, `/transactions`, `/observable`, `/quota`, `/transforms` (deferred)

## Design principles

- Explicit over implicit — transforms and quota policies are opt-in
- Package-local hooks — not a cross-package plugin platform
- Same envelopes / TTL / migrate story; transforms wrap at the persistence edge
- Prefer additive SemVer; document any break in an Accepted major
- Honesty in diagnostics — approximate sizes and soft limits, not fake precision
- XSS trust boundary unchanged — in-origin script can still reach keys and plaintext if the app mishandles key material

## Scope (Accepted for 0.3)

### Quota — `@jayoncode/storage/quota`

- `estimateNamespaceBytes(storage)` — sum of raw string lengths (not remaining browser quota)
- `enableQuotaGuard(storage, { maxApproxBytes, warnAtRatio?, onWarn?, mode? })` — soft ceiling on `set`; `QuotaExceededError` when `mode: "throw"` (default)

### Transforms — `@jayoncode/storage/transforms`

- `withPayloadTransforms(base, { compress?, decompress?, encrypt?, decrypt? })`
- Pipeline: serialize → compress? → encrypt? (reverse on read)
- Sync `string → string` hooks; pair required; defaults plaintext
- Compose via existing `serialize` / `deserialize` options (`defaultSerialize` / `defaultDeserialize` exported from root)

### Out of scope (later)

| Item                                                                                    | Notes                        |
| --------------------------------------------------------------------------------------- | ---------------------------- |
| Async ports of maintenance / snapshots / transactions / observable / quota / transforms | Follow-on                    |
| Cross-tab auto-merge                                                                    | Rejected                     |
| Bundled crypto/compression libraries                                                    | App-supplied transforms only |

## SemVer

| Preference   | Rule                                                           |
| ------------ | -------------------------------------------------------------- |
| Default      | Additive minors on `0.x` / `1.x`                               |
| This release | `0.3.0` minor — no break of sync `createStorage`               |
| Major        | Only if a future Accepted revision requires breaking contracts |

## Playground plan

- Soft max-bytes via `enableQuotaGuard` alongside Lab quota **sim** (hard failure path)
- Optional reversible demo codec (e.g. base64) — clearly not real crypto
- IndexedDB remains on `/async`

## Success criteria

- Quota helpers improve real apps without lying about browser remaining space
- Transforms are opt-in, documented, and testable; defaults stay plaintext
- No `@jayoncode/*` dependency; Phase 10 stays Closed
- Live brief non-goals for independence and FI boundary remain true
- Docs + Lab updated in the same change set as the public API (per docs-keep-in-sync)

## Acceptance

| Field          | Value                                                                |
| -------------- | -------------------------------------------------------------------- |
| Status         | **Accepted**                                                         |
| Accepted on    | 2026-07-22                                                           |
| Implemented in | `@jayoncode/storage@0.3.0` (`/quota`, `/transforms`)                 |
| Next step      | Dogfood 0.3; async capability ports TBA; next ecosystem flagship TBA |
