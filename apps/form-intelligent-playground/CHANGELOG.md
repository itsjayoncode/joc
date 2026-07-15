# Changelog

All notable changes to the Form Intelligent Playground are documented in this file.

## 1.0.0 — 2026-07-15

### Added

- Complete module playground routes: visibility, focus, connectivity, idle, lifecycle, cross-tab, plugins
- Explorer tools: events, state, configuration, performance, developer tools
- Dashboard release overview with module coverage metrics
- Settings and About workspace pages
- Release documentation: QA checklist, deployment guide, performance report, accessibility checklist, browser compatibility matrix
- Production deployment support for static hosts (Netlify, Vercel, Cloudflare Pages, GitHub Pages)
- Web app manifest and Open Graph metadata

### Changed

- Version bumped from `0.0.0` to `1.0.0`
- Header, footer, and dashboard copy updated for release status
- Navigation metadata removes stale "Soon" badges from live routes
- Plugin playground session cleanup unsubscribes listeners on unmount

### Fixed

- Missing `playground-lifecycle.ts` integration module
- TypeScript strict-mode issues across lifecycle, state, and configuration helpers
- ESLint issues across playground pages and package tests

## 0.0.0 — Foundation

- Playground foundation (Phase 3.1–3.3)
- Initial shell, routing, theme system, and integration boundary
