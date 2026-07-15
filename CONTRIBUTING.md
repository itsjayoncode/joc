# Contributing to JOC

Thank you for considering a contribution to JOC.

## Current Stage

JOC has completed Phase 1 and Phase 3 playground release (v1.0.0). `@jayoncode/browser-lifecycle` is at v0.1.0 and ready for npm publication. Contributions should align with the current milestone described in [ROADMAP.md](./ROADMAP.md).

## How to Contribute Right Now

- Improve documentation clarity and keep status docs aligned with implementation progress.
- Help implement and test Browser Lifecycle modules and playground pages.
- Propose structural or architectural refinements with clear package-boundary rationale.
- Review engineering guidance for contributor usability.

## Before Opening Significant Changes

Please review:

- [README.md](file:///Users/denmarkjaymago/Projects/@jay/joc/README.md)
- [ARCHITECTURE.md](file:///Users/denmarkjaymago/Projects/@jay/joc/ARCHITECTURE.md)
- [VISION.md](file:///Users/denmarkjaymago/Projects/@jay/joc/VISION.md)
- [engineering/](file:///Users/denmarkjaymago/Projects/@jay/joc/engineering)

Early alignment matters more than implementation speed at this stage.

## Contribution Principles

- Prefer small, well-reasoned changes.
- Keep package boundaries explicit.
- Do not add tooling or feature code ahead of the active milestone.
- Document architectural decisions when they affect future contributors.
- Preserve the independence of public packages.

## Pull Request Expectations

- Explain the motivation clearly.
- Keep scope aligned with the current roadmap phase.
- Update affected documentation when repository structure or policy changes.
- Avoid introducing unrelated cleanup in the same change.
- Add a changeset when a publishable package changes in a user-facing way.

## Release Notes and Changesets

If your pull request changes a future publishable package in a way that would affect consumers, run `pnpm changeset` and choose the smallest honest SemVer bump:

- `patch` for safe fixes
- `minor` for backward-compatible new capabilities
- `major` for breaking changes

Write release notes from the package consumer's perspective. Call out breaking changes and migration work clearly.

## Package Standards

Use the reusable blueprint in `templates/package-template/` and the standards documents in `engineering/008-package-architecture.md` through `engineering/016-package-checklist.md`. Production packages with real implementation are also validated by `pnpm package:blueprint`.

For Browser Lifecycle work, read the package-local engineering docs in `packages/browser-lifecycle/engineering/` before changing public APIs.

## Code of Conduct

By participating in this project, you agree to follow the standards in [CODE_OF_CONDUCT.md](file:///Users/denmarkjaymago/Projects/@jay/joc/CODE_OF_CONDUCT.md).

## Security

Please report sensitive issues according to [SECURITY.md](file:///Users/denmarkjaymago/Projects/@jay/joc/SECURITY.md).
