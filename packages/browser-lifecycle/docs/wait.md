# Wait helpers

Subscription-based promises for common lifecycle conditions — **no polling**.

**Previous:** [Reports](./reports.md) · **Next:** [Conditions](./conditions.md)

## Import path

```ts
import { createBrowserLifecycle, createWaitApi } from "@jayoncode/browser-lifecycle";
```

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

[Conditions →](./conditions.md)
