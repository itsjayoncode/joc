# Package Docs

Use this directory for package-specific documentation that syncs into the JOC docs site.

Typical contents include:

- overview / concepts / getting-started guides
- feature modules and migration notes
- release notes that need more context than the changelog

## Versioned docs (required by default)

Every package that owns a `/packages/<id>/` section on the docs site **must** enable versioned documentation archives:

1. Register in `scripts/lib/doc-versioning.mjs` (`DOC_VERSIONED_PACKAGES`)
2. Add `apps/docs/doc-versions/<id>.json` (`archive: { major: true, minor: true, patch: false }`, `archives: []`)
3. Wire versions meta into VitePress (config, sidebar map, version switcher)
4. On first public release: `pnpm docs:archive -- --package <id> --bootstrap`

See `engineering/014-versioning-policy.md` and `engineering/017-package-doc-learning-path.md`.
