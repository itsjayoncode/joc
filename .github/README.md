# GitHub Automation

Repository workflows, templates, and policies for the JOC monorepo.

## Workflows

| Workflow                    | Trigger                                       | Purpose                                                                |
| --------------------------- | --------------------------------------------- | ---------------------------------------------------------------------- |
| **CI**                      | Push to `main` / `master` / `develop`, manual | Quality gates; on default branch also deploys docs and runs Changesets |
| **Pull Request Validation** | Pull requests                                 | Quality gates only (no deploy)                                         |
| **CodeQL**                  | Push, pull requests, weekly schedule          | Security analysis for JavaScript and TypeScript                        |
| **Release**                 | Manual                                        | Draft a GitHub release for an existing tag                             |
| **Deploy Docs**             | Manual                                        | Rebuild and redeploy documentation without a full CI run               |
| **Deploy Playground**       | Manual                                        | Build and publish the browser session playground artifact              |

On push to `master` or `main`, expect **two** workflow runs: **CI** and **CodeQL**.

## Default-branch CI pipeline

When CI runs on `main` or `master`, jobs execute in this order:

1. **Quality** — workspace health, `docs:prepare`, typecheck, lint, format, tests, build, integrity checks
2. **Deploy docs** — production VitePress build with `VITE_DOCS_BASE=/joc/`, including staged documentation archives
3. **Deploy Pages** — publish the docs artifact to GitHub Pages
4. **Version PR** — Changesets opens or updates a versioning pull request (npm publish when configured)

Documentation archives under `apps/docs/archives/` are copied into the site during `docs:prepare`, so older package doc versions remain available at versioned URLs (for example `/joc/packages/browser-lifecycle/v0.1.2/`).

## Package publication

Only public, non-ignored packages are eligible for npm publication. At present that is `@jayoncode/browser-lifecycle`. Placeholder packages are marked `private: true` and listed in `.changeset/config.json` `ignore`.

The **Release** workflow does not publish packages. Use Changesets via the CI version PR flow or `pnpm release:publish` locally with appropriate credentials.

## Also in this directory

- Dependabot configuration (`.github/dependabot.yml`)
- Issue and pull request templates
- Recommended labels and security settings documentation
