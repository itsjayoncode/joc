# JOC Remediation Plan

This document tracks the ecosystem alignment work identified during the July 2026 architecture review.

## Goals

1. Keep repository status docs accurate as Phase 2 and Phase 3 progress.
2. Resolve naming drift between construction docs, packages, apps, and the docs site.
3. Close automation gaps so local validation matches CI expectations.
4. Enforce package blueprint requirements on production packages.

## Naming Convention (Canonical)

| Surface            | Name                                    | Notes                                                                                |
| ------------------ | --------------------------------------- | ------------------------------------------------------------------------------------ |
| Public package     | `@jayoncode/browser-lifecycle`          | npm scope for publishable libraries                                                  |
| Package folder     | `packages/browser-lifecycle`            | Source of truth in the monorepo                                                      |
| Engineering app    | `@jayoncode/browser-session-playground` | Private workspace app using the shared `@jayoncode` scope                            |
| Construction alias | "Browser Session"                       | Historical product label in Phase 2/3 construction docs; maps to `browser-lifecycle` |

Construction documents under `_constuction/phase 2` and `_constuction/phase 3` may still say "Browser Session" or `@jayoncode/browser-session`. Treat those as the same product track as `@jayoncode/browser-lifecycle` unless a future rename is explicitly approved.

## Completed Remediation Items

- [x] Update `README.md`, `ROADMAP.md`, `ARCHITECTURE.md`, and `CONTRIBUTING.md` to reflect current phase
- [x] Fix VitePress navigation links to `/packages/browser-lifecycle/`
- [x] Document naming convention in `ARCHITECTURE.md`
- [x] Fix ESLint failures in playground and shared test files
- [x] Include `apps/browser-session-playground` tests in root Vitest
- [x] Extend `scripts/check-package-blueprint.mjs` for production packages
- [x] Add `packages/browser-lifecycle/CHANGELOG.md`
- [x] Add `FUTURE_PLAYGROUND_ITEMS` export and align playground UI context types
- [x] Fill Phase 3.3 and 3.4 construction spec outlines

## Remaining Follow-Ups

- Wire module routes in `browser-session-playground` as each Phase 3 milestone ships
- Implement Phase 3.4 Visibility Playground UI
- Decide whether to rename construction docs from "browser-session" to "browser-lifecycle"
- Adopt `turbo run` in root scripts when task graph caching becomes worthwhile
