# Changesets Workflow

JOC uses Changesets to prepare independent package versioning, changelog generation, and release review.

## Why Changesets Exists Here

- public packages should version independently
- maintainers need release review before publishing
- changelog generation should follow real package changes
- contributors need a predictable way to describe user-facing change

## Common Commands

```bash
npx pnpm@10.13.1 changeset
npx pnpm@10.13.1 changeset:status
npx pnpm@10.13.1 release:version
npx pnpm@10.13.1 release
npx pnpm@10.13.1 release:publish
```

## How to Choose a Version Bump

- `patch`: bug fixes, internal corrections, and safe behavior improvements
- `minor`: backward-compatible new capabilities
- `major`: breaking changes, removed behavior, or incompatible API shifts

## Writing Good Release Notes

- explain user impact, not internal implementation detail
- mention breaking changes clearly
- call out migration work when needed
- keep summaries specific to the affected package

## Important Notes

- Publishable packages today: `@jayoncode/browser-lifecycle`, `@jayoncode/form-intelligent`, `@jayoncode/object-diff`, plus their framework/schema adapters under `packages/`
- Docs and playgrounds are excluded from changesets release planning (`ignore` in `config.json`)
- `onlyUpdatePeerDependentsWhenOutOfRange: true` applies **repo-wide**: peer dependents (form-intelligent _and_ browser-lifecycle adapters) only get a **major** when the new peer version leaves their declared range — not on every core minor
- publishing runs through `pnpm release:publish` after the release versioning pull request merges
- GitHub draft releases should be reviewed before any future publication step
- detailed `changeset:status` output depends on a git repository with a `main`/`master` branch reference
