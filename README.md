# JOC

JOC, short for JayOnCode, is the home of a growing ecosystem of focused JavaScript and TypeScript libraries designed to stay practical, composable, and maintainable over time.

## Mission

Build a professional open source ecosystem of independently installable packages that solve real engineering problems without turning the repository into a loose collection of unrelated code.

## Goals

- Establish a strong monorepo foundation before package implementation begins.
- Keep packages modular, focused, and easy to adopt independently.
- Favor long-term maintainability over short-term convenience.
- Create a contributor-friendly repository from the first public commit.

## Project Philosophy

- Foundation first: repository architecture comes before feature code.
- Package independence: public packages should not require one another.
- Internal reuse stays internal: shared utilities belong in internal workspace packages.
- Clear boundaries: apps, packages, examples, templates, and engineering guidance each have a defined role.
- Open source readiness: documentation and repository organization matter from day one.

## Current Status

JOC is currently in Phase 1.6: Package Engineering Standards. The repository now includes the monorepo scaffold, shared developer tooling, engineering automation, the developer experience platform, release engineering preparation, and the package blueprint that future libraries must inherit. No public library implementations have been released yet.

## Package Engineering Standards

JOC now includes:

- a reusable package template in `templates/package-template`
- package architecture and API guidance in `engineering/008-*` through `engineering/016-*`
- testing, documentation, naming, export, and versioning standards for every future package
- a package blueprint validation step in the repository quality pipeline

This phase establishes one engineering model for all future JOC packages before the first production package is implemented.

## Engineering Automation

JOC now includes repository-wide automation for:

- Continuous integration on protected branches
- Pull request validation with quality gates
- Scheduled repository health checks
- Local coverage generation and artifact upload in CI
- CodeQL scanning for JavaScript and TypeScript
- Dependabot preparation for npm and GitHub Actions updates

The shared quality workflow validates workspace health, TypeScript, ESLint, Prettier, Vitest coverage, typed package builds, and package metadata integrity.

## Quality Gates

Every automation run is designed to answer these questions before code moves forward:

- Does the workspace install correctly?
- Does the repository typecheck?
- Does linting pass?
- Does formatting remain consistent?
- Do tests pass with coverage output?
- Do the typed packages build?
- Do package manifests and bootstrap files remain healthy?

## Roadmap

The initial milestones are:

1. Phase 1.1: Repository Foundation
2. Phase 1.2: Developer Tooling Foundation
3. Phase 1.3: Engineering Automation
4. Phase 1.4: Developer Experience Platform
5. Phase 1.5: Release Engineering
6. Phase 1.6: Package Engineering Standards
7. Phase 2: Browser Lifecycle Manager v1

See [ROADMAP.md](file:///Users/denmarkjaymago/Projects/@jay/joc/ROADMAP.md) for the expanded milestone plan.

## Repository Structure

```text
joc/
├── apps/
├── packages/
├── examples/
├── templates/
├── engineering/
├── scripts/
├── .cursor/
├── .github/
└── package.json
```

- `apps/` holds future first-party applications such as docs, website, and playground.
- `apps/docs/` contains the VitePress documentation platform.
- `apps/playground/` contains the local package exploration workbench.
- `packages/` holds independently installable JOC libraries plus internal shared workspace code.
- `examples/` will contain practical usage references once packages exist.
- `examples/` now includes structured placeholders for future usage examples.
- `templates/` will contain starter templates for consumers and contributors.
- `templates/package-template/` contains the baseline structure every future JOC package should inherit.
- `engineering/` documents architecture, package policy, and roadmap decisions.
- `scripts/` contains repository health and integrity checks that support local development and CI.

## Future Packages

The first planned package set includes:

- `browser-lifecycle`
- `request`
- `scroll`
- `keyboard`
- `responsive`
- `theme`
- `forms`
- `layers`
- `object-diff`
- `audit`
- `permissions`
- `workflow`
- `queue`
- `cache`
- `config`
- `logger`
- `doctor`

The internal workspace package `shared` is reserved for non-public shared code.

## Contribution Guide

JOC welcomes early contributors who want to help shape the ecosystem responsibly. Start with [CONTRIBUTING.md](file:///Users/denmarkjaymago/Projects/@jay/joc/CONTRIBUTING.md), review the architecture docs in [engineering/](file:///Users/denmarkjaymago/Projects/@jay/joc/engineering), and check the milestone plan in [ROADMAP.md](file:///Users/denmarkjaymago/Projects/@jay/joc/ROADMAP.md).

## Local DX Commands

```bash
npx pnpm@10.13.1 docs:dev
npx pnpm@10.13.1 docs:build
npx pnpm@10.13.1 playground:dev
npx pnpm@10.13.1 playground:build
```

## Release Commands

```bash
npx pnpm@10.13.1 changeset
npx pnpm@10.13.1 changeset:status
npx pnpm@10.13.1 release:version
npx pnpm@10.13.1 release
npx pnpm@10.13.1 release:publish
```

## Package Blueprint Commands

```bash
npx pnpm@10.13.1 package:blueprint
```

## Planned Badges

README badge placement is now reserved for the first public GitHub push and initial package release. The intended badge set is:

- CI status from `.github/workflows/ci.yml`
- Coverage status from generated coverage reporting
- License status
- npm version for the first released package
- npm downloads after public publication

Until the public repository and packages are live, JOC documents the badge plan without embedding broken or unavailable badge URLs.

## License

JOC is released under the MIT License. See [LICENSE](file:///Users/denmarkjaymago/Projects/@jay/joc/LICENSE).
