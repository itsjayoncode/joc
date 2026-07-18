# Contributing to JOC

Thank you for considering a contribution to JOC (JayOnCode).

## Current stage

JOC is an active monorepo with **live `@jayoncode/*` packages** on npm:

- `@jayoncode/browser-lifecycle` (+ React / Vue / Angular / Svelte / Solid adapters)
- `@jayoncode/form-intelligence` (+ React / Vue / Angular adapters and Zod / Yup / Valibot / AJV schema adapters)
- `@jayoncode/object-diff`

Compatibility shims under `@jayoncode/form-intelligent*` re-export the new Form Intelligence names — prefer `form-intelligence*` for new work.

The docs site, versioned package archives, and interactive playgrounds ship with the product. Contributions should align with the [roadmap](./ROADMAP.md) and keep public package boundaries intact.

Product-facing guide: [docs — Contributing](https://itsjayoncode.github.io/joc/guides/contribution).

By participating, you agree to the [Code of Conduct](./CODE_OF_CONDUCT.md). Report security issues per [SECURITY.md](./SECURITY.md).

## Ways to contribute

High-impact work we welcome:

- **Documentation** — clarity, learning paths, examples that match real APIs
- **Live packages** — bug fixes, tests, adapter polish, performance, honest SemVer
- **Playgrounds** — scenarios that teach APIs without clutter
- **DX / CI** — reliability, blueprint checks, contributor onboarding
- **Proposals** — well-scoped ideas for APIs or new packages (open an issue or discussion first)

Please avoid (unless discussed with maintainers):

- New public packages that skip the package blueprint
- Cross-package coupling that forces consumers to install siblings
- Tooling churn not justified by the roadmap
- Large refactors mixed with unrelated features in one PR
- Release / publish automation changes without maintainer alignment

## Local setup

Requires **Node.js 20+** and **pnpm 10.13.1** (see `packageManager` in root `package.json`).

```bash
git clone https://github.com/itsjayoncode/joc.git
cd joc
pnpm install
pnpm build
pnpm test
pnpm docs:dev
```

Useful commands:

| Command                                      | When                                         |
| -------------------------------------------- | -------------------------------------------- |
| `pnpm validate`                              | Full CI quality pipeline before a large PR   |
| `pnpm typecheck` / `pnpm lint` / `pnpm test` | Faster local loop                            |
| `pnpm changeset`                             | User-facing changes to a publishable package |
| `pnpm --filter @jayoncode/<pkg> test`        | Package-scoped Vitest                        |
| `pnpm form-intelligence-playground:dev`      | Form Intelligence explorer                   |
| `pnpm browser-session-playground:dev`        | Browser Lifecycle explorer                   |
| `pnpm object-diff-playground:dev`            | Object Diff explorer                         |

See the root [README.md](./README.md) for repository layout and package overview.

## Before opening significant changes

Please review:

- [README.md](./README.md)
- [ARCHITECTURE.md](./ARCHITECTURE.md) (if present) / [engineering/](./engineering/)
- [VISION.md](./VISION.md)
- [ROADMAP.md](./ROADMAP.md)
- Package-local `engineering/` docs when changing public APIs

Early alignment matters more than implementation speed for large changes. Prefer an issue first when the change is structural or ambiguous.

## Contribution principles

- Prefer small, well-reasoned changes
- Keep package boundaries explicit — no hidden cross-package coupling
- Do not add tooling or packages ahead of blueprint + roadmap justification
- Document architectural decisions that affect future contributors
- Preserve independent installability of public packages
- Keep docs and playgrounds honest with the API you ship

## Pull request expectations

- Explain the motivation clearly (problem → approach)
- Keep scope aligned with one concern; avoid unrelated cleanup
- Update affected documentation when structure, policy, or public API changes
- Add a changeset when a publishable package changes in a user-facing way
- Keep CI green (typecheck, lint, tests)

Suggested checklist:

- [ ] Motivation is clear
- [ ] Scope matches one concern
- [ ] Tests cover the behavior change
- [ ] Docs / playground updated when user-facing
- [ ] `pnpm changeset` added when publishable packages are affected
- [ ] CI green

## Release notes and Changesets

If your pull request changes a publishable package in a way that would affect consumers, run `pnpm changeset` and choose the smallest honest SemVer bump:

| Bump    | Use when                                           |
| ------- | -------------------------------------------------- |
| `patch` | Safe fixes, docs-only consumer impact, corrections |
| `minor` | Backward-compatible new capabilities               |
| `major` | Breaking API or behavior                           |

Write release notes from the **package consumer’s** perspective. Call out breaking changes and migration work clearly.

Compatibility shims (`@jayoncode/form-intelligent*`) are version-aligned with their `form-intelligence*` counterparts via Changesets `fixed` groups — bump intent should stay consistent across a pair when both are affected.

Maintainers merge feature PRs first; the automated **Version Packages** PR applies bumps and (when applicable) archives docs before npm publish. Do not run `pnpm release:version` on a feature branch unless a maintainer asks you to.

## Package standards

Use the reusable blueprint in `templates/package-template/` and the standards documents in `engineering/008-package-architecture.md` through `engineering/016-package-checklist.md`. Production packages with real implementation are also validated by `pnpm package:blueprint`.

For package-specific public API work, read the package-local `engineering/` docs before changing contracts.

## Issue templates

Use the templates under [`.github/ISSUE_TEMPLATE/`](./.github/ISSUE_TEMPLATE/) for bugs, features, documentation, and package proposals.

## Code of Conduct

By participating in this project, you agree to follow the standards in [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md).

## Security

Please report sensitive issues according to [SECURITY.md](./SECURITY.md). Do not open public issues for suspected vulnerabilities.
