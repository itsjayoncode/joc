---
title: Performance Report
description: Interactive playground documentation for Performance Report.
---

# Performance Report — v1.0.0

**Measured:** 2026-07-15  
**Build:** `pnpm browser-session-playground:build`

## Bundle size

| Asset         | Size (uncompressed) | Gzip   |
| ------------- | ------------------- | ------ |
| Total `dist/` | ~390 KB             | —      |
| `index-*.js`  | 362 KB              | 101 KB |
| `index-*.css` | 27 KB               | 5 KB   |
| `index.html`  | 1 KB                | 0.5 KB |

## Targets

| Metric               | Target                   | Result        |
| -------------------- | ------------------------ | ------------- |
| Fast startup         | < 500 KB JS uncompressed | Pass (362 KB) |
| Minimal CSS          | < 50 KB                  | Pass (27 KB)  |
| Tree-shakeable build | ESM output               | Pass          |
| Single main chunk    | Acceptable for v1        | Pass          |

## Runtime observations

- Module pages create sessions on mount and dispose on unmount (no duplicate listener leaks in plugin playground after fix)
- Event explorers cap log buffers (100–200 entries) to limit memory growth
- `getRuntimeDiagnostics()` available for performance playground profiling

## Recommendations

- Add route-based code splitting in a future release if bundle grows beyond 250 KB
- Lazy-load module pages with `React.lazy` when adding heavy visualizations
- Keep playground integration logic in `src/lib/*` to preserve tree-shaking boundaries

