# ADR-0002 — Shared infrastructure policy

## Status

Accepted

## Context

After three live packages, it is tempting to extract a large shared “core” (events, store, signals, plugin runtime) before knowing what is actually duplicated.

## Decision

1. **Do not extract by aspiration.** Shared code requires a Phase 5 (Architecture Convergence) decision of **Extract**, with rationale (matrix + ADR when non-trivial).
2. **Default outcomes** for unclear cases: **Keep Local** or **Defer**.
3. **`packages/shared`** (when created) holds only evidence-validated internals (e.g. errors, events, types, utils) — not a public product brand.
4. **Internal modules are implementation details.** Publishing them requires a **separate** architectural decision and is **not** the default.

## Consequences

- Phase 6 is _selective_ shared infrastructure, not “build Core”
- Duplication may remain intentional (healthy package boundaries)
- Signals / store / scheduler / plugin-runtime stay out until Phase 10 pain is documented (Phase 10 is currently **Closed**)

## Alternatives considered

- Big-bang `packages/core` with store + signals — rejected as premature platform
- Publishing `@jayoncode/shared` on day one — rejected; stay private/unpublished until proven
