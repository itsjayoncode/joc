# Contributing to JOC

Thank you for considering a contribution to JOC (JayOnCode).

## Current stage

JOC is an active monorepo with **live `@jayoncode/*` packages** (browser-lifecycle, form-intelligent, object-diff), a docs site, and playgrounds. Contributions should align with the [roadmap](./ROADMAP.md) and keep public package boundaries intact.

Product-facing contributor guide: [docs — Contributing](https://itsjayoncode.github.io/joc/guides/contribution).

## How to contribute

- Improve documentation clarity; keep status docs aligned with implementation.
- Fix bugs, add tests, and harden live packages and playgrounds.
- Propose structural or API changes with clear boundary rationale (prefer an issue first).
- Improve CI reliability, blueprints, and contributor onboarding.

## Local setup

```bash
pnpm install
pnpm build
pnpm test
pnpm docs:dev
```

## Before opening significant changes

Please review:

- [README.md](./README.md)
- [ARCHITECTURE.md](./ARCHITECTURE.md)
- [VISION.md](./VISION.md)
- [ROADMAP.md](./ROADMAP.md)
- [engineering/](./engineering/)

Early alignment matters more than implementation speed for large changes.

## Contribution principles

- Prefer small, well-reasoned changes.
- Keep package boundaries explicit — no hidden cross-package coupling.
- Do not add tooling or packages ahead of blueprint + roadmap justification.
- Document architectural decisions that affect future contributors.
- Preserve independent installability of public packages.

## Pull request expectations

- Explain the motivation clearly (problem → approach).
- Keep scope aligned with one concern; avoid unrelated cleanup.
- Update affected documentation when structure or policy changes.
- Add a changeset when a publishable package changes in a user-facing way.
- Keep CI green (typecheck, lint, tests).

## Release notes and Changesets

If your pull request changes a publishable package in a way that would affect consumers, run `pnpm changeset` and choose the smallest honest SemVer bump:

- `patch` for safe fixes
- `minor` for backward-compatible new capabilities
- `major` for breaking changes

Write release notes from the package consumer's perspective. Call out breaking changes and migration work clearly.

## Package standards

Use the reusable blueprint in `templates/package-template/` and the standards documents in `engineering/008-package-architecture.md` through `engineering/016-package-checklist.md`. Production packages with real implementation are also validated by `pnpm package:blueprint`.

For package-specific public API work, read the package-local `engineering/` docs before changing contracts.

## Code of Conduct

By participating in this project, you agree to follow the standards in [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md).

## Security

Please report sensitive issues according to [SECURITY.md](./SECURITY.md).
