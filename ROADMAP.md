# JOC Roadmap

How the JOC ecosystem grows. Detailed planning lives under [`_construction/ecosystem-update/`](_construction/ecosystem-update/); this file is the contributor-facing summary.

**Composition without coupling.** Independent packages first; shared infrastructure only when experience proves it.

For the product-facing summary on the docs site, see [Roadmap](https://itsjayoncode.github.io/joc/roadmap/).

---

## Phase model

| #   | Phase                           | Status         | Focus                                                     |
| --- | ------------------------------- | -------------- | --------------------------------------------------------- |
| 1   | Ecosystem Foundation            | ✅ Complete    | Vision, architecture, standards, governance               |
| 2   | Repository Platform             | ✅ Complete    | Monorepo, CI, Changesets, docs site, templates            |
| 3   | Product Foundation              | ✅ Complete    | Browser Lifecycle, Form Intelligence, Object Diff         |
| 4   | Product Maturation              | 🟡 **Current** | APIs, tests, playgrounds, docs, budgets, light recipes    |
| 5   | Architecture Convergence        | 🔜 Next        | Boundaries, terminology, shared-candidate matrix          |
| 6   | Selective Shared Infrastructure | Future         | Extract only Phase 5–proven internals → `packages/shared` |
| 7   | Developer Tooling               | Future         | Package/playground generators (can parallelize with 5)    |
| 8   | Ecosystem Expansion             | Future         | One new package at a time (admission checklist required)  |
| 9   | Integration & Adoption          | Future         | Composition guides, website, examples, community          |
| 10  | Platform Evolution              | Optional       | Shared runtime only if real pain demands it               |

Full exit criteria, principles, and ADRs: [`_construction/ecosystem-update/`](_construction/ecosystem-update/).

---

## Current era — Product Maturation (Phase 4)

| Package                        | Role                                                             | Notes                             |
| ------------------------------ | ---------------------------------------------------------------- | --------------------------------- |
| `@jayoncode/browser-lifecycle` | Visibility, focus, idle, connectivity, cross-tab                 | Harden + adapters                 |
| `@jayoncode/form-intelligence` | Headless forms (validation, rules, drafts, wizards, captcha, UI) | Recipes + adapter polish          |
| `@jayoncode/object-diff`       | Deep diff, change records, JSON Patch                            | Composition docs with forms/state |

**Active priorities**

1. API polish, tests, and performance budgets on live packages
2. Docs / playground fidelity with every release
3. Honest SemVer + Changesets; versioned doc archives
4. Light composition recipes (Browser ↔ Form, Diff ↔ Form) **without** coupling packages
5. Treat Phase 4 as **sufficiently mature** before starting Architecture Convergence — docs/playground polish may continue forever in parallel

---

## Next milestones

1. **Architecture Convergence (Phase 5)** — Shared Candidates Matrix (`Extract` / `Defer` / `Keep Local` / `Reject`) + ADRs; no shared code by default
2. **Selective Shared Infrastructure (Phase 6)** — only evidence-validated internals; publishing shared modules is not the default
3. **Developer Tooling (Phase 7)** — scaffold from `templates/package-template/`
4. **Expansion (Phase 8)** — announce packages only when problem + audience + playground plan exist

Additional `@jayoncode/*` packages are **to be announced**. Package boundaries and independence remain non-negotiable ([ADR-0001](_construction/ecosystem-update/adr/0001-package-independence.md)).

---

## Principles (short)

- Product depth over ecosystem breadth
- Patterns over forced API uniformity
- Documentation and playgrounds are part of the product
- No framework by accident ([ADR-0003](_construction/ecosystem-update/adr/0003-no-framework-by-default.md))
- Shared infrastructure is earned ([ADR-0002](_construction/ecosystem-update/adr/0002-shared-infrastructure-policy.md))

---

## Naming note

Older construction docs may say “Browser Session” or `@jayoncode/browser-session`. The canonical package is `@jayoncode/browser-lifecycle` in `packages/browser-lifecycle`.
