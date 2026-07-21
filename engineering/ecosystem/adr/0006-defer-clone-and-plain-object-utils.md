# ADR-0006 — Defer cloneValue / isPlainObject utils

## Status

Accepted (2026-07-16 — maintainer sign-off; no Extract / no `packages/shared`)

## Context

Form Intelligence and Object Diff both implement `cloneValue` (`structuredClone` with JSON fallback) and a prototype-based `isPlainObject`. Browser Lifecycle has a looser private plain-object check and does not share `cloneValue`.

This is the clearest _utility_ overlap in the monorepo today.

## Decision

**Defer** extraction to shared infrastructure.

- Keep copies in FI and OD until a **third** consumer appears or the implementations drift painfully.
- Do **not** unify BL’s helper into the same shared util without proving identical semantics.
- If Extract is ever Accepted, prefer a **private** monorepo module (ADR-0002) — not a public `@jayoncode/utils` product.

## Consequences

- Tiny duplication remains intentional.
- Object Diff stays the deep-compare product; cloning helpers stay implementation details.
- Phase 6 does not start from this candidate alone.

## Alternatives considered

- **Extract now** — rejected; two small helpers do not justify shared package overhead yet.
- **Keep Local forever** — possible later; Defer leaves the door open without acting.
