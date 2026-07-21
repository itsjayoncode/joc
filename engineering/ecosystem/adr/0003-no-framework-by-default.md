# ADR-0003 — No framework by default

## Status

Accepted

## Context

Ecosystem roadmaps often end in “become a framework.” JOC’s published vision is a toolkit of headless libraries, not a monolith.

## Decision

JOC does **not** pursue a unified framework, shared app runtime, or mandatory developer entry point by default.

A shared runtime, plugin system, or unified CLI/product entry point may only emerge from **demonstrated ecosystem needs** (Phase 10), captured in a new ADR — never from roadmap aspiration alone.

**Composition without coupling** remains the brand of the ecosystem.

## Consequences

- Phase 10 is optional; never running it is success
- Generators (Phase 7) are maintainer tooling, not a “JOC Framework” product unless explicitly promoted later
- `VISION.md` must be revisited before any framework-shaped north star change

## Alternatives considered

- Market JOC as a full-stack frontend framework now — rejected; conflicts with independence and current package set
- Force identical APIs (`snapshot()` everywhere) to look like a framework — rejected; use patterns, not identical method names
