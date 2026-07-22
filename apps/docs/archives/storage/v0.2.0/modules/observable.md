---
title: Observable
description: Storage documentation for Observable.
---

# Observable

**Status:** Stable  
**Import:** `@jayoncode/storage/observable`

**Previous:** [Snapshots](/packages/storage/modules/snapshots) · **Next:** [Diagnostics](/packages/storage/modules/diagnostics)

In-process watchers and lifecycle events. Opt-in via `observe()` — does **not** sync across tabs.

```ts
import { createStorage, createMemoryAdapter } from "@jayoncode/storage";
import { observe } from "@jayoncode/storage/observable";

const storage = observe(
  createStorage({
    namespace: "app",
    adapter: createMemoryAdapter(),
  }),
);

const stop = storage.watch("theme", (value) => {
  console.log("theme", value);
});

storage.on("expired", ({ key, via }) => {
  console.log("expired", key, via);
});

storage.set("theme", "dark");
stop();
```

## Events

`set` · `remove` · `clear` · `expired` · `migrated`

Successful plain reads do not emit. Listener errors are isolated.

See also: [Core](/packages/storage/modules/core)
