# Plugins

Add cross-cutting behavior — analytics, guards, or integrations — without forking core.

**Previous:** [Adapters](/packages/form-intelligent/modules/adapters) · **Next:** [Patterns](/packages/form-intelligent/modules/patterns)

::: tip Playground
[Plugins explorer →](/playground/form-intelligent/plugins) — register hooks and inspect the event log.
:::

## Import path

| Need                                                       | Import                                   |
| ---------------------------------------------------------- | ---------------------------------------- |
| `FormPlugin` type, `form.use()`, `createForm({ plugins })` | `@jayoncode/form-intelligent`            |
| Browser lifecycle / keyboard factories                     | `@jayoncode/form-intelligent/plugins`    |
| Middleware stage maps                                      | `@jayoncode/form-intelligent/middleware` |

Full map: [Entrypoints](/packages/form-intelligent/modules/entrypoints).

## Problem → solution

| Problem                                        | Solution                                        |
| ---------------------------------------------- | ----------------------------------------------- |
| Cross-cutting behavior scattered in app code   | `form.use(plugin)` or `createForm({ plugins })` |
| Need lifecycle + keyboard without forking core | `/plugins` factories                            |

## Overview

Plugins receive the form instance and a typed hook API. Return a cleanup function or `{ onDestroy }` for teardown.

Register at create time (convenient, same as sequential `form.use`):

```ts
import { createForm } from "@jayoncode/form-intelligent";
import { createBrowserLifecyclePlugin } from "@jayoncode/form-intelligent/plugins";

const form = createForm({
  initialValues: { notes: "" },
  plugins: [createBrowserLifecyclePlugin({ saveDraftOnHidden: true })],
});
```

Or after construction:

```ts
import type { FormPlugin } from "@jayoncode/form-intelligent";

const audit: FormPlugin = {
  name: "audit",
  order: 10,
  setup(form, api) {
    api.on("beforeSubmit", () => {
      console.log("submitting", form.values());
    });
    return {
      onDestroy() {
        console.log("audit removed");
      },
    };
  },
};

form.use(audit);
// or form.registerPlugin(audit);
```

`plugins: [a, b]` is equivalent to `form.use(a); form.use(b);` in array order (after core setup, before the initial draft-restore hook when a draft was restored).

---

## Lifecycle hooks

| Hook             | When                          | Return `false` to |
| ---------------- | ----------------------------- | ----------------- |
| `beforeValidate` | Before validation             | Cancel validation |
| `afterValidate`  | After validation              | —                 |
| `beforeSubmit`   | After valid, before transport | Cancel submit     |
| `afterSubmit`    | After submit attempt          | —                 |
| `onAutosave`     | Autosave succeeded            | —                 |
| `onDraftRestore` | Draft merged on create        | —                 |

```ts
api.on("beforeSubmit", () => false); // block submit
api.on("afterValidate", ({ valid, paths }) => {
  console.log(paths, valid);
});
```

### Middleware ↔ hooks (same stack)

`form.useMiddleware` and plugin hooks share one interceptor pipeline (`MIDDLEWARE_HOOK_MAP` / `PLUGIN_PIPELINE_STAGES`):

| Stage / hook     | Role                               |
| ---------------- | ---------------------------------- |
| `beforeValidate` | Guard validation                   |
| `validate`       | Core validation (documented stage) |
| `afterValidate`  | Observe validation                 |
| `beforeSubmit`   | Guard submit                       |
| `submit`         | Transport (documented stage)       |
| `afterSubmit`    | Observe submit                     |
| `submitError`    | Middleware-only error phase        |

Middleware-only phases: `submitError`, `beforeSetValue`, `afterSetValue`.

Per phase, onion middleware runs first (lower `order` = outer), then plugin hooks. `ctx.halt()` (or skipping `next()` on guard phases) cancels like returning `false` from a hook.

```ts
import {
  MIDDLEWARE_HOOK_MAP,
  PLUGIN_PIPELINE_STAGES,
} from "@jayoncode/form-intelligent/middleware";

form.useMiddleware({
  name: "audit",
  order: 0,
  phases: ["beforeSubmit"],
  run: async (ctx, next) => {
    console.log("submit", ctx.form.values());
    await next();
  },
});
```

### Error isolation (Phase 15)

Plugin and middleware failures are isolated so one bad extension cannot brick the form:

| Failure                                         | Behavior                                               |
| ----------------------------------------------- | ------------------------------------------------------ |
| `setup` throw                                   | Reported via `onPluginError`; plugin is not registered |
| Guard hook / middleware throw (`before*`)       | Cancels the phase; form stays usable                   |
| Observer hook throw (`after*`, autosave, draft) | Reported; remaining handlers still run                 |
| Incompatible `engines`                          | Throws `ConfigurationError` at register time           |

```ts
const form = createForm({
  initialValues: { email: "" },
  onPluginError: ({ plugin, hook, phase, error }) => {
    console.warn(plugin, hook ?? phase, error);
  },
});

form.use({
  name: "audit",
  version: "1.0.0",
  engines: ">=3.1.0",
  setup(form, api) {
    api.on("afterSubmit", () => {
      /* … */
    });
  },
});
```

---

## Form events (lower level)

| Event                    | Fires when                 |
| ------------------------ | -------------------------- |
| `change`                 | A value updates            |
| `blur` / `focus`         | Field binding events       |
| `validate` / `validated` | Validation runs / finishes |
| `submit`                 | Submit starts              |
| `autosave`               | Autosave triggers          |
| `draft`                  | Draft persisted            |
| `reset`                  | Form resets                |

```ts
setup(form) {
  return form.on("change", () => console.log("changed"));
}
```

---

## Built-in plugin factories

```ts
import {
  createBrowserLifecyclePlugin,
  createDevToolsPlugin,
  createKeyboardPlugin,
  keyboard,
} from "@jayoncode/form-intelligent/plugins";

const form = createForm({
  initialValues: { notes: "" },
  plugins: [
    createBrowserLifecyclePlugin({ saveDraftOnHidden: true }),
    createDevToolsPlugin(),
    createKeyboardPlugin([keyboard.shortcut("mod+s", (f) => f.saveDraft())]),
  ],
});
```

Aliases: `browserLifecyclePlugin`, `devtoolsPlugin`.

---

## Cleanup

```ts
setup(form, api) {
  const off = api.on("afterSubmit", handler);
  return () => {
    off();
  };
}
```

Destroying the form runs all plugin cleanups.

**Next:** [Patterns](/packages/form-intelligent/modules/patterns) — wizard, offline submit, plugin recipes.
