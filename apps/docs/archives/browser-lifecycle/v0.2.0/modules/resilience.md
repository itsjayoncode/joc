---
title: Resilience
description: Browser Lifecycle module documentation for Resilience.
---

# Resilience

Named helpers for reconnect / wake / restore workflows (canonical name **Resilience**, not “Recovery”).

**Previous:** [Conditions](/packages/browser-lifecycle/modules/conditions) · **Next:** [Adapters](/packages/browser-lifecycle/modules/adapters)

## Usage

```ts
import { createBrowserLifecycle, createResilienceApi } from "@jayoncode/browser-lifecycle";

const lifecycle = createBrowserLifecycle();
const resilience = createResilienceApi(lifecycle);

resilience.onReconnect(() => flushOfflineQueue());
resilience.onWake(() => refreshStaleData()); // page:resume
resilience.onRestore(() => rehydrateUi()); // session:restored

// Fires on any of the three
const off = resilience.onRecover(() => sync());
off();

resilience.dispose();
```

Wraps catalog events only — no persistence engine, no extra browser APIs.

[Framework adapters →](/packages/browser-lifecycle/modules/adapters)
