# JOC — JayOnCode TypeScript Libraries

[![npm](https://img.shields.io/npm/v/@jayoncode/browser-lifecycle.svg)](https://www.npmjs.com/package/@jayoncode/browser-lifecycle)
[![docs](https://img.shields.io/badge/docs-itsjayoncode.github.io-2563eb)](https://itsjayoncode.github.io/joc/)
[![CI](https://github.com/itsjayoncode/joc/actions/workflows/ci.yml/badge.svg)](https://github.com/itsjayoncode/joc/actions/workflows/ci.yml)
[![license](https://img.shields.io/github/license/itsjayoncode/joc)](https://github.com/itsjayoncode/joc/blob/master/LICENSE)

**JOC** (JayOnCode) is an open source monorepo of focused, independently installable **TypeScript libraries**. Each `@jayoncode/*` package solves one problem well, ships on its own SemVer line, and documents under its own section on the [official docs site](https://itsjayoncode.github.io/joc/).

This folder (`.github/`) holds repository automation — workflows, templates, Dependabot, and policy docs. For product overview, local development, and contributing, see the [root README](../README.md).

## Live packages

Published under [`@jayoncode`](https://www.npmjs.com/~jayoncode) on npm:

| Family                | Core                                                                                         | Adapters / related                           | Docs                                                                   | Playground                                                                     |
| --------------------- | -------------------------------------------------------------------------------------------- | -------------------------------------------- | ---------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| **Browser Lifecycle** | [`@jayoncode/browser-lifecycle`](https://www.npmjs.com/package/@jayoncode/browser-lifecycle) | React, Vue, Angular, Svelte, Solid           | [Docs](https://itsjayoncode.github.io/joc/packages/browser-lifecycle/) | [Playground](https://itsjayoncode.github.io/joc/playground/browser-lifecycle/) |
| **Form Intelligence** | [`@jayoncode/form-intelligence`](https://www.npmjs.com/package/@jayoncode/form-intelligence) | React, Vue, Angular · Zod, Yup, Valibot, AJV | [Docs](https://itsjayoncode.github.io/joc/packages/form-intelligence/) | [Playground](https://itsjayoncode.github.io/joc/playground/form-intelligence/) |
| **Object Diff**       | [`@jayoncode/object-diff`](https://www.npmjs.com/package/@jayoncode/object-diff)             | —                                            | [Docs](https://itsjayoncode.github.io/joc/packages/object-diff/)       | [Playground](https://itsjayoncode.github.io/joc/playground/object-diff/)       |

**What each core does**

- **Browser Lifecycle** — SSR-safe session signals: visibility, focus, idle, connectivity / reconnect, cross-tab coordination
- **Form Intelligence** — headless form engine: validation, `when()` rules, drafts, autosave, wizards, submit
- **Object Diff** — deep comparison, dirty checks, change records, patches, serialization

Compatibility shims under `@jayoncode/form-intelligent*` re-export Form Intelligence for older installs. Prefer `@jayoncode/form-intelligence*` for new work.

Additional libraries will be announced as they enter active development — see the [roadmap](https://itsjayoncode.github.io/joc/roadmap/).

## Links

| Resource          | URL                                                            |
| ----------------- | -------------------------------------------------------------- |
| Documentation     | https://itsjayoncode.github.io/joc/                            |
| Playground hub    | https://itsjayoncode.github.io/joc/playground/                 |
| Browser Lifecycle | https://itsjayoncode.github.io/joc/packages/browser-lifecycle/ |
| Form Intelligence | https://itsjayoncode.github.io/joc/packages/form-intelligence/ |
| Object Diff       | https://itsjayoncode.github.io/joc/packages/object-diff/       |
| npm scope         | https://www.npmjs.com/~jayoncode                               |
| Repository README | [../README.md](../README.md)                                   |
| Contributing      | [../CONTRIBUTING.md](../CONTRIBUTING.md)                       |
| Security          | [../SECURITY.md](../SECURITY.md)                               |

---

## Repository automation

GitHub Actions workflows, issue and pull request templates, Dependabot configuration, and related repository policies live here.

### Workflows

| Workflow                    | Trigger                                       | Purpose                                                                            |
| --------------------------- | --------------------------------------------- | ---------------------------------------------------------------------------------- |
| **CI**                      | Push to `main` / `master` / `develop`, manual | Quality gates; on default branch also deploys docs and runs Changesets             |
| **Pull Request Validation** | Pull requests                                 | Quality gates only (no deploy)                                                     |
| **CodeQL**                  | Push, pull requests, weekly schedule          | Security analysis for JavaScript and TypeScript                                    |
| **Release**                 | Manual                                        | Draft a GitHub release for an existing tag                                         |
| **Deploy Docs**             | Manual                                        | Rebuild and redeploy documentation without a full CI run                           |
| **Deploy Playground**       | Manual                                        | Validate a standalone playground build (production deploy is bundled into docs CI) |

On push to `master` or `main`, expect **two** workflow runs: **CI** and **CodeQL**.

### Default-branch CI pipeline

When CI runs on `main` or `master`, jobs execute in this order:

1. **Quality** — workspace health, `docs:prepare`, typecheck, lint, format, tests, build, integrity checks
2. **Deploy docs** — production VitePress build with `VITE_DOCS_BASE=/joc/`, bundles playgrounds, and stages documentation archives:
   - `/joc/playground/browser-lifecycle/`
   - `/joc/playground/form-intelligence/`
   - `/joc/playground/object-diff/`
3. **Deploy Pages** — publish the docs artifact to GitHub Pages
4. **Version PR** — Changesets opens or updates a versioning pull request (npm publish when `NPM_TOKEN` / trusted publishing is configured)

Documentation archives under `apps/docs/archives/` are copied into the site during `docs:prepare`, so older package doc versions remain available at versioned URLs (for example `/joc/packages/browser-lifecycle/v0.1.2/`).

### Package publication

Only **public**, non-ignored packages are eligible for npm publication. That includes the Browser Lifecycle, Form Intelligence (and adapters / compatibility shims), and Object Diff families above.

Apps and playgrounds stay private / Changesets-ignored (see `.changeset/config.json` `ignore`). Form Intelligence cores and shims are version-aligned via Changesets `fixed` groups.

The **Release** workflow does **not** publish packages. Use Changesets via the CI version PR flow, or `pnpm release:publish` locally with appropriate credentials. Details: [../CONTRIBUTING.md](../CONTRIBUTING.md) and [../engineering/007-release-engineering.md](../engineering/007-release-engineering.md).

### Also in this directory

- Dependabot configuration ([dependabot.yml](./dependabot.yml))
- Issue and pull request templates ([ISSUE_TEMPLATE/](./ISSUE_TEMPLATE/), [pull_request_template.md](./pull_request_template.md))
- Recommended labels ([LABELS.md](./LABELS.md)) and security settings ([SECURITY_SETTINGS.md](./SECURITY_SETTINGS.md))
