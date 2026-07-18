---
title: JOC Ecosystem
description: How the JayOnCode monorepo is organized — packages, apps, docs, playgrounds, and how new libraries land.
---

# Ecosystem

JOC is **one repository, many libraries**. It is not a single runtime you install — it is a monorepo of `@jayoncode/*` packages that share standards, tooling, and documentation, while remaining independently versioned on npm.

## At a glance

```text
Your app (React / Vue / Angular / Svelte / vanilla)
        ↓
  @jayoncode/* packages  (+ optional framework adapters)
        ↓
  Headless TypeScript cores (typed · tree-shakeable · SSR-aware)
```

## Repository map

| Area           | Purpose                                                    |
| -------------- | ---------------------------------------------------------- |
| `packages/`    | Public libraries (`@jayoncode/*`) and internal shared code |
| `apps/`        | Docs site and interactive playgrounds                      |
| `examples/`    | Framework integration demos                                |
| `templates/`   | Package blueprint every new library starts from            |
| `engineering/` | Architecture, versioning, and operational policy           |
| `.github/`     | CI, templates, and automation                              |

## Live surface area

| Package           | Docs                                                           | Playground                             |
| ----------------- | -------------------------------------------------------------- | -------------------------------------- |
| Browser Lifecycle | [`/packages/browser-lifecycle/`](/packages/browser-lifecycle/) | [Open](/playground/browser-lifecycle/) |
| Form Intelligence | [`/packages/form-intelligence/`](/packages/form-intelligence/) | [Open](/playground/form-intelligence/) |
| Object Diff       | [`/packages/object-diff/`](/packages/object-diff/)             | [Open](/playground/object-diff/)       |

Upcoming libraries will be **announced** as they enter development — see the [roadmap](/roadmap/). They appear under [Packages](/packages/) when they ship.

## Documentation model

### Monorepo layer (JayOnCode / JOC)

- [Introduction](/getting-started/introduction) — what JOC is and why it exists
- [Philosophy](/getting-started/philosophy) — design rules
- [Package catalog](/packages/) — live libraries (new ones announced when ready)
- [Contributor guides](/guides/contribution)
- [Roadmap](/roadmap/)

### Package layer

Each live package owns `/packages/<name>/`:

- Overview and learning path
- Guides, API reference, examples, FAQ
- Versioned archives for published releases
- Playground entry when interactive docs apply

Source docs live next to package code and sync into this VitePress site — so API truth and prose stay aligned.

## Growth model

New packages follow the same path:

1. Scaffold from `templates/package-template/`
2. Meet [package standards](/guides/package-standards) and blueprint checks
3. Ship docs + (usually) a playground
4. Version with Changesets; archive docs on release

That keeps the collection coherent as JOC expands — without forcing consumers onto a single mega-version.
