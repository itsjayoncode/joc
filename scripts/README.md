# Scripts

Repository automation scripts for documentation sync, release checks, and workspace health.

## Local validation (matches GitHub CI)

Run the same quality gates as `.github/workflows/quality.yml`:

```bash
pnpm validate
```

This is an alias for `pnpm ci:quality`, which runs in order:

1. `workspace:health`
2. `docs:prepare` — generates API docs (TypeDoc) and synced docs, then formats/lints output
3. `typecheck`
4. `lint`
5. `format:check`
6. `test:coverage`
7. `build`
8. `package:integrity`
9. `release:readiness`
10. `package:blueprint`

## Documentation generation

### API reference

`scripts/generate-api-documentation.mjs` runs TypeDoc and formats generated markdown with Prettier.

```bash
pnpm docs:api
```

### Synced guides and playground pages

`scripts/sync-documentation.mjs` copies package and playground docs into the VitePress site, writes version metadata, then runs Prettier and ESLint on generated files.

```bash
pnpm docs:sync
```

### Full prepare step

```bash
pnpm docs:prepare
```

`docs:prepare` runs API generation, content sync, and archive staging for versioned package docs.

`docs:build` also bundles interactive playgrounds into the Pages artifact via `scripts/bundle-playground-into-docs.mjs`:

| Playground        | Dist path                       | Base env                                 |
| ----------------- | ------------------------------- | ---------------------------------------- |
| Browser Lifecycle | `playground/browser-lifecycle/` | `VITE_BROWSER_PLAYGROUND_BASE`           |
| Object Diff       | `playground/object-diff/`       | `VITE_OBJECT_DIFF_PLAYGROUND_BASE`       |
| Form Intelligence | `playground/form-intelligence/` | `VITE_FORM_INTELLIGENCE_PLAYGROUND_BASE` |

Hub page: `/playground/` (lists all three). Form Intelligence production URL:

`https://itsjayoncode.github.io/joc/playground/form-intelligence/`

### Archived package documentation

**Default for every package that owns a docs site section** — versioned archives and the version switcher are required, including for new packages. Do not add a `/packages/<id>/` section without registering archives.

Publishable packages keep frozen docs per release (version dropdown on package pages):

| Package           | Latest                         | Archives                                  |
| ----------------- | ------------------------------ | ----------------------------------------- |
| Browser Lifecycle | `/packages/browser-lifecycle/` | `/packages/browser-lifecycle/v{version}/` |
| Object Diff       | `/packages/object-diff/`       | `/packages/object-diff/v{version}/`       |
| Form Intelligence | `/packages/form-intelligence/` | `/packages/form-intelligence/v{version}/` |

Archives live under `apps/docs/archives/<package>/` and are staged into the VitePress tree during `docs:prepare`. Manifests: `apps/docs/doc-versions/<package>.json`.

```bash
# Snapshot current docs for all versioned packages (or one with --package)
pnpm docs:archive
pnpm docs:archive -- --package form-intelligent --bootstrap

# Backfill Form Intelligence history from published git tips (dropdown archives)
node scripts/backfill-form-intelligent-doc-archives.mjs
pnpm --filter @jayoncode/docs docs:stage-archives

# Release versioning archives automatically when a qualifying bump is pending
pnpm release:version
```

Archive policy (`archivePolicy: "minor"`): on `0.x`, archive on minor/major; on `1.x+`, archive on major only (patches never archive).

**New package checklist** (required):

1. Add an entry to `DOC_VERSIONED_PACKAGES` in `scripts/lib/doc-versioning.mjs`
2. Create `apps/docs/doc-versions/<id>.json`
3. Wire `*-versions.ts` into VitePress config + version switcher components
4. Gitignore `apps/docs/docs/packages/<id>/v*/` and `.vitepress/<id>-versions.ts`
5. Bootstrap on first publish: `pnpm docs:archive -- --package <id> --bootstrap`

Policy detail: [`engineering/014-versioning-policy.md`](../engineering/014-versioning-policy.md).

Generated output is gitignored under each package’s `v*/` tree and `.vitepress/*-versions.ts` / `*-meta.ts`. CI and local validation always run `docs:prepare` before typecheck and formatting checks.

Set `DOCS_SYNC_SKIP_QUALITY=1` only for fast integration tests that verify generation output without running format/lint.
