# 001 Repository Foundation

## Why This Document Exists

This document explains the structural choices made in Phase 1.1 so the repository scaffold remains intentional as the ecosystem grows.

## Foundation Decisions

### Monorepo from Day One

JOC uses pnpm workspaces and Turborepo immediately so package layout, future tooling, and contributor expectations all begin from a consistent operating model.

### Clear Directory Responsibilities

- `apps/` contains first-party applications.
- `packages/` contains publishable libraries and internal shared code.
- `engineering/` contains architecture and policy documents.
- `examples/` and `templates/` are reserved for future adoption support.
- `scripts/` is reserved for repository automation introduced later.

### Internal Shared Workspace

`packages/shared` is explicitly internal. It exists to prevent public package coupling while still allowing maintainers to centralize low-level internal building blocks when that becomes necessary.

### Documentation First

The repository foundation includes public-facing governance and architecture documents because open source maintainability starts with clarity, not just code.
