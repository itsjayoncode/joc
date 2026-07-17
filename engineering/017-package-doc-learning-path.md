# Package documentation — learning path standard

Doc flow for all `@jayoncode/*` packages. Optimized for developers: lead with a working example, then structured depth from fundamentals to advanced topics.

## Voice and tone

- **Developer-first** — assume TypeScript familiarity; define package-specific terms once.
- **Example or contrast first** — overview opens with a realistic code example **or** a **Problem → approach** table (pain vs package solution). No “5-minute picture” flowcharts or “Start here” tours.
- **Precise, not casual** — avoid “plain English”, “Try it first”, “Level N”, or “no prior knowledge” framing.
- **Balanced** — short prose between code blocks; tables for API mapping and learning paths.
- **Action-oriented** — section outcomes (“After this step…”) instead of emoji checklists.

## Source layout

```
packages/<name>/docs/
  index.md           # Use-case example → overview → documentation path
  concepts.md        # Architecture and terminology
  getting-started.md # Install → integrate → verify (tutorial)
  <topic>.md         # Progressive depth (basics → advanced)
```

Playground docs: `apps/<name>-playground/docs/playground.md`

## Page structure

### Overview (`index.md`)

1. **Title + one-line scope** — what the package does in one sentence.
2. **Example** — complete, copy-paste use case (the first thing readers see).
3. **Problem → approach** — short table contrasting typical pain without the package vs what the API provides.
4. **Overview** — 2–3 sentences on design intent and boundaries.
5. **Documentation path** — ordered table: Guide | Topics covered | Playground.
6. **Install** — `npm install` + minimal import.
7. **Package fit** — when to use / when to use something else.
8. **Reference** — API, playground guide, examples.

Optional: mermaid diagram after Overview if the flow benefits from visualization.

### Core concepts (`concepts.md`)

- Previous / Next navigation
- Architecture diagram (mermaid)
- Terminology table: Concept | Responsibility | API
- Links forward to tutorial and first topic guide

### Tutorial (`getting-started.md`)

- Prerequisites (runtime, package manager)
- Numbered integration steps with `---` separators
- Each step: code → **Outcome** (what is true after the step)
- Recap table
- Next topics with links

### Topic guides

- Previous / Next at top
- Playground link (`::: tip Playground`, not “Try it first”)
- **Problem → approach** — contrast table before API sections
- **Basics → Advanced** sections (named by behavior, not “Level 1–4”)
- Cheat sheet + link to next guide

## Sidebar structure (VitePress)

1. **Start here** — Overview, Core concepts, Tutorial
2. **Build your …** — numbered core guides
3. **Go further** — optional advanced topics
4. **Reference** — API, playground guide
5. **Interactive** — Open playground ↗ (`target: "_blank"`)

## Playground links

Use `resolvePlaygroundPath()` in sidebars. In markdown, link with `/playground/<name>/` (no `VITE_DOCS_BASE` prefix — VitePress prepends base automatically).

## Sync script

`scripts/sync-documentation.mjs` — see existing `rewrite*DocLinks()` and index sync functions.

## Checklist for new packages

- [ ] `index.md` opens with a realistic code example
- [ ] `concepts.md` + `getting-started.md` with developer tone
- [ ] Topic guides with progressive depth
- [ ] Sidebar in `apps/docs/docs/.vitepress/<name>-sidebar.ts`
- [ ] Playground `docs/playground.md` with route map
- [ ] Entry in `apps/docs/docs/packages/index.md`
- [ ] Wired in `sync-documentation.mjs`
- [ ] **Versioned docs archives enabled by default** — register in `scripts/lib/doc-versioning.mjs` (`DOC_VERSIONED_PACKAGES`), add `apps/docs/doc-versions/<id>.json`, wire versions meta into VitePress config + `DocsVersionSwitcher` / `ArchivedDocsBanner`, gitignore `v*/` + `*-versions.ts`
- [ ] Bootstrap archives on first publish: `pnpm docs:archive -- --package <id> --bootstrap`
