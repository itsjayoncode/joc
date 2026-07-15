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

### Archived package documentation

Browser Lifecycle docs can be frozen per release under:

- latest: `/packages/browser-lifecycle/`
- archived: `/packages/browser-lifecycle/v{version}/`

Archives are stored in `apps/docs/archives/browser-lifecycle/` and staged into the VitePress tree during `docs:prepare`.

```bash
# Snapshot the current browser-lifecycle docs (manual or release hook)
pnpm docs:archive

# Release versioning archives automatically when a minor/major bump is pending
pnpm release:version
```

Generated output is gitignored under `apps/docs/docs/packages/browser-lifecycle/` (`api/`, `modules/`, `playground/`, `examples/index.md`, `v*/`) and `.vitepress/*-meta.ts`, `.vitepress/browser-lifecycle-versions.ts`. CI and local validation always run `docs:prepare` before typecheck and formatting checks.

Set `DOCS_SYNC_SKIP_QUALITY=1` only for fast integration tests that verify generation output without running format/lint.
