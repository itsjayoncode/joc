# Activity

Derive active / idle status from the core session (requires `idleTimeout` on the session for idle observation).

**Previous:** [Intelligence overview](./intelligence.md) · **Next:** [Presence](./presence.md)

## Import path

```ts
import { createBrowserLifecycle, createActivityApi } from "@jayoncode/browser-lifecycle";
```

Main package only. Call `dispose()` on the underlying session when done.

## Usage

```ts
import { createBrowserLifecycle, createActivityApi } from "@jayoncode/browser-lifecycle";

const lifecycle = createBrowserLifecycle({ idleTimeout: 30_000 });
const activity = createActivityApi(lifecycle);

activity.isActive();
activity.isIdle();
activity.lastInteraction();
activity.idleTime(); // current idle streak (ms)

activity.dispose(); // does not dispose the session
lifecycle.dispose();
```

## Notes

- Does **not** attach pointer/keyboard listeners — Idle module owns that.
- Use `trackLastActiveAt: false` for a pure snapshot projector with zero subscriptions.

[Presence →](./presence.md)
