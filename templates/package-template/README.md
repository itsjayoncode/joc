# `@joc/package-name`

This template is the standard starting point for every future public JOC package.

## Purpose

Every package should be:

- small
- focused
- independently installable
- tree-shakeable
- framework agnostic where possible
- strongly typed

## Standard Structure

```text
package-name/
├── src/
│   ├── core/
│   ├── types/
│   ├── utils/
│   ├── constants/
│   ├── errors/
│   ├── plugins/
│   ├── index.ts
│   └── package-name.ts
├── tests/
│   ├── unit/
│   ├── integration/
│   ├── fixtures/
│   └── helpers/
├── examples/
├── docs/
├── package.json
├── README.md
├── CHANGELOG.md
├── tsconfig.json
└── LICENSE
```

## Folder Responsibilities

- `src/core/` contains the main implementation units for the package.
- `src/types/` contains public and internal TypeScript type definitions.
- `src/utils/` contains focused helpers that support the package core.
- `src/constants/` contains stable internal constants and shared literals.
- `src/errors/` contains package-specific error types and error helpers.
- `src/plugins/` contains optional extension points when a package supports composition through plugins or adapters.
- `tests/unit/` contains focused tests for isolated behavior.
- `tests/integration/` contains multi-module or environment-level tests when the package needs them.
- `tests/fixtures/` contains deterministic inputs and snapshots for tests.
- `tests/helpers/` contains test-only setup and utilities.
- `examples/` contains runnable or documented examples once the package has real behavior.
- `docs/` contains package-specific long-form documentation that complements the repository docs site.

## Implementation Expectations

- `src/index.ts` is the public export surface.
- `src/package-name.ts` is the primary package module when a central entry is useful.
- use named exports for public APIs
- avoid default exports
- prefer explicit, readable APIs over highly flexible configuration layers

## Testing Expectations

- every package should include unit tests
- integration tests are required when multiple modules or environments interact
- examples should be validated before release

## Documentation Expectations

Every package should ship with:

- installation guidance
- quick start documentation
- API coverage
- examples
- browser support notes
- migration notes when needed

## Release Expectations

- version changes are driven by Changesets
- changelog entries should describe user impact
- breaking changes require a major version and migration guidance
