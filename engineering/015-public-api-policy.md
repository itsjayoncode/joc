# 015 Public API Policy

## Why This Document Exists

This document defines how JOC classifies and evolves public-facing and non-public APIs.

## API Classifications

### Public

Anything exported from the documented public surface and intended for consumer use.

### Internal

Code used within the package or repository that is not part of the supported consumer contract.

### Experimental

APIs that are intentionally unstable and must be labeled clearly in both naming or documentation.

### Deprecated

Public APIs that still exist but are scheduled for replacement or removal.

### Private

Implementation details that should never be imported or relied upon by consumers.

## Public API Rules

- public APIs must be documented
- public APIs must be typed intentionally
- public APIs should be introduced with stable naming
- public APIs should avoid surprising side effects

## Internal API Rules

- internal APIs may change without public SemVer guarantees
- internal modules should not be exported accidentally
- internal names should still be clear and maintainable

## Experimental API Rules

- label them explicitly in documentation
- avoid presenting them as fully stable
- reevaluate them before promoting to stable public API

## API Evolution

APIs should evolve through:

- additive improvement where possible
- explicit deprecation before removal
- migration guidance for breaking changes
