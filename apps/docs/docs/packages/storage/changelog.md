---
title: Changelog
description: "Release history for @jayoncode/storage."
---

# Changelog

## 0.4.1

### Patch Changes

- fc1705e: Object Diff: LCS array move detection, identity-aware merge, and DiffView `explain()`. Form Intelligence and Storage: align npm package messaging with the JOC ecosystem briefs.

## 0.4.0

### Minor Changes

- d4fee84: Add soft quota guards (`/quota`) and package-local payload transforms (`/transforms`) for sync storage.

## 0.3.0

### Minor Changes

- 453cb4f: Add async IndexedDB track (`/async`) and cross-tab notify helpers (`/cross-tab`) without changing sync `createStorage`.

All notable changes to `@jayoncode/storage` will be documented in this file.

## 0.3.0

### Added

- `@jayoncode/storage/quota` — `estimateNamespaceBytes`, `enableQuotaGuard` (soft limits via approx bytes)
- `@jayoncode/storage/transforms` — `withPayloadTransforms` (opt-in sync compress/encrypt hooks)
- Root exports `defaultSerialize` / `defaultDeserialize` for transform composition

## 0.2.0

### Added

- `@jayoncode/storage/async` — `createAsyncStorage`, `createMemoryAsyncAdapter`, `createIndexedDbAdapter` (default DB `jayoncode-storage`)
- `@jayoncode/storage/cross-tab` — `enableCrossTabSync` (BroadcastChannel + optional `storage` event; notify-only)

## 0.1.0

### Added

- First public release (`private: false`)
- Core `createStorage` API: envelopes, TTL, migrate, peek/has/clear, explicit adapters
- Policies (ttl-only): `policies`, `definePolicy`, `set(..., { policy })`
- Typed errors + `isQuotaExceededError`
- Stable subpaths:
  - `@jayoncode/storage/maintenance` (`cleanup`)
  - `@jayoncode/storage/snapshots` (`snapshot` / `restore`)
  - `@jayoncode/storage/observable` (`observe` / `watch` / `on`)
  - `@jayoncode/storage/diagnostics` (`createDiagnostics`)
  - `@jayoncode/storage/transactions` (`transaction`)
- Docs site package section + Storage playground Lab

### Fixed

- P0: `has` uses peek (no migrate); `clear` requires `keys`; finite `expiresAt` validation

## 0.0.0

- Private incubation (pre-release).

