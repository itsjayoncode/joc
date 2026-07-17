# Conditions

Thin event DSL for declarative reactions. Handler errors are isolated from the session.

**Previous:** [Wait helpers](./wait.md) · **Next:** [Resilience](./resilience.md)

## Usage

```ts
import { createBrowserLifecycle, createConditionsApi } from "@jayoncode/browser-lifecycle";

const lifecycle = createBrowserLifecycle();
const when = createConditionsApi(lifecycle);

const handle = when.hidden(() => {
  // pause non-critical work
});

when.visible(() => resume());
when.focused(() => resume());
when.online(() => flushQueue());

handle.unsubscribe();
when.dispose();
```

No polling. Dispose the conditions API without disposing the session.

[Resilience →](./resilience.md)
