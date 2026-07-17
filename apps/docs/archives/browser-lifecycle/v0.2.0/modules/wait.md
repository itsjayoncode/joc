---
title: Wait
description: Browser Lifecycle module documentation for Wait.
---

# Wait helpers

Subscription-based promises for common lifecycle conditions — **no polling**.

**Previous:** [Reports](/packages/browser-lifecycle/modules/reports) · **Next:** [Conditions](/packages/browser-lifecycle/modules/conditions)

## Usage

```ts
import { createBrowserLifecycle, createWaitApi } from "@jayoncode/browser-lifecycle";

const lifecycle = createBrowserLifecycle();
const wait = createWaitApi(lifecycle);

await wait.untilVisible({ timeoutMs: 5_000 });
await wait.untilOnline();
await wait.untilFocused();

wait.dispose();
lifecycle.dispose();
```

Also: `untilHidden`, `untilBlurred`, `untilOffline`.

Supports `AbortSignal` via options. Resolves immediately if already satisfied.

[Conditions →](/packages/browser-lifecycle/modules/conditions)
