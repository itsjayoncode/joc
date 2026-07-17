# 014 Versioning Policy

## Why This Document Exists

This document defines the compatibility and versioning rules that every JOC package should follow.

## Semantic Versioning

JOC packages use Semantic Versioning.

### Patch

Use for backward-compatible fixes and safe internal corrections.

### Minor

Use for backward-compatible new functionality.

### Major

Use for breaking changes, removed APIs, or incompatible behavior shifts.

## Compatibility Policy

- avoid breaking changes whenever a non-breaking evolution is realistic
- do not ship breaking behavior in patch or minor releases
- document deprecations before removals when possible
- include migration notes for changes that impact consumers

## Deprecation Policy

When deprecating a public API:

- mark it clearly in documentation
- explain the replacement path
- keep behavior stable during the deprecation window when possible
- remove it only in a major release unless the API was explicitly experimental

## Documentation version archives (required by default)

**Every package that owns a docs site section under `/packages/<id>/` must have versioned documentation archives enabled.** This is the default for all current and future packages — not an opt-in.

Consumers get:

- a version switcher on package doc pages
- frozen snapshots at `/packages/<id>/v{version}/`
- automatic archiving on qualifying releases via `pnpm release:version`

### Required wiring for a new package

1. Add the package to `DOC_VERSIONED_PACKAGES` in `scripts/lib/doc-versioning.mjs`
2. Create `apps/docs/doc-versions/<id>.json` with `archivePolicy: "minor"` and `archives: []`
3. Wire `*-versions.ts` into the VitePress config, sidebar map, and `DocsVersionSwitcher` / `ArchivedDocsBanner`
4. Ignore generated `apps/docs/docs/packages/<id>/v*/` and `.vitepress/<id>-versions.ts` in `.gitignore`
5. On the first public release (and whenever history is empty), run:
   `pnpm docs:archive -- --package <id> --bootstrap`
6. Keep editing live docs as usual — `docs:prepare` stages archives into the site

### Archive policy

Default `archivePolicy: "minor"`:

- **0.x** — archive on minor and major bumps (not patch)
- **1.x+** — archive on major bumps (not patch/minor)

Patches never create archives. Use `pnpm docs:archive` for a manual snapshot outside release.

See [`scripts/README.md`](../scripts/README.md) for commands and [`engineering/017-package-doc-learning-path.md`](./017-package-doc-learning-path.md) for the full docs checklist.

## Long-Term Support Philosophy

JOC is not committing to formal LTS windows at this phase, but packages should be evolved with maintenance discipline rather than frequent unnecessary breaking changes.
