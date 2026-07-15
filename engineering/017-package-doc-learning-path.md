# Package documentation — learning path standard

Standard doc flow for all `@jayoncode/*` packages. Form Intelligent, Object Diff, and Browser Lifecycle follow this pattern.

## Source layout

```
packages/<name>/docs/
  index.md           # Overview + learning path tables
  concepts.md        # 3-minute mental model + diagram
  getting-started.md # Step-by-step tutorial (numbered steps)
  <topic>.md         # Progressive guides (Level 1 → 4)
```

Playground docs live in `apps/<name>-playground/docs/playground.md`.

## Page structure

### Overview (`index.md`)

- One-line value proposition
- `::: info` callout explaining the package in plain language
- Mermaid flowchart (5-minute picture)
- **Learning path** tables: Beginner → Intermediate → Advanced
- Each row: guide link + "Try it live" playground link
- Install + copy-paste starter
- "Is this the right package?" decision table
- Reference links (API, playground guide)

### Core concepts (`concepts.md`)

- **Previous / Next** navigation
- Mermaid architecture diagram
- Plain-English table mapping concepts to APIs
- Forward links to tutorial and first topic guide

### Tutorial (`getting-started.md`)

- Numbered steps with `---` separators
- Each step ends with `✅ You now have…`
- Recap table
- "What to learn next" with playground links

### Topic guides

- **Previous / Next** at top
- `::: tip Try it first` with playground link
- **In plain English** section before code
- **Level 1 → 4** progression (basics first)
- Cheat sheet + link to next guide

## Sidebar structure (VitePress)

1. **Start here** — Overview, Core concepts, Tutorial
2. **Build your …** — numbered core guides
3. **Go further** — optional advanced topics
4. **Reference** — API, playground guide
5. **Interactive** — Open playground ↗

Legacy content (FAQ, patterns, best practices) stays collapsed under separate groups.

## Playground URLs

Use site-relative paths so they work with `VITE_DOCS_BASE`:

- `/playground/<package-slug>/`
- `/playground/<package-slug>/<route>`

Not `http://127.0.0.1:…` in user-facing docs.

## Sync script

`scripts/sync-documentation.mjs`:

- `index.md` → `apps/docs/docs/packages/<name>/index.md`
- Other docs → `apps/docs/docs/packages/<name>/modules/`
- `rewrite*DocLinks()` transforms `./foo.md` → `/packages/<name>/modules/foo`

## Checklist for new packages

- [ ] `packages/<name>/docs/index.md` with learning path
- [ ] `concepts.md` + `getting-started.md`
- [ ] Topic guides with Previous/Next + Try it first
- [ ] Sidebar in `apps/docs/docs/.vitepress/<name>-sidebar.ts`
- [ ] Playground `docs/playground.md` with docs ↔ route map
- [ ] Entry in `apps/docs/docs/packages/index.md`
- [ ] Sync + format wired in `sync-documentation.mjs`
