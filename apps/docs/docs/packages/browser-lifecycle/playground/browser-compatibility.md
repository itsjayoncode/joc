---
title: Browser Compatibility
description: Interactive playground documentation for Browser Compatibility.
---

# Browser Compatibility Matrix — v1.0.0

## Supported browsers

| Browser  | Version       | Status    | Notes                                   |
| -------- | ------------- | --------- | --------------------------------------- |
| Chrome   | Latest 2      | Supported | Full module coverage                    |
| Firefox  | Latest 2      | Supported | Page lifecycle may vary                 |
| Safari   | Latest 2      | Supported | BroadcastChannel required for cross-tab |
| Edge     | Latest 2      | Supported | Chromium-based parity                   |
| Electron | 28+           | Supported | See `examples/electron/`                |
| PWA      | Modern mobile | Supported | See `examples/pwa/`                     |

## Module fallbacks

| Module       | Fallback when unavailable                |
| ------------ | ---------------------------------------- |
| Visibility   | Snapshot stays `unknown`, no events      |
| Focus        | Snapshot stays `unknown`, no events      |
| Connectivity | Advisory offline detection only          |
| Idle         | Page shows unavailable placeholder       |
| Lifecycle    | Page shows unavailable placeholder       |
| Cross Tab    | Page shows unavailable placeholder       |
| Plugins      | Runtime still works without browser APIs |

## Test matrix

| Feature      | Chrome | Firefox | Safari | Edge |
| ------------ | ------ | ------- | ------ | ---- |
| Routing      | Pass   | Pass    | Pass   | Pass |
| Visibility   | Pass   | Pass    | Pass   | Pass |
| Focus        | Pass   | Pass    | Pass   | Pass |
| Connectivity | Pass   | Pass    | Pass   | Pass |
| Cross Tab    | Pass   | Partial | Pass   | Pass |
| Dark mode    | Pass   | Pass    | Pass   | Pass |

Manual verification performed during Phase 3.18 release validation. Automated cross-browser CI is not yet configured.
