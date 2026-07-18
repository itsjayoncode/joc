---
title: JOC Philosophy
description: Design principles behind the JayOnCode monorepo — independent packages, headless cores, and contributor-ready standards.
---

# Philosophy

JOC is built on a small set of non-negotiable ideas. They explain why the monorepo looks the way it does — and what “good” means as the ecosystem grows.

## Headless first

JOC owns **orchestration**, not components. Bring your own UI. Packages expose typed state, events, and bindings (`bind()`, adapters, snapshots) so React, Vue, Angular, Svelte, and vanilla apps share one core.

## One problem per package

Each `@jayoncode/*` library has a sharp job. Prefer composing small packages over growing a mega-SDK. If a concern deserves its own version line and docs sidebar, it deserves its own package.

## Public packages stay independent

Consumers should install what they need without hidden JOC dependencies. Optional peer adapters (React hooks, schema libraries) are explicit. Shared internals live in private workspace packages — never leaked as accidental public API.

## Foundation before features

Repository quality is product quality:

- Clear architecture and package blueprints
- CI, changesets, and release gates
- Docs that sync from source and version with releases
- Playgrounds that exercise real APIs

Shipping a new package means inheriting those standards — not inventing a one-off workflow.

## Docs and playgrounds are part of the API

If it isn’t documented (and preferably tryable), it isn’t finished. Every live package should have a learning path, API reference, and an interactive playground where it makes sense.

## Open source readiness is continuous

Folder structure, contributor guides, issue templates, and automation should explain the project without a maintainer on call. That lowers the cost of collaboration and keeps reviews focused on design, not archaeology.

## What we optimize for

| Optimize for                      | Trade off                                          |
| --------------------------------- | -------------------------------------------------- |
| Explicit boundaries               | Slightly more packages instead of one kitchen sink |
| Tree-shakeable entrypoints        | More export map discipline                         |
| Predictable SemVer + changelogs   | Slower “just ship it” moments                      |
| Framework adapters as thin layers | Core stays vanilla TypeScript                      |

## Related reading

- [Introduction](/getting-started/introduction) — what JOC is today
- [Ecosystem](/getting-started/ecosystem) — how the repo is organized
- [Roadmap](/roadmap/) — near-term priorities and future tracks
- [VISION.md](https://github.com/itsjayoncode/joc/blob/master/VISION.md) — long-form product vision
