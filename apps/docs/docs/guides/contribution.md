---
title: Contributing to JOC
description: How to contribute to the JayOnCode JOC Ecosystem — setup, good first contributions, PR expectations, and Changesets.
---

# Contributing

Thanks for helping build the **JOC Ecosystem**. Contributions are welcome across **docs, packages, playgrounds, and repository health** — as long as they respect package boundaries and the [roadmap](/roadmap/).

For the full project policy, also read [CONTRIBUTING.md](https://github.com/itsjayoncode/joc/blob/master/CONTRIBUTING.md) on GitHub.

## Quick start (local)

```bash
git clone https://github.com/itsjayoncode/joc.git
cd joc
pnpm install
pnpm build
pnpm test
pnpm docs:dev          # docs + playgrounds
```

Useful follow-ups:

| Command                               | When                                         |
| ------------------------------------- | -------------------------------------------- |
| `pnpm lint` / `pnpm typecheck`        | Before opening a PR                          |
| `pnpm changeset`                      | User-facing changes to a publishable package |
| `pnpm --filter @jayoncode/<pkg> test` | Package-scoped Vitest                        |

See [Installation](/getting-started/installation) and [Monorepo guide](/guides/monorepo) for workspace details.

## Good contributions right now

High-impact, welcome work:

- **Docs** — clarity, learning paths, examples that match real APIs
- **Live packages** — bug fixes, tests, adapter polish, performance
- **Playgrounds** — scenarios that teach APIs without clutter
- **DX** — CI reliability, blueprint checks, contributor onboarding
- **Proposals** — well-scoped RFCs for new packages or APIs (discussion first)

## Please avoid (unless discussed)

- New public packages that skip the [package blueprint](/guides/package-standards)
- Cross-package coupling that forces consumers to install siblings
- Tooling churn not justified by the [roadmap](/roadmap/)
- Large refactors mixed with unrelated features in one PR
- Publishing/release changes without maintainer alignment

## Before a significant PR

Read enough context to stay aligned:

1. [Introduction](/getting-started/introduction) & [Philosophy](/getting-started/philosophy)
2. [Architecture](/guides/architecture) and [VISION.md](https://github.com/itsjayoncode/joc/blob/master/VISION.md)
3. Package-local `engineering/` docs when touching public APIs
4. Open an issue if the change is large or ambiguous

## Pull request checklist

- [ ] Motivation is clear (problem → approach)
- [ ] Scope matches one concern; no drive-by cleanups
- [ ] Tests cover the behavior change
- [ ] Docs / playground updated when user-facing
- [ ] `pnpm changeset` added for publishable package impact
- [ ] CI green (typecheck, lint, tests)

### Changesets (SemVer)

| Bump    | Use when                                           |
| ------- | -------------------------------------------------- |
| `patch` | Fixes, docs-only consumer impact, safe corrections |
| `minor` | Backward-compatible new capabilities               |
| `major` | Breaking API or behavior                           |

Write notes from the **consumer’s** perspective.

## Package standards

New or heavily changed packages should follow:

- `templates/package-template/`
- [Package standards](/guides/package-standards)
- `pnpm package:blueprint` where applicable

## Code of conduct & security

- [Code of Conduct](https://github.com/itsjayoncode/joc/blob/master/CODE_OF_CONDUCT.md)
- Report vulnerabilities via [SECURITY.md](https://github.com/itsjayoncode/joc/blob/master/SECURITY.md) — not public issues

## Questions?

- [GitHub Discussions](https://github.com/itsjayoncode/joc/discussions)
- [Issues](https://github.com/itsjayoncode/joc/issues)
- [Roadmap](/roadmap/) — what’s in focus this season
