---
title: JOC Roadmap
description: Where JayOnCode is today, what ships next across @jayoncode/* packages, and the long-term ecosystem vision.
---

# Roadmap

This page is the **product-facing** view of where JOC is and where it’s going. For phase-by-phase engineering history, see the repository [ROADMAP.md](https://github.com/itsjayoncode/joc/blob/master/ROADMAP.md).

## Where we are

JOC has moved past “foundation only.” The monorepo standards, docs platform, CI/release pipeline, and playgrounds are in place — and **three live packages** are available for real apps:

| Package                                                        | Focus                                                        | Status      |
| -------------------------------------------------------------- | ------------------------------------------------------------ | ----------- |
| [`@jayoncode/browser-lifecycle`](/packages/browser-lifecycle/) | Session signals — visibility, idle, connectivity, cross-tab  | Live on npm |
| [`@jayoncode/form-intelligence`](/packages/form-intelligence/) | Headless form workflows — validation, rules, drafts, wizards | Live on npm |
| [`@jayoncode/object-diff`](/packages/object-diff/)             | Deep diff, change records, JSON Patch                        | Live on npm |

Each ships with docs, SemVer/changesets, and an interactive [playground](/playground/).

## Near term

Priorities that improve the packages you can already install:

1. **Harden live packages** — API polish, performance budgets, adapter coverage, and clearer migration notes.
2. **Docs & DX** — keep learning paths, versioned archives, and playgrounds aligned with every release.
3. **Release hygiene** — predictable Changesets, CI gates, and publish confidence for `@jayoncode/*`.
4. **Cross-package composition** — documented recipes (e.g. form dirty state via object-diff, lifecycle-aware autosave) without coupling cores.

## Next packages (ecosystem expansion)

New `@jayoncode/*` libraries are **to be announced**. We’ll share what we’re building next as packages move onto the active development track — watch this page, [GitHub Discussions](https://github.com/itsjayoncode/joc/discussions), and package changelogs for updates.

## Longer-term vision

JOC should feel like a **cohesive toolkit of independent libraries**:

- One mental model: headless TypeScript cores + thin framework adapters
- Install only what you need; tree-shake the rest
- Docs and playgrounds that make adoption boringly predictable
- Room to grow new problem spaces without breaking package boundaries

We are **not** building a single mega-framework or UI kit. We are building the missing infrastructure layers apps keep rewriting.

## How priorities are chosen

- Real consumer pain over novelty
- Clear package boundaries over “just add it to an existing library”
- Docs/playground readiness as part of “done”
- SemVer honesty — additive APIs preferred; breaks are rare and called out

## Shape the roadmap

- Open an [issue](https://github.com/itsjayoncode/joc/issues) or [discussion](https://github.com/itsjayoncode/joc/discussions) for proposals
- Read [Contributing](/guides/contribution) before large PRs
- Track package-level plans in each package’s docs and changelog

**Bottom line:** JOC is a living ecosystem — foundation shipped, three libraries live, and more focused tools ahead (announced as they enter development).
