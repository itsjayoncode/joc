# Architecture Overview

JOC is designed as a monorepo that can support many independently installable packages without turning shared code into accidental package coupling.

## Why a Monorepo

- Repository-wide standards can be defined once.
- Package relationships remain visible and intentional.
- Contributor onboarding is simpler when architecture lives in one place.
- Docs, examples, templates, and future apps can evolve beside the packages they support.

## Core Structure

- `apps/` contains first-party applications.
- `packages/` contains public libraries and internal shared workspace code.
- `engineering/` contains the written operating model for the repository.
- `examples/` and `templates/` support adoption after packages begin shipping.

## Package Independence

Public JOC packages are expected to remain independently installable. Shared code that would otherwise create package-to-package dependency chains belongs in `packages/shared`, which is internal only.

## Internal Shared Package

`packages/shared` exists to hold non-public building blocks such as shared types, errors, internal utilities, constants, and low-level primitives needed across multiple packages in the future.

## Tooling Strategy

The repository is bootstrapped with pnpm workspaces and Turborepo, and now includes shared TypeScript, ESLint, Prettier, Vitest, and GitHub Actions automation so every package can inherit the same engineering baseline.

## Engineering Automation

JOC treats engineering automation as part of repository architecture, not as an afterthought.

- GitHub Actions runs a reusable quality workflow for CI and pull request validation.
- Coverage is generated locally with Vitest and uploaded as a CI artifact.
- Repository health and package integrity checks live in `scripts/` so local and remote validation share the same logic.
- CodeQL and Dependabot are configured at the repository level to support secure, long-term maintenance.

This keeps the monorepo lightweight while still giving contributors clear, automated feedback.

## Developer Experience Layer

The repository includes three first-party applications that support ecosystem understanding without introducing package feature logic into apps:

- `apps/docs` for documentation, navigation, package templates, and contributor orientation
- `apps/playground` for quick local workspace package exploration and bootstrap validation
- `apps/browser-session-playground` for long-lived Browser Lifecycle manual QA, module integration, and future interactive documentation

`apps/website` remains reserved for the future public project presence.

This layer is intentionally lightweight. It adds documentation and experimentation surfaces without changing the package boundaries established earlier.

## Naming and Scopes

JOC uses a single npm scope for all workspace packages and applications:

- `@jayoncode/*` for public packages, private apps, and internal workspace packages (for example `@jayoncode/browser-lifecycle`, `@jayoncode/browser-session-playground`, and `@jayoncode/shared`)

Private workspace members remain marked `"private": true` in `package.json` even when they use the `@jayoncode` scope.

Construction documents under `_constuction/` may still refer to "Browser Session" as the product label from early Phase 2 planning. That label maps to the `browser-lifecycle` package unless an explicit rename is approved later.

## Turborepo

`turbo.json` defines the future task graph for builds, tests, and linting. Root scripts currently invoke pnpm and TypeScript directly for simplicity during early package development. Adopt `turbo run` when caching across many packages becomes worthwhile.

## Future Release Strategy

Release engineering is now prepared through Changesets and a dedicated release workflow, while real npm publication remains intentionally disabled until packages are implementation-ready.

## Release Architecture

JOC uses an independent package versioning model. The repository-level release system is designed around:

- Changesets for package-scoped release intent
- generated changelog preparation
- release pull requests as the human review checkpoint
- draft GitHub releases before any future npm publication

This keeps release automation scalable without turning the repository into a fully automated publish system before it is ready.

## Package Engineering Standards

The repository now includes a formal package blueprint so package implementation does not start from a blank slate.

That blueprint defines:

- one standard folder structure
- one export model
- one testing strategy
- one documentation shape
- one versioning and API-evolution policy

This is the bridge between repository setup and production packages. `@jayoncode/browser-lifecycle` is the first package implementing that blueprint, with domain-specific folder layout documented in `packages/browser-lifecycle/engineering/008-folder-architecture.md`.
