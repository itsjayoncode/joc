# JOC — JayOnCode TypeScript Libraries

[![npm](https://img.shields.io/npm/v/@jayoncode/browser-lifecycle.svg)](https://www.npmjs.com/package/@jayoncode/browser-lifecycle)
[![docs](https://img.shields.io/badge/docs-itsjayoncode.github.io-2563eb)](https://itsjayoncode.github.io/joc/)
[![CI](https://github.com/itsjayoncode/joc/actions/workflows/ci.yml/badge.svg)](https://github.com/itsjayoncode/joc/actions/workflows/ci.yml)
[![license](https://img.shields.io/github/license/itsjayoncode/joc)](https://github.com/itsjayoncode/joc/blob/master/LICENSE)

**JOC** (JayOnCode) is an open source monorepo of focused, independently installable **TypeScript browser libraries**. Each `@jayoncode/*` package solves one problem well, ships on its own version line, and documents under its own section on the [official docs site](https://itsjayoncode.github.io/joc/).

## Live packages

| Package                                                                                      | Solves                                           | Install                              |
| -------------------------------------------------------------------------------------------- | ------------------------------------------------ | ------------------------------------ |
| [`@jayoncode/browser-lifecycle`](https://www.npmjs.com/package/@jayoncode/browser-lifecycle) | Tab visibility, idle, reconnect, session signals | `npm i @jayoncode/browser-lifecycle` |
| [`@jayoncode/form-intelligent`](https://www.npmjs.com/package/@jayoncode/form-intelligent)   | Headless forms, `when()` rules, autosave         | `npm i @jayoncode/form-intelligent`  |
| [`@jayoncode/object-diff`](https://www.npmjs.com/package/@jayoncode/object-diff)             | Deep diff, dirty checks, patches                 | `npm i @jayoncode/object-diff`       |

### Stop wasting work in a background tab

```ts
import { createBrowserLifecycle } from "@jayoncode/browser-lifecycle";

const lifecycle = createBrowserLifecycle({ autoStart: true, idleTimeout: 60_000 });

lifecycle.on("page:hidden", () => {
  pausePolling();
  pauseMedia();
});

lifecycle.on("page:visible", () => resumePolling());
lifecycle.on("connection:reconnect", () => flushOfflineQueue());
```

### Conditional form fields without `useEffect`

```ts
import { createForm, when } from "@jayoncode/form-intelligent";

createForm({
  target: "#checkout",
  schema: { plan: { required: true } },
  rules: [when("plan").equals("enterprise").show("seatCount").require("seatCount")],
  async onSubmit(values) {
    await api.checkout(values);
  },
});
```

### Know exactly what changed — then patch it

```ts
import { diff, hasChanges, patch, applyPatch, serialize } from "@jayoncode/object-diff";

if (hasChanges(saved, draft)) {
  const changes = diff(saved, draft);
  await audit.log(serialize(changes, "markdown"));
  const synced = applyPatch(saved, patch(changes));
}
```

## Links

| Resource          | URL                                                            |
| ----------------- | -------------------------------------------------------------- |
| Documentation     | https://itsjayoncode.github.io/joc/                            |
| Browser Lifecycle | https://itsjayoncode.github.io/joc/packages/browser-lifecycle/ |
| Form Intelligent  | https://itsjayoncode.github.io/joc/packages/form-intelligent/  |
| Object Diff       | https://itsjayoncode.github.io/joc/packages/object-diff/       |
| Playground        | https://itsjayoncode.github.io/joc/playground/                 |
| npm scope         | https://www.npmjs.com/~jayoncode                               |
| Repository        | https://github.com/itsjayoncode/joc                            |

## What ships today

| Area                           | Status                                                                   |
| ------------------------------ | ------------------------------------------------------------------------ |
| `@jayoncode/browser-lifecycle` | Published on npm                                                         |
| `@jayoncode/form-intelligent`  | Published on npm                                                         |
| `@jayoncode/object-diff`       | Published on npm                                                         |
| Documentation site             | VitePress on GitHub Pages — guides, API reference, patterns, FAQs        |
| Interactive playgrounds        | Per-package explorers                                                    |
| Monorepo tooling               | pnpm workspaces, TypeScript project references, Vitest, ESLint, Prettier |
| CI & release engineering       | Quality gates, Changesets, independent package versioning                |

Additional packages (`request`, `scroll`, `theme`, and others) are scaffolded in the monorepo and documented as planned work.

## Documentation versioning

Package docs support **latest** and **archived** URLs so users can reference older releases after breaking changes.

| Route                                 | Meaning                                    |
| ------------------------------------- | ------------------------------------------ |
| `/packages/browser-lifecycle/`        | Latest documentation (current npm version) |
| `/packages/browser-lifecycle/v0.1.2/` | Frozen snapshot for that release           |

Archives are stored under `apps/docs/archives/` and staged into the site at build time. A version switcher appears on package documentation pages (not package landing pages).

**Default for all packages** — any package that owns a `/packages/<id>/` docs section must enable versioned archives (register in `DOC_VERSIONED_PACKAGES`, bootstrap on first release). See [`engineering/014-versioning-policy.md`](./engineering/014-versioning-policy.md).

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
| `packages/form-intelligent/`       | Published headless form workflow engine               |
| `packages/object-diff/`            | Published deep comparison and patch library           |
| `templates/package-template/`      | Standard structure for future libraries               |
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

Phases 1–3 established the monorepo foundation, shipped packages to npm, and delivered the documentation platform with interactive playgrounds. Future work expands the `@jayoncode/*` catalog using the shared package blueprint.

See [ROADMAP.md](./ROADMAP.md) for milestone detail.

## License

MIT © JayOnCode. See [LICENSE](./LICENSE).
