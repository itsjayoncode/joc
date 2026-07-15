# Ecosystem

JOC is one repository, but it is not one library. It is a **monorepo of `@jayoncode/*` packages** — each focused, independently installable, and documented under its own section on this site.

## Repository areas

| Area | Purpose |
| --- | --- |
| `packages/` | Public libraries (`@jayoncode/*`) and internal shared workspace code |
| `apps/` | First-party applications — docs site and browser session playground |
| `examples/` | Framework integration examples (starting with browser-lifecycle) |
| `templates/` | Reusable scaffolds such as the standard JOC package template |
| `engineering/` | Architectural and operational model |
| `.github/` | Collaboration and automation |

## Documentation model

Docs are organized in two layers:

### Monorepo (JayOnCode / JOC)

- [Introduction](/getting-started/introduction)
- [Philosophy](/getting-started/philosophy)
- [Package catalog](/packages/)
- [Contributor guides](/guides/contribution)
- [Roadmap](/roadmap/) and [changelog](/changelog/)

### Per package

Each package owns its documentation namespace under `/packages/<name>/`:

- Overview and installation
- Guides, API reference, examples, FAQ
- Patterns, tutorials, best practices (where applicable)
- Playground docs (where applicable)

**Live today:** [Browser Lifecycle](/packages/browser-lifecycle/) — guides, API, examples, FAQ, patterns, and playground docs are all under that package path.

**Coming soon:** placeholder pages exist for Request, Scroll, Keyboard, Theme, Forms, and other planned packages so navigation stays consistent as they ship.

## Growth model

New packages follow the same blueprint: source docs in the package repo path, sync scripts into VitePress, and a dedicated sidebar under `/packages/<name>/`. That keeps the monorepo coherent as the collection grows.
