---
title: Cross Tab
description: Storage documentation for Cross Tab.
---

# Cross-tab sync

**Status:** Stable (0.2)  
**Import:** `@jayoncode/storage/cross-tab`

**Previous:** [Async](/packages/storage/modules/async) · **Next:** [Composition](/packages/storage/modules/composition)

Notify other same-origin tabs when a **sync** storage instance writes. Notify-only — no silent remote merge, no multi-tab ACID.

## Quick start

```ts
import { createStorage, createLocalStorageAdapter } from "@jayoncode/storage";
import { enableCrossTabSync } from "@jayoncode/storage/cross-tab";

const base = createStorage({
  namespace: "app",
  adapter: createLocalStorageAdapter(),
});

const { storage, stop } = enableCrossTabSync(base, {
  onRemote: (event) => {
    // event.type: "set" | "remove" | "clear"
    // Re-read with storage.get(event.key) if you need the value
    refreshUi();
  },
});

storage.set("theme", "dark"); // broadcasts to other tabs
// later:
stop();
```

## Behavior

| Mechanism                | Role                                            |
| ------------------------ | ----------------------------------------------- |
| `BroadcastChannel`       | Primary (`joc-storage:${namespace}` by default) |
| `window` `storage` event | Extra signal when using `localStorage`          |

Use the returned `storage` for writes so broadcasts fire. `get` / `peek` / `has` still read locally.

## Options

| Option                | Default                    | Notes                           |
| --------------------- | -------------------------- | ------------------------------- |
| `channel`             | `joc-storage:${namespace}` | BroadcastChannel name           |
| `onRemote`            | —                          | Callback for peer changes       |
| `listenStorageEvents` | `true`                     | Toggle `storage` event listener |

## Non-goals

- Applying remote envelopes automatically
- Syncing IndexedDB async instances (use app-level BroadcastChannel if needed)
- Replacing [Observable](/packages/storage/modules/observable) (in-process) or [Transactions](/packages/storage/modules/transactions) (same-tab)

See also: [Async](/packages/storage/modules/async) · [FAQ](/packages/storage/modules/faq)
