# QA Checklist — Form Intelligent Playground v1.0.0

## Build and tooling

- [x] `pnpm typecheck` passes
- [x] `pnpm lint` passes
- [x] `pnpm test` passes (124 tests)
- [x] `pnpm form-intelligent-playground:build` succeeds
- [x] `pnpm form-intelligent-playground:preview` serves production bundle

## Application startup

- [x] Dev server starts on port 4277
- [x] No console errors on initial load
- [x] Theme preference persists across reload

## Navigation and routing

- [x] All module routes resolve without 404
- [x] `/not-found` handles unknown paths
- [x] Mobile sidebar opens and closes
- [x] Recent routes tracked on dashboard

## Module pages

- [x] Dashboard
- [x] Visibility
- [x] Focus
- [x] Connectivity
- [x] Idle
- [x] Lifecycle
- [x] Cross Tab
- [x] Plugins
- [x] Events
- [x] State
- [x] Configuration
- [x] Performance
- [x] Developer Tools
- [x] Settings
- [x] About

## Theme and layout

- [x] Dark mode
- [x] Light mode
- [x] Responsive layout (mobile sidebar)
- [x] Hot reload in development

## Memory and listeners

- [x] Route changes dispose playground sessions
- [x] Plugin playground unsubscribes on unmount

## Documentation

- [x] README lists all module routes
- [x] Release notes complete
- [x] Deployment guide complete
