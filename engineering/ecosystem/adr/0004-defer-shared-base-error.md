# ADR-0004 — Defer shared base error type

## Status

Accepted (2026-07-16 — maintainer sign-off; no Extract / no `packages/shared`)

## Context

Browser Lifecycle, Form Intelligence, and Object Diff each expose a base error with the same _shape_:

- extends `Error`
- `code` (package-specific union)
- optional `details` / `cause`
- package-named subclasses (including `PluginError`)

Phase 5 temptation: extract `@jayoncode/shared` `BaseError` immediately.

## Decision

**Defer** extraction of a shared base error type.

- Keep package-owned public error names and codes (`BrowserLifecycleError`, `FormIntelligentError`, `ObjectDiffError`, …).
- Do **not** force consumers onto a cross-package error superclass in this era.
- Revisit only if a fourth package repeats the pattern _and_ maintainers want a **private** shared base (publishing still requires a separate decision per ADR-0002).

## Consequences

- Intentional duplication of a small error hierarchy remains acceptable.
- Phase 6 stays blocked for this candidate until the matrix row flips to Extract with Accepted ADR.
- SemVer surfaces stay independent.

## Alternatives considered

- **Extract now** — rejected; three packages ≠ proof that a shared base is worth versioning and coupling.
- **Reject forever** — too strong; the pattern is real and may earn a private helper later.
