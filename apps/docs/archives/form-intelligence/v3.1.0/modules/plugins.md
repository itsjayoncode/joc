---
title: Plugins
description: Form Intelligent documentation for Plugins.
---

# Plugins

Add cross-cutting behavior — analytics, guards, or integrations — without forking core.

**Previous:** [Adapters](/packages/form-intelligence/modules/adapters) · **Next:** [Patterns](/packages/form-intelligence/modules/patterns)

::: tip Playground
[Plugins explorer →](/playground/form-intelligence/plugins) — register hooks and inspect the event log.
:::

## Overview

Plugins receive the form instance and a typed hook API. Return a cleanup function or `{ onDestroy }` for teardown.

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
} from "@jayoncode/form-intelligent/plugins";

form.use(createBrowserLifecyclePlugin({ saveDraftOnHidden: true }));
form.use(createDevToolsPlugin());
form.use(createKeyboardPlugin([keyboard.shortcut("mod+s", (f) => f.saveDraft())]));
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
