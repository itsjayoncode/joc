# Changelog

## Current Status

JOC is actively implementing **Phase 2 (Browser Lifecycle Manager v1)** and **Phase 3 (Browser Session Playground)**. Phase 1 foundation milestones are complete.

## Phase 3 — Browser Session Playground

### Phase 3.3 — Browser Session Dashboard

**Objective:** Provide an operational dashboard route that explains shell readiness, integration boundaries, and upcoming module work without implementing Browser Lifecycle feature pages.

**Deliverables:**

- Dashboard route at `/` inside `apps/browser-session-playground`
- Readiness cards for shell infrastructure, module runway, and integration boundary
- Recent navigation activity sourced from playground UI state
- Clear separation between shell UI state and package runtime state

**Status:** Implemented at foundation level. Module-specific diagnostics will expand as routes are wired.

### Phase 3.4 — Visibility Playground

**Objective:** Build the first real module page that exercises `@jayoncode/browser-lifecycle` visibility behavior through the playground integration layer.

**Deliverables:**

- Route at `/visibility`
- Live session wiring through `src/lib/browser-lifecycle.ts`
- Visibility state panel, event timeline, and manual tab-switch guidance
- No direct `document` API usage outside the integration boundary

**Status:** Complete. See `src/pages/VisibilityPage.tsx` and `src/lib/browser-lifecycle.ts`.

**Dependencies:** Phase 2.2.3 Visibility Module (complete), Phase 3.2 Playground Core (complete).
