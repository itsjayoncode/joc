# JOC — JayOnCode Ecosystem

[![npm](https://img.shields.io/npm/v/@jayoncode/browser-lifecycle.svg)](https://www.npmjs.com/package/@jayoncode/browser-lifecycle)
[![docs](https://img.shields.io/badge/docs-itsjayoncode.github.io-2563eb)](https://itsjayoncode.github.io/joc/)
[![CI](https://github.com/itsjayoncode/joc/actions/workflows/ci.yml/badge.svg)](https://github.com/itsjayoncode/joc/actions/workflows/ci.yml)
[![license](https://img.shields.io/github/license/itsjayoncode/joc)](https://github.com/itsjayoncode/joc/blob/master/LICENSE)
[![Become a Sponsor](https://img.shields.io/badge/Become%20a%20Sponsor-%23ea4aaa?style=flat&logo=githubsponsors&logoColor=white)](https://github.com/sponsors/jayoncoding)

**JayOnCode** builds the **JOC Ecosystem**: an ecosystem of independent, headless TypeScript libraries engineered for modern web applications. Every package is framework-agnostic, thoroughly documented, and backed by interactive playgrounds for a consistent developer experience.

Each `@jayoncode/*` package solves one problem well, ships on its own version line, and is documented under its own section on the [official docs site](https://itsjayoncode.github.io/joc/).

Install only what you need. Compose when you need more. Keep package boundaries explicit.

| Resource                | URL                                            |
| ----------------------- | ---------------------------------------------- |
| Documentation           | https://itsjayoncode.github.io/joc/            |
| Interactive playgrounds | https://itsjayoncode.github.io/joc/playground/ |
| npm scope               | https://www.npmjs.com/~jayoncode               |
| Repository              | https://github.com/itsjayoncode/joc            |
| Become a Sponsor        | https://github.com/sponsors/jayoncoding        |
| Contributing            | [CONTRIBUTING.md](./CONTRIBUTING.md)           |
| Code of Conduct         | [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md)     |
| Security                | [SECURITY.md](./SECURITY.md)                   |
| Roadmap                 | [ROADMAP.md](./ROADMAP.md)                     |
| Vision                  | [VISION.md](./VISION.md)                       |

---

## Why the JOC Ecosystem

Frontend apps keep re-solving the same infrastructure problems: tab visibility and idle handling, form rules and drafts, deep object comparison and patches, client prefs and cache. JOC packages those concerns as **headless, typed cores** with optional framework adapters — not a UI kit, and not a monolith.

**Design principles**

- **One package, one job** — clear public APIs and independent SemVer lines
- **Framework-agnostic cores** — React / Vue / Angular (and others) are thin adapters
- **Composable, not coupled** — packages may compose in apps; they do not force sibling installs
- **Docs and playgrounds ship with the product** — examples stay honest with the API
- **Engineering as product quality** — CI, Changesets, package blueprints, versioned docs

---

## Packages

All packages below are published under the [`@jayoncode`](https://www.npmjs.com/~jayoncode) npm scope (MIT). Versions move independently via [Changesets](https://github.com/changesets/changesets).

### Browser Lifecycle

Typed, SSR-safe session signals: page visibility, focus, idle, connectivity / reconnect, and cross-tab coordination.

| Package                                                                                                      | Role                   | Docs                                                                   |
| ------------------------------------------------------------------------------------------------------------ | ---------------------- | ---------------------------------------------------------------------- |
| [`@jayoncode/browser-lifecycle`](https://www.npmjs.com/package/@jayoncode/browser-lifecycle)                 | Core engine            | [Docs](https://itsjayoncode.github.io/joc/packages/browser-lifecycle/) |
| [`@jayoncode/browser-lifecycle-react`](https://www.npmjs.com/package/@jayoncode/browser-lifecycle-react)     | React provider & hooks | —                                                                      |
| [`@jayoncode/browser-lifecycle-vue`](https://www.npmjs.com/package/@jayoncode/browser-lifecycle-vue)         | Vue adapter            | —                                                                      |
| [`@jayoncode/browser-lifecycle-angular`](https://www.npmjs.com/package/@jayoncode/browser-lifecycle-angular) | Angular adapter        | —                                                                      |
| [`@jayoncode/browser-lifecycle-svelte`](https://www.npmjs.com/package/@jayoncode/browser-lifecycle-svelte)   | Svelte adapter         | —                                                                      |
| [`@jayoncode/browser-lifecycle-solid`](https://www.npmjs.com/package/@jayoncode/browser-lifecycle-solid)     | Solid adapter          | —                                                                      |

```bash
npm i @jayoncode/browser-lifecycle
```

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

Playground: [Browser Session](https://itsjayoncode.github.io/joc/playground/browser-session/)

### Form Intelligence

Headless form engine for validation modes, conditional `when()` rules, autosave, drafts, wizards, plugins, and submit — one place instead of scattered effects.

| Package                                                                                                      | Role                       | Docs                                                                   |
| ------------------------------------------------------------------------------------------------------------ | -------------------------- | ---------------------------------------------------------------------- |
| [`@jayoncode/form-intelligence`](https://www.npmjs.com/package/@jayoncode/form-intelligence)                 | Core engine                | [Docs](https://itsjayoncode.github.io/joc/packages/form-intelligence/) |
| [`@jayoncode/form-intelligence-react`](https://www.npmjs.com/package/@jayoncode/form-intelligence-react)     | React `useForm` & bindings | —                                                                      |
| [`@jayoncode/form-intelligence-vue`](https://www.npmjs.com/package/@jayoncode/form-intelligence-vue)         | Vue adapter                | —                                                                      |
| [`@jayoncode/form-intelligence-angular`](https://www.npmjs.com/package/@jayoncode/form-intelligence-angular) | Angular adapter            | —                                                                      |
| [`@jayoncode/form-intelligence-zod`](https://www.npmjs.com/package/@jayoncode/form-intelligence-zod)         | Zod schema adapter         | —                                                                      |
| [`@jayoncode/form-intelligence-yup`](https://www.npmjs.com/package/@jayoncode/form-intelligence-yup)         | Yup schema adapter         | —                                                                      |
| [`@jayoncode/form-intelligence-valibot`](https://www.npmjs.com/package/@jayoncode/form-intelligence-valibot) | Valibot schema adapter     | —                                                                      |
| [`@jayoncode/form-intelligence-ajv`](https://www.npmjs.com/package/@jayoncode/form-intelligence-ajv)         | AJV schema adapter         | —                                                                      |

```bash
npm i @jayoncode/form-intelligence
# optional
npm i @jayoncode/form-intelligence-react @jayoncode/form-intelligence-zod
```

```ts
import { createForm, when } from "@jayoncode/form-intelligence";

createForm({
  target: "#checkout",
  schema: { plan: { required: true }, email: "email" },
  validateOn: "onBlur",
  rules: [when("plan").equals("enterprise").show("seatCount").require("seatCount")],
  workflow: {
    autosave: { enabled: true, debounceMs: 800, onSave: (v) => api.saveDraft(v) },
    draft: { enabled: true, storage: "local", key: "checkout" },
  },
  // Same store as form.subscribe() — fires once after create, then on every notify
  subscribe: (form) => {
    syncCheckoutChrome(form.state); // draft badge, plan label, …
  },
  async onSubmit(values) {
    await api.checkout(values);
  },
});
```

Playground: [Form Intelligence](https://itsjayoncode.github.io/joc/playground/form-intelligence/)

### Object Diff

Deep comparison, dirty checks, change records, patches, and serialization for structured data.

| Package                                                                          | Role                          | Docs                                                             |
| -------------------------------------------------------------------------------- | ----------------------------- | ---------------------------------------------------------------- |
| [`@jayoncode/object-diff`](https://www.npmjs.com/package/@jayoncode/object-diff) | Diff, patch, merge, serialize | [Docs](https://itsjayoncode.github.io/joc/packages/object-diff/) |

```bash
npm i @jayoncode/object-diff
```

```ts
import { diff, hasChanges, patch, applyPatch, serialize } from "@jayoncode/object-diff";

if (hasChanges(saved, draft)) {
  const changes = diff(saved, draft);
  await audit.log(serialize(changes, "markdown"));
  const synced = applyPatch(saved, patch(changes));
}
```

Playground: [Object Diff](https://itsjayoncode.github.io/joc/playground/object-diff/)

### Storage

Policy-driven client persistence: namespaced envelopes, TTL, migrations, explicit adapters (memory / localStorage / sessionStorage / IndexedDB), soft quota, and opt-in transforms.

| Package                                                                  | Role                                      | Docs                                                         |
| ------------------------------------------------------------------------ | ----------------------------------------- | ------------------------------------------------------------ |
| [`@jayoncode/storage`](https://www.npmjs.com/package/@jayoncode/storage) | Prefs, cache, TTL, async IDB, quota, xfms | [Docs](https://itsjayoncode.github.io/joc/packages/storage/) |

```bash
npm i @jayoncode/storage
```

```ts
import { createStorage, createLocalStorageAdapter } from "@jayoncode/storage";

const storage = createStorage({
  namespace: "app",
  adapter: createLocalStorageAdapter(),
});

storage.set("theme", "dark");
```

Playground: [Storage](https://itsjayoncode.github.io/joc/playground/storage/)

---

## What ships today

| Area                    | Status                                                                                                |
| ----------------------- | ----------------------------------------------------------------------------------------------------- |
| Core libraries          | `browser-lifecycle`, `form-intelligence`, `object-diff`, `storage` on npm                             |
| Framework adapters      | React / Vue / Angular (+ Svelte / Solid for lifecycle); form schema adapters (Zod, Yup, Valibot, AJV) |
| Documentation site      | VitePress on GitHub Pages — guides, API reference, patterns, FAQs                                     |
| Versioned package docs  | Latest + archived snapshots per release policy                                                        |
| Interactive playgrounds | Hub + per-package explorers                                                                           |
| Monorepo tooling        | pnpm workspaces, TypeScript project references, Vitest, ESLint, Prettier, Turborepo                   |
| CI & release            | Quality gates, CodeQL, Changesets, independent package versioning                                     |

Additional packages will be announced as they enter active development. See [ROADMAP.md](./ROADMAP.md).

---

## Documentation versioning

Package docs support **latest** and **archived** URLs so consumers can reference older releases after breaking changes.

| Route                                 | Meaning                                    |
| ------------------------------------- | ------------------------------------------ |
| `/packages/browser-lifecycle/`        | Latest documentation (current npm version) |
| `/packages/browser-lifecycle/v0.1.2/` | Frozen snapshot for that release           |

Archives live under `apps/docs/archives/` and are staged into the site at build time. A version switcher appears on package documentation pages (not package landing pages).

**Policy** — packages with a `/packages/<id>/` docs section enable versioned archives (register in `DOC_VERSIONED_PACKAGES`, bootstrap on first release). See [`engineering/014-versioning-policy.md`](./engineering/014-versioning-policy.md).

| When            | What to run                                                                      |
| --------------- | -------------------------------------------------------------------------------- |
| Day to day      | Edit docs as usual; CI runs `pnpm docs:prepare` before build and deploy          |
| On release      | `pnpm release:version` archives qualifying bumps, then Changesets bumps versions |
| Manual snapshot | `pnpm docs:archive` outside the release flow                                     |

Full pipeline notes: [`scripts/README.md`](./scripts/README.md).

---

## Repository layout

```text
joc/
├── apps/                  # Docs site and interactive playgrounds
├── packages/              # Public @jayoncode/* libraries
├── examples/              # Framework integration examples
├── templates/             # Package blueprint for new libraries
├── engineering/           # Architecture and policy documents
├── scripts/               # Docs sync, release checks, workspace health
└── .github/               # CI workflows and repository automation
```

| Path                                 | Role                                          |
| ------------------------------------ | --------------------------------------------- |
| `apps/docs/`                         | VitePress documentation platform              |
| `apps/playground/`                   | Playground hub                                |
| `apps/browser-session-playground/`   | Browser Lifecycle explorer                    |
| `apps/form-intelligence-playground/` | Form Intelligence explorer                    |
| `apps/object-diff-playground/`       | Object Diff explorer                          |
| `apps/storage-playground/`           | Storage Lab                                   |
| `packages/browser-lifecycle*`        | Core + framework adapters                     |
| `packages/form-intelligence*`        | Core + framework / schema adapters            |
| `packages/object-diff/`              | Deep comparison and patch library             |
| `packages/storage/`                  | Client persistence (envelopes, TTL, adapters) |
| `templates/package-template/`        | Standard structure for future libraries       |
| `engineering/`                       | Architecture, versioning, and release policy  |

---

## Development

Requires **Node.js 20+** and **pnpm 10.13.1** (see `packageManager` in root `package.json`).

```bash
pnpm install
pnpm validate          # Same quality gates as CI
pnpm docs:dev          # Documentation site (port 4175)
pnpm form-intelligence-playground:dev
pnpm browser-session-playground:dev
pnpm object-diff-playground:dev
pnpm storage-playground:dev
```

| Command                  | Purpose                                            |
| ------------------------ | -------------------------------------------------- |
| `pnpm validate`          | Full CI quality pipeline locally                   |
| `pnpm docs:prepare`      | Generate API docs, sync content, stage archives    |
| `pnpm docs:build`        | Production documentation build                     |
| `pnpm test`              | Run Vitest suite                                   |
| `pnpm typecheck`         | TypeScript project references                      |
| `pnpm package:integrity` | Validate package manifests and workspace policy    |
| `pnpm package:blueprint` | Validate production packages against the blueprint |

---

## Releasing

JOC uses [Changesets](https://github.com/changesets/changesets) for independent package versioning. Typical flow:

1. Land work on `master` with a changeset describing SemVer intent
2. Merge the automated **Version Packages** PR (runs `pnpm release:version`, including docs archive when applicable)
3. CI publishes via `changeset publish`

```bash
pnpm changeset              # Describe your change and bump intent
pnpm changeset:status       # Review pending releases
pnpm release:version        # Archive docs (when applicable) + apply version bumps
pnpm release:publish        # Build and publish to npm
```

Publication is limited to non-private packages. See [engineering/007-release-engineering.md](./engineering/007-release-engineering.md) and [CONTRIBUTING.md](./CONTRIBUTING.md).

---

## Contributing

Contributions are welcome across docs, packages, playgrounds, and repository health.

1. Read [CONTRIBUTING.md](./CONTRIBUTING.md)
2. Follow the [Code of Conduct](./CODE_OF_CONDUCT.md)
3. Review architecture docs in [engineering/](./engineering/) for larger changes
4. Run `pnpm validate` (or at least typecheck / lint / test) before opening a PR

Product-facing guide: [Contributor Guides](https://itsjayoncode.github.io/joc/guides/contribution) on the docs site.

Report vulnerabilities privately per [SECURITY.md](./SECURITY.md) — do not open public issues for security reports.

---

## Roadmap

Phases 1–3 established the monorepo foundation, shipped the first public packages, and delivered the documentation platform with interactive playgrounds. Current work hardens the live catalog and expands adapters and recipes. Future packages will be announced as they enter active development.

See [ROADMAP.md](./ROADMAP.md) and the [docs roadmap](https://itsjayoncode.github.io/joc/roadmap/).

---

## License

MIT © JayOnCode. See [LICENSE](./LICENSE).
