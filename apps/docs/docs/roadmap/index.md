---
title: JOC Roadmap
description: Where JayOnCode is today, what ships next across @jayoncode/* packages, and the long-term ecosystem vision.
---

# Roadmap

This page is the **product-facing** view of where JOC is and where it’s going. Engineering phase detail lives in the repository [ROADMAP.md](https://github.com/itsjayoncode/joc/blob/master/ROADMAP.md) and [`_construction/ecosystem-update/`](https://github.com/itsjayoncode/joc/tree/master/_construction/ecosystem-update).

**Composition without coupling.** Independent packages first; shared infrastructure only when experience proves it.

## Where we are

JOC is in **Product Maturation** (Phase 4): foundation and three live packages are shipped; the focus is trust — polish, docs, playgrounds, and light composition recipes.

| Package                                                        | Focus                                                        | Status      |
| -------------------------------------------------------------- | ------------------------------------------------------------ | ----------- |
| [`@jayoncode/browser-lifecycle`](/packages/browser-lifecycle/) | Session signals — visibility, idle, connectivity, cross-tab  | Live on npm |
| [`@jayoncode/form-intelligence`](/packages/form-intelligence/) | Headless form workflows — validation, rules, drafts, wizards | Live on npm |
| [`@jayoncode/object-diff`](/packages/object-diff/)             | Deep diff, change records, JSON Patch                        | Live on npm |

Each ships with docs, SemVer/Changesets, and an interactive [playground](/playground/).

### Phase snapshot

| Phase                                                                      | Status                                               |
| -------------------------------------------------------------------------- | ---------------------------------------------------- |
| 1–3 Foundation / platform / first products                                 | Complete                                             |
| **4 Product Maturation**                                                   | **Current**                                          |
| 5 Architecture Convergence                                                 | Next (shared-candidate audit — not a shared runtime) |
| 6–10 Selective shared → tooling → expansion → adoption → optional platform | Future                                               |

## Near term

1. **Harden live packages** — API polish, performance budgets, adapter coverage, migration notes.
2. **Docs & DX** — learning paths, versioned archives, and playgrounds aligned with every release.
3. **Release hygiene** — Changesets, CI gates, publish confidence.
4. **Cross-package composition** — documented recipes (e.g. [draft on tab hide](/packages/form-intelligence/modules/patterns#composition-draft-on-tab-hide-browser-lifecycle), [dirty audit / patch](/packages/form-intelligence/modules/patterns#composition-dirty-audit--patch-object-diff)) **without** coupling cores.

## Next packages (ecosystem expansion)

New `@jayoncode/*` libraries are **to be announced**. Each must answer why it deserves to exist (problem, audience, alternatives, playground plan) before scaffolding.

## Longer-term vision

JOC should feel like a **cohesive toolkit of independent libraries**:

- One mental model: headless TypeScript cores + thin framework adapters
- Install only what you need; tree-shake the rest
- Docs and playgrounds that make adoption boringly predictable
- Room to grow new problem spaces without breaking package boundaries

We are **not** building a single mega-framework or UI kit. A shared platform appears only if real multi-package pain demands it.

## How priorities are chosen

- Real consumer pain over novelty
- Clear package boundaries over “just add it to an existing library”
- Docs/playground readiness as part of “done”
- SemVer honesty — additive APIs preferred; breaks are rare and called out

## Shape the roadmap

- Open an [issue](https://github.com/itsjayoncode/joc/issues) or [discussion](https://github.com/itsjayoncode/joc/discussions) for proposals
- Read [Contributing](/guides/contribution) before large PRs
- Track package-level plans in each package’s docs and changelog

**Bottom line:** Foundation shipped, three libraries live, Product Maturation in progress — more focused tools ahead, announced as they enter development.
