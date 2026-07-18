# JOC Roadmap

This roadmap describes how the JOC ecosystem grows. Phases 1–3 established the foundation and first package loop; the ecosystem now has **multiple live packages** and continues to expand deliberately.

For the product-facing summary, see the docs [Roadmap](https://itsjayoncode.github.io/joc/roadmap/).

---

## Completed foundation (Phases 1.1–1.6)

- pnpm + Turborepo workspace, architecture, and governance docs
- Lint, format, test, TypeScript, and package script conventions
- GitHub Actions CI, quality, CodeQL, Dependabot, templates
- VitePress docs platform, sync scripts, versioned package archives
- Release engineering via Changesets and publish safeguards
- Package blueprint / template every new library inherits

## Completed first-product loop (Phases 2–3)

- `@jayoncode/browser-lifecycle` — session lifecycle core + modules
- Browser session playground as QA, docs, and showcase surface
- Docs integration and release validation for the first public track

---

## Current era — live ecosystem

| Package                        | Role                                                         | Notes                                   |
| ------------------------------ | ------------------------------------------------------------ | --------------------------------------- |
| `@jayoncode/browser-lifecycle` | Visibility, focus, idle, connectivity, cross-tab             | Live; continue hardening + adapters     |
| `@jayoncode/form-intelligence` | Headless form workflows (validation, rules, drafts, wizards) | Live; expand recipes + adapter polish   |
| `@jayoncode/object-diff`       | Deep diff, change records, JSON Patch                        | Live; composition docs with forms/state |

**Active priorities**

1. API polish, tests, and performance budgets on live packages
2. Docs / playground fidelity with every release
3. Honest SemVer + Changesets; versioned doc archives
4. Composition guides without coupling public packages

---

## Next — ecosystem expansion

Additional `@jayoncode/*` packages are **to be announced**. We will publish which libraries enter active development as they are scheduled — see the docs [Roadmap](https://itsjayoncode.github.io/joc/roadmap/) and GitHub Discussions for announcements.

New packages will still follow the blueprint (template → standards → docs → playground → Changesets). Package boundaries and independence remain non-negotiable.

---

## Naming note

Older construction docs may say “Browser Session” or `@jayoncode/browser-session`. The canonical package is `@jayoncode/browser-lifecycle` in `packages/browser-lifecycle`.
