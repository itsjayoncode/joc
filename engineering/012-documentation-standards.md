# 012 Documentation Standards

## Why This Document Exists

This document defines the minimum documentation shape every JOC package should maintain.

## Required Package Documentation

Every package should include:

- `README.md`
- installation guidance
- quick start guidance
- API documentation
- examples
- configuration notes when applicable
- browser support notes
- FAQ when needed
- migration guidance when breaking changes occur
- `CHANGELOG.md`

## README Structure

Each package README should follow one consistent order:

1. Package purpose
2. Installation
3. Quick start
4. API overview
5. Examples
6. Configuration
7. Browser or runtime support
8. FAQ
9. Contribution notes when package-specific guidance exists

## Documentation Rules

- explain intent before edge cases
- keep examples small and realistic
- avoid marketing language for unfinished capabilities
- document limitations honestly
- synchronize README content with the docs site when package docs become public
- **enable versioned documentation archives by default** for every package that owns a `/packages/<id>/` docs section (version switcher + frozen `v{version}` snapshots) — see [`014-versioning-policy.md`](./014-versioning-policy.md#documentation-version-archives-required-by-default)

## Changelog Expectations

Changelogs should describe:

- what changed
- why it matters
- whether migration work is needed

## Example Expectations

Examples should be:

- runnable or clearly understandable
- directly tied to public API usage
- maintained alongside API changes
