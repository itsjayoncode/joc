# Scripts

Repository automation scripts for documentation sync, release checks, and workspace health.

## Local validation (matches GitHub CI)

Run the same quality gates as `.github/workflows/quality.yml`:

```bash
pnpm validate
```

This is an alias for `pnpm ci:quality`, which runs in order:

1. `workspace:health`
2. `docs:sync` — generates synced docs and formats/lints generated output
3. `typecheck`
4. `lint`
5. `format:check`
6. `test:coverage`
7. `build`
8. `package:integrity`
9. `release:readiness`
10. `package:blueprint`

## Documentation sync

`scripts/sync-documentation.mjs` copies package and playground docs into the VitePress site, writes version metadata, then runs Prettier and ESLint on generated files.

```bash
pnpm docs:sync
```

Generated output is gitignored under `apps/docs/docs/packages/browser-lifecycle/` (`modules/`, `playground/`, `examples/index.md`) and `.vitepress/*-meta.ts`. CI and local validation always run `docs:sync` before typecheck and formatting checks.

Set `DOCS_SYNC_SKIP_QUALITY=1` only for fast integration tests that verify sync output without running format/lint.
