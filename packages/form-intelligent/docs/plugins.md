# Plugins

Add cross-cutting behavior — analytics, logging, or integrations — without changing core form code.

**Previous:** [Formatters](/packages/form-intelligent/modules/formatters) · **Next:** [Adapters](/packages/form-intelligent/modules/adapters)

::: tip Playground
[Plugins explorer →](/playground/form-intelligent/plugins) — register hooks and inspect the event log.
:::

## Overview

Plugins subscribe to form lifecycle events (`change`, `submit`, `autosave`, etc.) and may return cleanup on unregister.

---

## Quick example

```ts
const analytics: FormPlugin = {
  name: "analytics",
  setup(form) {
    return form.on("submit", () => {
      track("form_submit");
    });
  },
};

form.registerPlugin(analytics);
```

---

## Available events

| Event            | Fires when           |
| ---------------- | -------------------- |
| `change`         | A value updates      |
| `blur` / `focus` | Field binding events |
| `validate`       | Validation runs      |
| `submit`         | Submit starts        |
| `autosave`       | Autosave triggers    |
| `draft`          | Draft persisted      |
| `reset`          | Form resets          |

```ts
form.on("change", () => console.log("values changed"));
```

---

## Cleanup

`setup` may return a function — called when the plugin is replaced or the form is destroyed:

```ts
setup(form) {
  const unsub = form.on("submit", handler);
  return unsub;
}
```

**Next:** [Adapters](/packages/form-intelligent/modules/adapters) — connect React, Vue, or Zod.
