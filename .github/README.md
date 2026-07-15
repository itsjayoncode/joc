# JOC — JayOnCode TypeScript Libraries

[![npm](https://img.shields.io/npm/v/@jayoncode/browser-lifecycle.svg)](https://www.npmjs.com/package/@jayoncode/browser-lifecycle)
[![docs](https://img.shields.io/badge/docs-itsjayoncode.github.io-2563eb)](https://itsjayoncode.github.io/joc/)
[![CI](https://github.com/itsjayoncode/joc/actions/workflows/ci.yml/badge.svg)](https://github.com/itsjayoncode/joc/actions/workflows/ci.yml)

**JOC** (JayOnCode) is an open source monorepo of focused, independently installable **TypeScript browser libraries**. Each `@jayoncode/*` package solves one problem well, ships on its own version line, and documents under its own section on the [official docs site](https://itsjayoncode.github.io/joc/).

The first published package is [`@jayoncode/browser-lifecycle`](https://www.npmjs.com/package/@jayoncode/browser-lifecycle) — a framework-agnostic, SSR-safe session lifecycle manager for page visibility, focus, connectivity, idle detection, cross-tab coordination, and plugin diagnostics.

## Links

| Resource               | URL                                                              |
| ---------------------- | ---------------------------------------------------------------- |
| Documentation          | https://itsjayoncode.github.io/joc/                              |
| Browser Lifecycle docs | https://itsjayoncode.github.io/joc/packages/browser-lifecycle/   |
| Interactive playground | https://itsjayoncode.github.io/joc/playground/browser-lifecycle/ |
| npm scope              | https://www.npmjs.com/~jayoncode                                 |
| Repository root README | [../README.md](../README.md)                                     |

For development setup, repository layout, and release workflow, see the [root README](../README.md).

## Repository automation

This directory holds GitHub Actions workflows, issue and pull request templates, Dependabot configuration, and related repository policies.

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
2. **Deploy docs** — production VitePress build with `VITE_DOCS_BASE=/joc/`, bundles the Browser Lifecycle playground at `/joc/playground/browser-lifecycle/`, and stages documentation archives
3. **Deploy Pages** — publish the docs artifact to GitHub Pages
4. **Version PR** — Changesets opens or updates a versioning pull request (npm publish when configured)

Documentation archives under `apps/docs/archives/` are copied into the site during `docs:prepare`, so older package doc versions remain available at versioned URLs (for example `/joc/packages/browser-lifecycle/v0.1.2/`).

### Package publication

Only public, non-ignored packages are eligible for npm publication. At present that is `@jayoncode/browser-lifecycle`. Placeholder packages are marked `private: true` and listed in `.changeset/config.json` `ignore`.

The **Release** workflow does not publish packages. Use Changesets via the CI version PR flow or `pnpm release:publish` locally with appropriate credentials.

### Also in this directory

- Dependabot configuration (`.github/dependabot.yml`)
- Issue and pull request templates
- Recommended labels and security settings documentation
