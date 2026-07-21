# JOC Roadmap

How the JOC ecosystem grows. **Accepted governance** lives under [`engineering/ecosystem/`](engineering/ecosystem/). This file is the contributor-facing phase summary.

**Composition without coupling.** Independent packages first; shared infrastructure only when experience proves it.

For the product-facing summary on the docs site, see [Roadmap](https://itsjayoncode.github.io/joc/roadmap/).

---

## Phase model

| #   | Phase                           | Status                             | Focus                                                  |
| --- | ------------------------------- | ---------------------------------- | ------------------------------------------------------ |
| 1   | Ecosystem Foundation            | ✅ Complete                        | Vision, architecture, standards, governance            |
| 2   | Repository Platform             | ✅ Complete                        | Monorepo, CI, Changesets, docs site, templates         |
| 3   | Product Foundation              | ✅ Complete                        | Browser Lifecycle, Form Intelligence, Object Diff      |
| 4   | Product Maturation              | 🟢 Sufficiently mature (ongoing)   | APIs, tests, playgrounds, docs, budgets, light recipes |
| 5   | Architecture Convergence        | 🟢 Complete (ADRs Accepted)        | Boundaries, terminology, shared-candidate matrix       |
| 6   | Selective Shared Infrastructure | ⏸ Blocked (no Extract)             | Extract only proven internals → `packages/shared`      |
| 7   | Developer Tooling               | 🟢 Usable (`pnpm joc`)             | Package + playground generators                        |
| 8   | Ecosystem Expansion             | 🟡 Incubating `@jayoncode/storage` | Package + playground + docs site wired (private 0.0.0) |
| 9   | Integration & Adoption          | 🟢 Kickoff bar met                 | Composition + website landing + examples               |
| 10  | Platform Evolution              | ❌ Closed                          | No platform pain demonstrated                          |

Governance, ADRs, matrix, and package briefs: [`engineering/ecosystem/`](engineering/ecosystem/).

---

## Current era — Storage shipping in-repo

| Item                      | Status                                                                                                                      |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| Phase 6 `packages/shared` | Blocked — [ADRs 0004–0007](engineering/ecosystem/adr/) Accepted, [zero Extract](engineering/ecosystem/shared-candidates.md) |
| Phase 8 Storage           | **Incubating** — `packages/storage` + docs + `pnpm storage-playground:dev`                                                  |
| Phase 10 platform         | **Closed** — [governance.md](engineering/ecosystem/governance.md)                                                           |
| Incubation rule           | One flagship at a time until Product Maturation                                                                             |

**Surfaces**

- Package: `packages/storage`
- Playground: `pnpm storage-playground:dev`
- Brief: [engineering/ecosystem/briefs/storage.md](engineering/ecosystem/briefs/storage.md)
- Docs: [`/packages/storage/`](https://itsjayoncode.github.io/joc/packages/storage/)
- Website app: `pnpm website:dev`
- CLI: `pnpm joc help`

---

## Next milestones

1. Publish `@jayoncode/storage@0.1.0` to npm — `pnpm build:packages && pnpm release:publish` when ready
2. Docs site `/packages/storage/` wired; deploy docs with the release
3. Keep live packages trustworthy (SemVer, docs, playgrounds)
4. Do **not** invent `packages/shared` unless Extract evidence appears

Additional `@jayoncode/*` packages are **to be announced**. Package boundaries and independence remain non-negotiable ([ADR-0001](engineering/ecosystem/adr/0001-package-independence.md)).

---

## Principles (short)

- Product depth over ecosystem breadth
- Patterns over forced API uniformity ([terminology](engineering/ecosystem/terminology-teardown.md))
- Documentation and playgrounds are part of the product
- No framework by accident ([ADR-0003](engineering/ecosystem/adr/0003-no-framework-by-default.md))
- Shared infrastructure is earned ([ADR-0002](engineering/ecosystem/adr/0002-shared-infrastructure-policy.md))

Full list: [governance.md](engineering/ecosystem/governance.md).

---

## Naming note

Older docs may say “Browser Session” or `@jayoncode/browser-session`. The canonical package is `@jayoncode/browser-lifecycle` in `packages/browser-lifecycle`.
