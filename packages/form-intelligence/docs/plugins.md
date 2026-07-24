# Plugins

Add cross-cutting behavior — analytics, guards, or integrations — without forking core.

**Previous:** [Adapters](/packages/form-intelligence/modules/adapters) · **Next:** [Patterns](/packages/form-intelligence/modules/patterns)

::: tip Playground
[Plugins explorer →](/playground/form-intelligence/plugins) — register hooks and inspect the event log.
:::

## Import path

| Need                                                       | Import                                    |
| ---------------------------------------------------------- | ----------------------------------------- |
| `FormPlugin` type, `form.use()`, `createForm({ plugins })` | `@jayoncode/form-intelligence`            |
| Browser lifecycle / keyboard factories                     | `@jayoncode/form-intelligence/plugins`    |
| Middleware stage maps                                      | `@jayoncode/form-intelligence/middleware` |
| UI policies (`ui()`)                                       | `@jayoncode/form-intelligence/ui`         |
| CAPTCHA (`captcha()`, `turnstile()`)                       | `@jayoncode/form-intelligence/captcha`    |
| Upload transport (`uploadTransport()`)                     | `@jayoncode/form-intelligence/upload`     |
| DevTools inspector                                         | `@jayoncode/form-intelligence/devtools`   |

Full map: [Entrypoints](/packages/form-intelligence/modules/entrypoints).

## Problem → solution

| Problem                                        | Solution                                        |
| ---------------------------------------------- | ----------------------------------------------- |
| Cross-cutting behavior scattered in app code   | `form.use(plugin)` or `createForm({ plugins })` |
| Need lifecycle + keyboard without forking core | `/plugins` factories                            |
| Publishing a reusable extension                | Follow the [author guide](#plugin-author-guide) |

## Overview

Plugins receive the form instance and a typed hook API. Return a cleanup function or `{ onDestroy }` for teardown.

Register at create time (convenient, same as sequential `form.use`):

```ts
import { createForm } from "@jayoncode/form-intelligence";
import { createBrowserLifecyclePlugin } from "@jayoncode/form-intelligence/plugins";

const form = createForm({
  initialValues: { notes: "" },
  plugins: [createBrowserLifecyclePlugin({ saveDraftOnHidden: true })],
});
```

Or after construction:

```ts
import type { FormPlugin } from "@jayoncode/form-intelligence";

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

## Plugin author guide

Use this section when writing a **reusable** plugin (app-local or published). Apps that only need a one-off hook can stay with the overview examples above.

### Choose the right extension point

| Need                                                     | Prefer                                                                                      | Avoid                                      |
| -------------------------------------------------------- | ------------------------------------------------------------------------------------------- | ------------------------------------------ |
| Observe / cancel validate or submit                      | Plugin hooks (`api.on`)                                                                     | Forking `createForm`                       |
| Onion pipeline around setValue / submitError             | Middleware (`form.useMiddleware`)                                                           | Duplicating hook names for the same work   |
| Show / hide / require / disable fields                   | `when()` rules → Presentation                                                               | Writing `fieldUi` from a plugin            |
| Button UX policies (`errorDisplay`, `disableSubmitWhen`) | `ui()` from `/ui`                                                                           | Reimplementing `showError` / `canSubmit`   |
| Hard block submit start                                  | Let `submissionGuard()` / rules `disableSubmit` own it; optionally cancel in `beforeSubmit` | Inventing a second hard-guard API          |
| Inspect state in dev                                     | `/devtools`                                                                                 | Shipping DevTools in production by default |

Rules and Presentation remain the owners of UI intent (`visible`, `disabled`, `required`, `formUi.submitDisabled`). `/ui` only **projects**, **composes**, or **explains**. Plugins should **read** those APIs, not invent parallel meanings.

See also: [UI projection](/packages/form-intelligence/modules/ui-projection), [Submission — hard guards vs button UX](/packages/form-intelligence/modules/submission#hard-guards-vs-button-ux), [Rules](/packages/form-intelligence/modules/rules).

### Shape checklist

| Field              | Required | Convention                                                                                                                                    |
| ------------------ | -------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`             | Yes      | Stable kebab or camel id (`audit`, `ui`, `devtools`). Used in `listPlugins()` and error reports.                                              |
| `setup(form, api)` | Yes      | Register hooks / listeners; return cleanup or `{ onDestroy }`.                                                                                |
| `order`            | No       | Lower runs earlier among plugins with the same hook (default registration order). Prefer explicit gaps (`10`, `20`, …).                       |
| `version`          | No       | Semver of **your** plugin package (metadata for DevTools).                                                                                    |
| `engines`          | No       | Semver range against `@jayoncode/form-intelligence` (`>=3.4.0`, `^3.4.0`). Checked at register — throws `ConfigurationError` if incompatible. |

```ts
import type { FormPlugin } from "@jayoncode/form-intelligence";

export function createAuditPlugin(options?: { readonly log?: typeof console.log }): FormPlugin {
  const log = options?.log ?? console.log;
  return {
    name: "audit",
    version: "1.0.0",
    engines: ">=3.4.0",
    order: 50,
    setup(form, api) {
      const off = api.on("afterSubmit", ({ success, values }) => {
        log("afterSubmit", { success, values });
      });
      return () => {
        off();
      };
    },
  };
}
```

### What plugins may do

- Subscribe to lifecycle hooks and form events (`change`, `validated`, …).
- Call public form APIs: `validate()`, `submit()`, `setValue()`, `saveDraft()`, `listPlugins()`, `form.ui.*`, `submissionGuard()`, `getPresentation()`.
- Register policies via the documented `ui()` plugin pattern (or your own policy store that **does not** redefine Presentation keys).
- Cancel guard phases by returning `false` from `beforeValidate` / `beforeSubmit` (same stack as middleware).

### What plugins must not do

| Don't                                                              | Why                                                                                                      |
| ------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------- |
| Mutate `form.state.fieldUi` / invent `required` / `visible`        | Presentation + rules own UI intent; use `when().require()` / schema baseline instead                     |
| Treat `form.ui.canSubmit === false` as a hard engine block         | Soft UX only — see [Submission](/packages/form-intelligence/modules/submission#hard-guards-vs-button-ux) |
| Throw unchecked inside `setup` without expecting isolation         | `setup` throw → plugin not registered; report via `onPluginError`                                        |
| Rely on private core modules                                       | Public surface = main entry + documented subpaths                                                        |
| Enable DevTools by default in library consumers' production builds | Opt-in only ([Integrations → DevTools](/packages/form-intelligence/modules/integrations#devtools))       |

### Hooks vs middleware

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

Prefer **hooks** for simple observe/cancel. Prefer **middleware** when you need `next()`, setValue phases, or `submitError`.

```ts
import {
  MIDDLEWARE_HOOK_MAP,
  PLUGIN_PIPELINE_STAGES,
} from "@jayoncode/form-intelligence/middleware";

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

`form.useMiddleware` builds and runs the onion chain for you via `composeMiddleware` / `runMiddlewareChain`, exported from `/middleware` (also re-exported on `/plugins`):

| Export               | Role                                                                                |
| -------------------- | ----------------------------------------------------------------------------------- |
| `composeMiddleware`  | Compose registered middleware into one onion-ordered runner                         |
| `runMiddlewareChain` | Run the composed chain for one phase against a context                              |
| `MiddlewarePipeline` | Class that owns registration + per-phase composition (used by `form.useMiddleware`) |

Prefer `form.useMiddleware(...)` — reach for these directly only when building a custom middleware host (e.g. testing a middleware in isolation without a form).

### Error isolation

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
```

### Reference shapes in core

| Factory                                                 | Subpath     | Pattern                                                                  |
| ------------------------------------------------------- | ----------- | ------------------------------------------------------------------------ |
| `ui(options?)`                                          | `/ui`       | Registers policies; cleanup clears them. Does not own Presentation keys. |
| `createDevToolsPlugin()` / `enableFormDevTools()`       | `/devtools` | Side-channel inspector; keep out of default product bundles.             |
| `createBrowserLifecyclePlugin` / `createKeyboardPlugin` | `/plugins`  | Thin adapters over sibling JOC packages.                                 |

Study these before inventing new “platform” plugins.

### Modules vs plugins

Internally, `createForm` runs one ordered pipeline of `FormModule`s (draft restore, workflow, analytics, …). `pluginAsModule(plugin)` wraps a `FormPlugin` so it can run in that same pipeline — this is how `plugins: []` / `form.use()` are implemented, not a separate extension point you need to reach for.

```ts
import { pluginAsModule } from "@jayoncode/form-intelligence/plugins";

const module = pluginAsModule(myPlugin); // FormModule — same shape as built-in modules
```

`FormModuleHost` is the internal host `createForm` uses to start/stop modules in order. Plugin authors should use `form.use(plugin)` / `createForm({ plugins })` — reach for `pluginAsModule` / `FormModuleHost` only if you are building an alternate module pipeline (e.g. a test harness) that needs the exact internal contract.

### Testing

```ts
import { createForm, required } from "@jayoncode/form-intelligence";
import { describe, expect, it, vi } from "vitest";
import { createAuditPlugin } from "./audit-plugin.js";

describe("createAuditPlugin", () => {
  it("observes successful submit", async () => {
    const log = vi.fn();
    const onSubmit = vi.fn();
    const form = createForm({
      initialValues: { email: "a@b.com" },
      validators: { email: [required] },
      plugins: [createAuditPlugin({ log })],
      onSubmit,
    });

    await expect(form.submit()).resolves.toBe(true);
    expect(log).toHaveBeenCalled();
    form.destroy();
  });

  it("cancels when beforeSubmit returns false", async () => {
    const onSubmit = vi.fn();
    const form = createForm({
      initialValues: { email: "a@b.com" },
      onSubmit,
      plugins: [
        {
          name: "block",
          setup(_form, api) {
            api.on("beforeSubmit", () => false);
          },
        },
      ],
    });

    await expect(form.submit()).resolves.toBe(false);
    expect(onSubmit).not.toHaveBeenCalled();
    form.destroy();
  });
});
```

Assert public behavior (`submit` result, `listPlugins()`, `form.ui.canSubmit`) — not private registry internals.

### Shipping

1. Depend on `@jayoncode/form-intelligence` as a **peer** (match `engines`).
2. Export a factory (`createXPlugin`) that returns `FormPlugin` — avoid side effects on import.
3. Document which hooks you use and whether you cancel guard phases.
4. Keep optional weight behind subpath imports if the plugin is heavy (mirror `/devtools`).

Maintainer conventions: [engineering/019-plugin-author-conventions](https://github.com/itsjayoncode/joc/blob/master/packages/form-intelligence/engineering/019-plugin-author-conventions.md).

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
} from "@jayoncode/form-intelligence/plugins";
import { ui } from "@jayoncode/form-intelligence/ui";

const form = createForm({
  initialValues: { notes: "" },
  plugins: [
    ui({ errorDisplay: "touched" }),
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

**Next:** [Patterns](/packages/form-intelligence/modules/patterns) — wizard, offline submit, plugin recipes.
