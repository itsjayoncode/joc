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

JOC archives documentation for every **minor** and **major** release. **Patch** releases do not create a new documentation version.

Documentation snapshots are created during the release process and committed to the repository. Deployment pipelines only build and publish existing documentation artifacts; they never generate historical snapshots.

Consumers get:

- a version switcher on package doc pages
- frozen snapshots at `/packages/<id>/v{version}/`
- automatic archiving on qualifying releases via `pnpm release:version`

### Rationale

Minor releases frequently introduce new capabilities, APIs, configuration options, or behavioral changes that affect documentation. Archiving for each minor release ensures users can open docs that match the version they have installed.

Patch releases generally contain bug fixes and documentation corrections that do not warrant a separate documentation version.

### Release policy

| Release type | Archive documentation |
| ------------ | --------------------- |
| Major        | Yes                   |
| Minor        | Yes                   |
| Patch        | No                    |

Examples (snapshot is taken of the **current** version before the bump):

| Release       | Documentation version created |
| ------------- | ----------------------------- |
| 3.4.0 → 3.5.0 | Archive `3.4.0`               |
| 3.5.0 → 3.6.0 | Archive `3.5.0`               |
| 3.6.0 → 4.0.0 | Archive `3.6.0`               |
| 3.6.0 → 3.6.1 | No archive                    |

### Manifest shape

```json
{
  "package": "@jayoncode/example",
  "basePath": "/packages/example",
  "archive": {
    "major": true,
    "minor": true,
    "patch": false
  },
  "archives": []
}
```

Prefer the `archive` object over legacy string `archivePolicy` values (`"minor-major"`, `"major"`, or deprecated `"minor"`). Package-specific overrides are allowed when needed (for example `{ "major": true, "minor": false, "patch": false }`).

### Release process

Documentation snapshots are generated during `pnpm release:version` **before** the package version is bumped:

1. Generate documentation snapshot for the current version (when the pending changeset bump qualifies)
2. Update the documentation version manifest
3. Commit snapshot files with the release
4. Tag the release
5. Publish packages

Deployment pipelines (`docs:build` / Pages deploy) only build and publish committed documentation. They do not reconstruct historical documentation.

Manual snapshot outside release: `pnpm docs:archive`. First publish / empty history: `pnpm docs:archive -- --package <id> --bootstrap`.

### Backfilling

Historical documentation versions may be backfilled selectively when useful (for example, widely adopted minor releases). Backfills are optional and should not be treated as a complete historical archive.

### Required wiring for a new package

1. Add the package to `DOC_VERSIONED_PACKAGES` in `scripts/lib/doc-versioning.mjs`
2. Create `apps/docs/doc-versions/<id>.json` with the `archive` object above and `archives: []`
3. Wire `*-versions.ts` into the VitePress config, sidebar map, and `DocsVersionSwitcher` / `ArchivedDocsBanner`
4. Ignore generated `apps/docs/docs/packages/<id>/v*/` and `.vitepress/<id>-versions.ts` in `.gitignore`
5. On the first public release (and whenever history is empty), run:
   `pnpm docs:archive -- --package <id> --bootstrap`
6. Keep editing live docs as usual — `docs:prepare` stages archives into the site

See [`scripts/README.md`](../scripts/README.md) for commands and [`engineering/017-package-doc-learning-path.md`](./017-package-doc-learning-path.md) for the full docs checklist.

## Long-Term Support Philosophy

JOC is not committing to formal LTS windows at this phase, but packages should be evolved with maintenance discipline rather than frequent unnecessary breaking changes.
