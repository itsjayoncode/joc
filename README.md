# JOC — JayOnCode TypeScript Libraries

[![npm](https://img.shields.io/npm/v/@jayoncode/browser-lifecycle.svg)](https://www.npmjs.com/package/@jayoncode/browser-lifecycle)
[![docs](https://img.shields.io/badge/docs-itsjayoncode.github.io-2563eb)](https://itsjayoncode.github.io/joc/)
[![CI](https://github.com/itsjayoncode/joc/actions/workflows/ci.yml/badge.svg)](https://github.com/itsjayoncode/joc/actions/workflows/ci.yml)
[![license](https://img.shields.io/github/license/itsjayoncode/joc)](https://github.com/itsjayoncode/joc/blob/master/LICENSE)

**JOC** (JayOnCode) is an open source monorepo of focused, independently installable **TypeScript browser libraries**. Each `@jayoncode/*` package solves one problem well, ships on its own version line, and documents under its own section on the [official docs site](https://itsjayoncode.github.io/joc/).

The first published package is [`@jayoncode/browser-lifecycle`](https://www.npmjs.com/package/@jayoncode/browser-lifecycle) — a framework-agnostic, SSR-safe session lifecycle manager for page visibility, focus, connectivity, idle detection, cross-tab coordination, and plugin diagnostics.

```bash
npm install @jayoncode/browser-lifecycle
```

```ts
import { createBrowserLifecycle } from "@jayoncode/browser-lifecycle";

const lifecycle = createBrowserLifecycle({ autoStart: true });

lifecycle.on("visibility:change", (event) => {
  console.log(event.state);
});
```

## Links

| Resource               | URL                                                            |
| ---------------------- | -------------------------------------------------------------- |
| Documentation          | https://itsjayoncode.github.io/joc/                            |
| Browser Lifecycle docs | https://itsjayoncode.github.io/joc/packages/browser-lifecycle/ |
| Interactive playground | https://itsjayoncode.github.io/joc/playground/                 |
| npm scope              | https://www.npmjs.com/~jayoncode                               |
| Repository             | https://github.com/itsjayoncode/joc                            |

## What ships today

| Area                           | Status                                                                   |
| ------------------------------ | ------------------------------------------------------------------------ |
| `@jayoncode/browser-lifecycle` | Published on npm (v0.1.2)                                                |
| Documentation site             | VitePress on GitHub Pages — guides, API reference, patterns, FAQs        |
| Browser Session Playground     | Interactive module explorers and deployment guides                       |
| Monorepo tooling               | pnpm workspaces, TypeScript project references, Vitest, ESLint, Prettier |
| CI & release engineering       | Quality gates, Changesets, independent package versioning                |

Additional packages (`request`, `scroll`, `theme`, and others) are scaffolded in the monorepo and documented as planned work. Only `@jayoncode/browser-lifecycle` is published to npm today.

## Documentation versioning

Package docs support **latest** and **archived** URLs so users can reference older releases after breaking changes.

| Route                                 | Meaning                                    |
| ------------------------------------- | ------------------------------------------ |
| `/packages/browser-lifecycle/`        | Latest documentation (current npm version) |
| `/packages/browser-lifecycle/v0.1.2/` | Frozen snapshot for that release           |

Archives are stored under `apps/docs/archives/` and staged into the site at build time. A version switcher appears on Browser Lifecycle pages.

**Day to day** — edit docs as usual; CI runs `pnpm docs:prepare` before build and deploy.

**On release** — `pnpm release:version` archives qualifying bumps automatically (minor/major before 1.0, major after 1.0) before Changesets applies the version bump.

**Manual snapshot** — `pnpm docs:archive` when you need to freeze docs outside the release flow.

See [`scripts/README.md`](./scripts/README.md) for the full documentation pipeline.

## Repository layout

```text
joc/
├── apps/                  # First-party applications (docs, playgrounds)
├── packages/              # Public @jayoncode/* libraries and internal shared code
├── examples/              # Framework integration examples
├── templates/             # Package blueprint for new libraries
├── engineering/           # Architecture and policy documents
├── scripts/               # Docs sync, release checks, workspace health
└── .github/               # CI workflows and repository automation
```

| Path                               | Role                                                  |
| ---------------------------------- | ----------------------------------------------------- |
| `apps/docs/`                       | VitePress documentation platform                      |
| `apps/browser-session-playground/` | Long-lived Browser Lifecycle engineering shell        |
| `packages/browser-lifecycle/`      | Published session lifecycle library                   |
| `templates/package-template/`      | Standard structure for future packages                |
| `engineering/`                     | Monorepo architecture, versioning, and release policy |

## Development

Requires **Node.js 20+** and **pnpm 10.13.1** (see `packageManager` in `package.json`).

```bash
pnpm install
pnpm validate          # Same quality gates as CI
pnpm docs:dev          # Documentation site (port 4175)
pnpm browser-session-playground:dev
```

| Command                  | Purpose                                         |
| ------------------------ | ----------------------------------------------- |
| `pnpm validate`          | Full CI quality pipeline locally                |
| `pnpm docs:prepare`      | Generate API docs, sync content, stage archives |
| `pnpm docs:build`        | Production documentation build                  |
| `pnpm test`              | Run Vitest suite                                |
| `pnpm typecheck`         | TypeScript project references                   |
| `pnpm package:integrity` | Validate package manifests and workspace policy |

## Releasing

JOC uses [Changesets](https://github.com/changesets/changesets) for independent package versioning.

```bash
pnpm changeset              # Describe your change and bump intent
pnpm changeset:status       # Review pending releases
pnpm release:version        # Archive docs (when applicable) + apply version bumps
pnpm release:publish        # Build and publish to npm
```

Publication is limited to non-private packages. Placeholder packages remain private until they are ready for npm. See [engineering/007-release-engineering.md](./engineering/007-release-engineering.md) and [CONTRIBUTING.md](./CONTRIBUTING.md).

## Contributing

Contributions are welcome. Before opening a pull request:

1. Read [CONTRIBUTING.md](./CONTRIBUTING.md)
2. Review architecture docs in [engineering/](./engineering/)
3. Run `pnpm validate` locally

For package standards and the contributor workflow, see the [Contributor Guides](https://itsjayoncode.github.io/joc/guides/contribution) on the docs site.

## Roadmap

Phases 1–3 established the monorepo foundation, shipped Browser Lifecycle to npm, and delivered the documentation platform with interactive playgrounds. Future work expands the `@jayoncode/*` catalog using the shared package blueprint.

See [ROADMAP.md](./ROADMAP.md) for milestone detail.

## License

MIT © JayOnCode. See [LICENSE](./LICENSE).
