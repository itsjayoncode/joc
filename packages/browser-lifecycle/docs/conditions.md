# Conditions

Thin event DSL for declarative reactions. Handler errors are isolated from the session.

**Previous:** [Wait helpers](./wait.md) · **Next:** [Resilience](./resilience.md)

## Import path

```ts
import { createBrowserLifecycle, createConditionsApi } from "@jayoncode/browser-lifecycle";
```

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

## Error isolation

Pass `onHandlerError` to observe (e.g. log) handler exceptions without letting them escape:

```ts
const when = createConditionsApi(lifecycle, {
  onHandlerError: (error) => reportToSentry(error),
});
```

When omitted, thrown errors from a condition handler are swallowed silently — the session keeps running either way.

[Resilience →](./resilience.md)
