---
title: JOC Roadmap
description: Where JayOnCode is today, what ships next across @jayoncode/* packages, and the long-term ecosystem vision.
---

# Roadmap

This page is the **product-facing** view of where JOC is and where it’s going. Engineering detail: repository [ROADMAP.md](https://github.com/itsjayoncode/joc/blob/master/ROADMAP.md) and [ecosystem governance](https://github.com/itsjayoncode/joc/tree/master/engineering/ecosystem).

**Composition without coupling.** Independent packages first; shared infrastructure only when experience proves it.

## Where we are

JOC has a signed governance model: three packages live on npm, **`@jayoncode/storage` shipping in-repo** (docs + playground wired; private `0.0.0` until first publish), no premature shared core, one flagship package at a time, and platform work closed until real pain appears.

| Package                                                        | Focus                                                        | Status                         |
| -------------------------------------------------------------- | ------------------------------------------------------------ | ------------------------------ |
| [`@jayoncode/browser-lifecycle`](/packages/browser-lifecycle/) | Session signals — visibility, idle, connectivity, cross-tab  | Live on npm                    |
| [`@jayoncode/form-intelligence`](/packages/form-intelligence/) | Headless form workflows — validation, rules, drafts, wizards | Live on npm                    |
| [`@jayoncode/object-diff`](/packages/object-diff/)             | Deep diff, change records, JSON Patch                        | Live on npm                    |
| [`@jayoncode/storage`](/packages/storage/)                     | Policy-driven client persistence — adapters, TTL, migrations | Incubating (docs + playground) |

Each ships with docs, SemVer/Changesets, and an interactive [playground](/playground/).

### Phase snapshot

| Phase                                     | Status                                                                                                                               |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| 1–5 Foundation → Architecture Convergence | Complete (ADRs Accepted; [zero Extract](https://github.com/itsjayoncode/joc/blob/master/engineering/ecosystem/shared-candidates.md)) |
| 6 Selective Shared Infrastructure         | Blocked                                                                                                                              |
| 7 Developer Tooling                       | Usable (`pnpm joc`)                                                                                                                  |
| 8 Ecosystem Expansion                     | Storage incubating — package + playground + docs site wired                                                                          |
| 9 Integration & Adoption                  | Kickoff bar met                                                                                                                      |
| 10 Platform Evolution                     | Closed                                                                                                                               |

## Near term

1. **Publish Storage** — first public SemVer release when readiness checks pass; keep docs/playground in sync.
2. **Polish live packages** — APIs, budgets, adapters, playground fidelity.
3. **Composition DX** — [composition guide](/guides/composition), recipes, examples.
4. **Landing** — docs home + `apps/website` route to docs/playgrounds.

## Next packages (ecosystem expansion)

New `@jayoncode/*` libraries are **to be announced**. Each must answer why it deserves to exist (problem, audience, alternatives, playground plan, non-goals) before scaffolding — and only one flagship incubates at a time. See [ecosystem governance](/guides/ecosystem-governance).

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

**Bottom line:** Governance is public under `engineering/ecosystem/` — Storage is the current flagship incubating with docs and playground live on the site.
