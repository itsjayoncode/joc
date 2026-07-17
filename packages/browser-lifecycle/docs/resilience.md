# Resilience

Named helpers for reconnect / wake / restore workflows (canonical name **Resilience**, not “Recovery”).

**Previous:** [Conditions](./conditions.md) · **Next:** [Adapters](./adapters.md)

## Import path

```ts
import { createBrowserLifecycle, createResilienceApi } from "@jayoncode/browser-lifecycle";
```

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

[Framework adapters →](./adapters.md)
