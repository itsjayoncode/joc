# ADR-0007 — Reject shared store / signals after Phase 5 audit

## Status

Accepted (2026-07-16 — maintainer sign-off; no Extract / no `packages/shared`)

## Context

ADR-0002 and ADR-0003 already default against a shared store, signals, or framework runtime. Phase 5 audited live code:

- BL: `SessionStateStore` (phase machine + frozen snapshots)
- FI: `FormStateStore` (mutable form core + subscribe/notify)
- OD: no store

Both stores share the _word_ “store,” not the contract.

## Decision

**Reject** a shared store / signals / scheduler package for the current ecosystem era.

- Affirms ADR-0002 / ADR-0003 with post-product evidence.
- Domain stores stay inside their packages.
- Revisit only under Phase 10 if multi-package _pain_ is documented (not aspiration).

## Consequences

- No `packages/shared` store layer.
- Adapters continue to bridge each package’s own subscription model (`getSnapshot` / `subscribe` where applicable).
- Matrix row for store/signals remains Reject.

## Alternatives considered

- **Defer** — too weak; audit already shows domain-specific stores with no shared semantics.
- **Extract a minimal atom/signal core** — rejected as premature platform (ADR-0003).
