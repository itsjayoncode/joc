# Documentation conventions (JOC live packages)

Internal authoring guide for `packages/{form-intelligence,browser-lifecycle,object-diff}/docs`.
User-facing docs sync into the VitePress site via `pnpm docs:sync`.

## Preserve

- Playground tips and `/playground/<package>/…` links
- Package `CHANGELOG.md` (synced to site changelog pages)
- TypeDoc `/api/` (generated — link from hubs, do not hand-edit)

## Hub documents

Use for **overview**, **getting-started**, and **concepts** (package-level):

1. What it is
2. Why it exists / problems
3. When to use / when **not** to use
4. Features
5. Install
6. Quick start (one punchy example + expected result)
7. Core concepts (or link to concepts)
8. Entrypoints / subpaths (or “single entry”)
9. Learning path table with playground links
10. Related docs

## Module documents (feature guides)

1. One-line purpose + prev/next + playground tip
2. Problem → solution (short; link to overview if repeating)
3. **Import path** (main vs subpath; dual-export note when needed)
4. Quick example with expected result
5. How it works (short)
6. API / options that matter
7. Pitfalls / warnings
8. Related links

Do **not** repeat full install, full architecture, or full FAQ on every module.

## Terminology

Keep package glossaries on concepts (or overview). Prefer the glossary term over synonyms.

| Package           | Glossary location                                             | Key terms                                               |
| ----------------- | ------------------------------------------------------------- | ------------------------------------------------------- |
| Form Intelligence | [concepts.md](../packages/form-intelligence/docs/concepts.md) | format vs transform, `when()` rules, draft vs autosave  |
| Object Diff       | [concepts.md](../packages/object-diff/docs/concepts.md)       | change vs DiffResult vs patch vs merge vs query vs view |
| Browser Lifecycle | [concepts.md](../packages/browser-lifecycle/docs/concepts.md) | visibility, idle, snapshot, dispose, SSR-safe           |

## Source of truth

Edit `packages/*/docs/*.md` (and landings under `apps/docs/docs/.vitepress/theme/data/`), then run `pnpm docs:sync`. Do not hand-edit generated `modules/` copies as the primary source.
