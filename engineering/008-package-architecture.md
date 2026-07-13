# 008 Package Architecture

## Why This Document Exists

This document defines the standard architecture that every future JOC package must follow so the ecosystem stays coherent as package count grows.

## Core Rule

Every JOC package should solve one problem well. Package structure exists to reinforce that rule, not to add ceremony.

## Standard Package Layout

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

### `src/core/`

Contains the primary implementation units and package behavior. Code in this folder should represent the main purpose of the package.

### `src/types/`

Contains exported and internal types. Public types should be easy to discover and intentionally named.

### `src/utils/`

Contains focused helpers that support the package core. Helpers should not become a dumping ground for unrelated logic.

### `src/constants/`

Contains stable internal constants, default values, and shared literals that should not be duplicated across the package.

### `src/errors/`

Contains package-specific error types and helpers for predictable error handling.

### `src/plugins/`

Contains adapters or extension points when the package supports optional composition. If a package does not need plugins, this folder may stay empty until required.

### `src/index.ts`

Defines the public export surface. This file should be treated as the package contract.

### `src/package-name.ts`

Contains the main package module when a central module improves clarity. Not every package will need much code here, but the file should exist so entry structure stays predictable.

### `tests/unit/`

Contains isolated tests for pure or narrowly scoped behavior.

### `tests/integration/`

Contains tests that validate module interaction, environment behavior, or adapter composition.

### `tests/fixtures/`

Contains deterministic sample inputs, snapshots, or reusable test assets.

### `tests/helpers/`

Contains test-only utilities that should never leak into public runtime code.

### `examples/`

Contains practical package examples once behavior exists.

### `docs/`

Contains package-specific long-form documentation that complements repository-level docs.

## Required Top-Level Files

- `package.json` for metadata and publish configuration
- `README.md` for package onboarding
- `CHANGELOG.md` for package-level release history
- `tsconfig.json` for package compiler configuration
- `LICENSE` so each package remains distribution-ready

## Architectural Rules

- keep runtime dependencies to a minimum
- keep public entrypoints explicit
- avoid deep folder nesting beyond what the standard layout already provides
- prefer adding files to the defined structure over creating one-off folders
- do not expose internal folders as part of the public API without a deliberate policy decision
