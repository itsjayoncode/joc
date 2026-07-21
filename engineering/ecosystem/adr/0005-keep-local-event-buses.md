# ADR-0005 — Keep Local event buses

## Status

Accepted (2026-07-16 — maintainer sign-off; no Extract / no `packages/shared`)

## Context

Browser Lifecycle ships a public-facing `TypedEventEmitter` (typed payloads, `once`, teardown). Form Intelligence uses a tiny internal `FormEventBus` (`Map` of `() => void` listeners, `clear`). Names suggest duplication; contracts do not match.

## Decision

**Keep Local** — do not extract a shared event emitter / bus.

- BL owns session event semantics.
- FI owns form notification semantics.
- Unifying would rewrite at least one public or internal API without a consumer-facing win.

## Consequences

- Healthy duplication of the _subscribe_ pattern continues.
- Composition recipes may listen to both packages’ APIs without a third event library.
- Phase 6 must not introduce a shared emitter unless both packages would actually migrate (unlikely without SemVer cost).

## Alternatives considered

- **Extract TypedEventEmitter and migrate FI** — rejected; FI’s bus is intentionally minimal.
- **Defer** — weaker than needed; semantics already diverge enough to affirm Keep Local.
