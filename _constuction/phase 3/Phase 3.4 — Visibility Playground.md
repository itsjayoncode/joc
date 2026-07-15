# Phase 3.4 — Visibility Playground

**Status:** Complete

## Objective

Implement the Visibility Playground page at `/visibility` inside `apps/browser-session-playground`.

## Deliverables

| Deliverable | Location | Status |
|-------------|----------|--------|
| Visibility page | `src/pages/VisibilityPage.tsx` | ✅ |
| Playground hook | `src/features/visibility/use-visibility-playground.ts` | ✅ |
| Integration boundary helpers | `src/lib/browser-lifecycle.ts` | ✅ |
| Route registration | `src/routes/app-routes.tsx` | ✅ |
| Playground docs | `docs/playground.md` | ✅ |
| Engineering record | `engineering/014-visibility-playground.md` | ✅ |
| Integration tests | `src/lib/browser-lifecycle.test.ts` | ✅ |

## Acceptance Criteria

- `/visibility` renders inside the existing app shell — ✅
- Tab switching updates displayed visibility state — ✅
- Event log shows ordered `page:visible` / `page:hidden` transitions — ✅
- Page degrades gracefully when visibility capability is unavailable — ✅
- Tests cover integration helpers — ✅

## Manual QA

```bash
npx pnpm@10.13.1 browser-session-playground:dev
```

Open http://127.0.0.1:4273/visibility and switch browser tabs to observe state and event log updates.
