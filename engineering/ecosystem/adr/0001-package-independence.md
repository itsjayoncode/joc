# ADR-0001 — Package independence

## Status

Accepted

## Context

JOC ships multiple `@jayoncode/*` libraries. Contributors may be tempted to couple packages (hard dependencies, shared public facades, or “install everything”) for convenience.

## Decision

Public JOC packages remain **independently installable**. An application may depend on one package alone and receive real value. Cross-package use is **composition in the app** (or optional peers), not a required monorepo runtime.

## Consequences

- Docs and playgrounds must teach each package on its own merits
- Composition guides show wiring without creating a meta-package
- Shared code, if any, stays internal (`packages/shared`) and must not force public package coupling

## Alternatives considered

- Meta-package `@jayoncode/ecosystem` that re-exports everything — rejected as default; optional later only with clear SemVer story
- Hard runtime dependency between Form Intelligence and Browser Lifecycle — rejected; compose in app code instead
