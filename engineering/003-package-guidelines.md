# 003 Package Guidelines

## Why This Document Exists

This document defines the early package rules that help the ecosystem stay coherent as new libraries are introduced.

## Package Standards

- Every package should have a focused responsibility.
- Public packages should be installable without requiring another public JOC package.
- Shared internal concerns belong in `packages/shared`.
- Package names should be descriptive, stable, and ecosystem-friendly.
- Documentation should ship alongside package creation, not as an afterthought.

## Bootstrap Expectations

At minimum, each package should begin with:

- `README.md`
- `package.json`
- `src/`

Additional tooling, exports, tests, and build artifacts should be added only when the roadmap phase calls for them.

## Long-Term Maintenance Rule

Adding a package is not only a feature decision. It is a long-term maintenance commitment and should be treated that way.
