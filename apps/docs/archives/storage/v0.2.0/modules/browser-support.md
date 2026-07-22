---
title: Browser Support
description: Storage documentation for Browser Support.
---

# Browser support

**Status:** Stable (guidance)

**Previous:** [FAQ](/packages/storage/modules/faq) · **Next:** [Security](/packages/storage/modules/security)

v1 core is **synchronous** and compatible with the Web Storage shape (`getItem` / `setItem` / `removeItem` / optional `keys`).

## Environments

| Environment        | Notes                                                 |
| ------------------ | ----------------------------------------------------- |
| Evergreen browsers | Memory + local/session when available                 |
| Vitest / jsdom     | Memory or jsdom Storage                               |
| SSR (no `window`)  | Use memory, or create web adapters only on the client |

## Web adapter degradation

When `localStorage` / `sessionStorage` is missing: reads return `null`, writes throw `AdapterError`, `removeItem` no-ops, `keys` returns `[]`.

Private / blocked storage may surface as `QuotaExceededError` or `AdapterError` — catch at write boundaries.

IndexedDB: use [`@jayoncode/storage/async`](/packages/storage/modules/async) (`createIndexedDbAdapter`). Sync core remains Web Storage–shaped.

See also: [Security](/packages/storage/modules/security) · [faq.md](/packages/storage/modules/faq)
