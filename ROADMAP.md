# JOC Roadmap

How the JOC ecosystem grows. **Accepted governance** lives under [`engineering/ecosystem/`](engineering/ecosystem/). This file is the contributor-facing phase summary.

**Composition without coupling.** Independent packages first; shared infrastructure only when experience proves it.

For the product-facing summary on the docs site, see [Roadmap](https://itsjayoncode.github.io/joc/roadmap/).

---

## Phase model

| #   | Phase                           | Status                           | Focus                                                  |
| --- | ------------------------------- | -------------------------------- | ------------------------------------------------------ |
| 1   | Ecosystem Foundation            | ✅ Complete                      | Vision, architecture, standards, governance            |
| 2   | Repository Platform             | ✅ Complete                      | Monorepo, CI, Changesets, docs site, templates         |
| 3   | Product Foundation              | ✅ Complete                      | Browser Lifecycle, Form Intelligence, Object Diff      |
| 4   | Product Maturation              | 🟢 Sufficiently mature (ongoing) | APIs, tests, playgrounds, docs, budgets, light recipes |
| 5   | Architecture Convergence        | 🟢 Complete (ADRs Accepted)      | Boundaries, terminology, shared-candidate matrix       |
| 6   | Selective Shared Infrastructure | ⏸ Blocked (no Extract)           | Extract only proven internals → `packages/shared`      |
| 7   | Developer Tooling               | 🟢 Usable (`pnpm joc`)           | Package + playground generators                        |
| 8   | Ecosystem Expansion             | 🟢 Storage brief Accepted        | Incubate `@jayoncode/storage` (one at a time)          |
| 9   | Integration & Adoption          | 🟢 Kickoff bar met               | Composition + website landing + examples               |
| 10  | Platform Evolution              | ❌ Closed                        | No platform pain demonstrated                          |

Governance, ADRs, matrix, and package briefs: [`engineering/ecosystem/`](engineering/ecosystem/).

---

## Current era — incubate Storage

| Item                      | Status                                                                                                                      |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| Phase 6 `packages/shared` | Blocked — [ADRs 0004–0007](engineering/ecosystem/adr/) Accepted, [zero Extract](engineering/ecosystem/shared-candidates.md) |
| Phase 8 Storage           | Brief **Accepted** — [briefs/storage.md](engineering/ecosystem/briefs/storage.md)                                           |
| Phase 10 platform         | **Closed** — [governance.md](engineering/ecosystem/governance.md)                                                           |
| Incubation rule           | One flagship at a time until Product Maturation                                                                             |

**Surfaces**

- Brief: [engineering/ecosystem/briefs/storage.md](engineering/ecosystem/briefs/storage.md)
- Docs: https://itsjayoncode.github.io/joc/
- Website app: `pnpm website:dev`
- CLI: `pnpm joc help`

---

## Next milestones

1. Scaffold `@jayoncode/storage` + playground (`pnpm joc`)
2. Implement v1 per brief (explicit `createStorage` config; no shared runtime)
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
