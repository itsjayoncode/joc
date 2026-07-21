# Maintainer scripts

Operational scripts for the JOC monorepo. Product libraries live under `packages/`; these scripts enforce platform and release hygiene.

## JOC CLI (Phase 7)

```bash
pnpm joc help
pnpm joc new package <kebab-name>
pnpm joc new playground <kebab-name>
pnpm joc docs sync
pnpm joc release check
```

Implementation: `scripts/joc-cli.mjs`  
Templates: `templates/package-template/`, `templates/playground-template/`  
Standards of truth: `engineering/*` (especially `016-package-checklist.md`)

## Checks

| Script                        | Purpose                                           |
| ----------------------------- | ------------------------------------------------- |
| `check-package-blueprint.mjs` | Template + engineering + production package shape |
| `check-package-integrity.mjs` | Publishable set, versions, MIT, repository paths  |
| `check-release-readiness.mjs` | Pre-release gates                                 |
| `check-workspaces.mjs`        | Workspace health                                  |

## Docs / release

See root `package.json` scripts (`docs:*`, `release:*`, `changeset*`). Prefer `pnpm joc docs` / `pnpm joc release check` when you want the thin wrappers.
