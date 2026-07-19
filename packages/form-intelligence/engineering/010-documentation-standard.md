# Engineering Note — JOC Documentation Standard

Canonical information architecture for user-facing docs across JOC packages (`@jayoncode/form-intelligence`, `@jayoncode/object-diff`, `@jayoncode/browser-lifecycle`, and future libraries).

Organize for the **developer journey**, not repository folders. Same section names everywhere so returning readers know where Install, Concepts, Guides, and API live.

## Canonical sidebar groups

Use these labels (no emojis):

| Group           | Purpose                                               |
| --------------- | ----------------------------------------------------- |
| Overview        | Package home — Install first, short example, why/when |
| Getting Started | Productive in ≤5 minutes                              |
| Core Concepts   | What things mean — light code, tables/diagrams        |
| Guides          | One feature page each — how to solve a problem        |
| Integrations    | Framework adapters and sibling packages               |
| Examples        | Playground recipes; fuller apps when they exist       |
| API Reference   | TypeDoc (or hand-written API later)                   |
| Advanced        | Plugins, performance, extension                       |
| Support         | Migration, changelog, troubleshooting                 |
| Interactive     | External playground SPA deep links                    |

Omit a group until it has real pages. **No empty scaffolding.**

## Page roles

| Role            | Write                                                                           | Avoid                           |
| --------------- | ------------------------------------------------------------------------------- | ------------------------------- |
| Overview        | Install copy-paste, one example, learning-path map                              | Long how-tos                    |
| Getting Started | Numbered steps: install → create → validate → submit                            | Feature encyclopedias           |
| Core Concepts   | Definitions, architecture, terminology                                          | Long copy-paste tutorials       |
| Guides          | Problem → Solution → Example → API pointers → Playground → short best practices | Re-explaining the whole product |
| Integrations    | Install adapter + minimal example + best practices                              | Core engine tutorials           |
| Advanced        | Custom validators/formatters, plugin authoring, perf                            | Beginner first steps            |
| Support         | Migration and changelog only                                                    | Feature guides                  |

Do not duplicate the same topic as both a Concept and a Guide with near-identical content. Concepts name the idea; Guides teach the feature.

## Sync model

Package sources stay flat for URL stability:

- `packages/<pkg>/docs/*.md` → `apps/docs/docs/packages/<pkg>/modules/` via `scripts/sync-documentation.mjs`
- `packages/<pkg>/docs/index.md` → `apps/docs/docs/packages/<pkg>/index.md`
- Playground guides sync from the matching playground app when present

Sidebar maps pages into journey groups; disk layout does not need to mirror the IA until a planned redirect pass.

## User docs vs engineering

| Audience      | Location                                                                                        |
| ------------- | ----------------------------------------------------------------------------------------------- |
| Package users | `packages/<pkg>/docs/` (synced into VitePress)                                                  |
| Maintainers   | `packages/<pkg>/engineering/` — architecture, ADRs, release notes — **not** in the user sidebar |

## Form Intelligence mapping (first package)

| Group           | Pages                                                                                             |
| --------------- | ------------------------------------------------------------------------------------------------- |
| Getting Started | `getting-started.md`                                                                              |
| Core Concepts   | `concepts.md`, `capabilities.md`                                                                  |
| Guides          | `validation`, `submission`, `captcha`, `state`, `workflow`, `rules`, `calculations`, `formatters` |
| Integrations    | `integrations.md`, `adapters.md`                                                                  |
| Advanced        | `plugins.md` (incl. author guide), `patterns.md`                                                  |
| Support         | `migration.md`, site changelog                                                                    |
| Reference       | TypeDoc API, playground guide                                                                     |

Apply the same top-level groups to Object Diff and Browser Lifecycle in follow-up passes (collapse mega-nav depth on Browser Lifecycle).

## Related

- [009 — Documentation Integration](./009-documentation-integration.md) — sync pipeline and production URLs
