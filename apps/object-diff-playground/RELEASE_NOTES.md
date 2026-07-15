# Release Notes — Object Diff Playground v1.0.0

**Release date:** 2026-07-15  
**Application:** `@jayoncode/object-diff-playground`  
**Status:** Release candidate

## Overview

Object Diff Playground v1.0.0 is the first public release of the official Object Diff engineering console. It provides interactive documentation, manual QA, integration testing, and developer diagnostics for every shipped Object Diff module.

## Highlights

- **12 module playgrounds** — visibility through developer tools
- **Integrated documentation** — synced to the VitePress developer portal (Phase 3.17)
- **Framework examples** — Vanilla, React, Vue, Angular, Svelte, Next.js, Electron, PWA
- **Production build** — 362 KB JavaScript (101 KB gzip), 27 KB CSS (5 KB gzip)
- **Quality gates** — TypeScript strict, ESLint clean, 124 tests passing

## Module routes

| Route              | Feature                          |
| ------------------ | -------------------------------- |
| `/`                | Dashboard                        |
| `/visibility`      | Page visibility diagnostics      |
| `/focus`           | Window focus diagnostics         |
| `/connectivity`    | Online/offline diagnostics       |
| `/idle`            | Idle detection                   |
| `/lifecycle`       | Page lifecycle transitions       |
| `/cross-tab`       | Leader election and tab messages |
| `/plugins`         | Plugin runtime and hooks         |
| `/events`          | Full event explorer              |
| `/state`           | Snapshot explorer                |
| `/configuration`   | Configuration editor             |
| `/performance`     | Runtime diagnostics              |
| `/developer-tools` | Debug console                    |

## Upgrade notes

This is the first release. No migration from prior playground versions is required.

## Documentation

- [Deployment guide](./docs/deployment.md)
- [QA checklist](./QA_CHECKLIST.md)
- [Known issues](./KNOWN_ISSUES.md)
- [Engineering note](./engineering/023-playground-release.md)

## Try locally

```bash
pnpm object-diff-playground:dev
```

Open http://127.0.0.1:4275
