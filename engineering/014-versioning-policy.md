# 014 Versioning Policy

## Why This Document Exists

This document defines the compatibility and versioning rules that every JOC package should follow.

## Semantic Versioning

JOC packages use Semantic Versioning.

### Patch

Use for backward-compatible fixes and safe internal corrections.

### Minor

Use for backward-compatible new functionality.

### Major

Use for breaking changes, removed APIs, or incompatible behavior shifts.

## Compatibility Policy

- avoid breaking changes whenever a non-breaking evolution is realistic
- do not ship breaking behavior in patch or minor releases
- document deprecations before removals when possible
- include migration notes for changes that impact consumers

## Deprecation Policy

When deprecating a public API:

- mark it clearly in documentation
- explain the replacement path
- keep behavior stable during the deprecation window when possible
- remove it only in a major release unless the API was explicitly experimental

## Long-Term Support Philosophy

JOC is not committing to formal LTS windows at this phase, but packages should be evolved with maintenance discipline rather than frequent unnecessary breaking changes.
