---
title: Patterns
description: Form Intelligent documentation for Patterns.
---

# Patterns

Common Form Intelligent recipes — wizard, autosave, offline submit, plugins.

**Previous:** [Plugins](/packages/form-intelligent/modules/plugins) · **Next:** [Migration](/packages/form-intelligent/modules/migration)

::: tip Playground
Try [Workflow](/playground/form-intelligent/workflow), [Submission](/playground/form-intelligent/submission), and [Plugins](/playground/form-intelligent/plugins).
:::

---

## Multi-step wizard

```ts
const form = createForm({
  initialValues: { email: "", plan: "", card: "" },
  validators: {
    email: [required, email],
    plan: [required],
    card: [required],
  },
  workflow: {
    wizard: {
      initialStep: 0,
      steps: [
        { id: "account", fields: ["email"] },
        { id: "plan", fields: ["plan"] },
        { id: "payment", fields: ["card"] },
      ],
    },
  },
  onSubmit: async (values) => api.checkout(values),
});

await form.workflow.next(); // validates current step fields
form.workflow.prev();
await form.workflow.goTo(2);

form.state.workflow.currentStep;
form.state.workflow.progress; // 0–100
```

---

## Autosave + draft restore

```ts
createForm({
  initialValues: { body: "" },
  workflow: {
    autosave: {
      enabled: true,
      debounceMs: 400,
      onSave: (values) => api.patchDraft(values),
    },
    draft: {
      enabled: true,
      storageKey: "editor:draft",
    },
  },
});
```

Status: `form.state.workflow.isAutosaving`, `form.state.workflow.lastAutosaveAt`.

Manual save: `form.saveDraft()`.

---

## Offline submit queue

```ts
createForm({
  initialValues: { email: "" },
  workflow: {
    offlineQueue: {
      enabled: true,
      storageKey: "signup:offline",
    },
  },
  onSubmit: async (values) => api.register(values),
});

// When back online:
await form.flushOfflineQueue();
```

Pair with `createBrowserLifecyclePlugin({ flushOfflineQueueOnOnline: true })`.

---

## Plugin hooks

```ts
form.use({
  name: "audit",
  setup(_form, api) {
    api.on("beforeSubmit", () => {
      if (!window.confirm("Submit?")) return false;
    });
    api.on("afterValidate", ({ valid }) => {
      console.log("valid?", valid);
    });
    return {
      onDestroy() {
        console.log("cleanup");
      },
    };
  },
});
```

Hooks: `beforeValidate`, `afterValidate`, `beforeSubmit`, `afterSubmit`, `onAutosave`, `onDraftRestore`.

---

## Schema adapters (Zod)

```ts
import { zodAdapter } from "@jayoncode/form-intelligent-zod";
import { z } from "zod";

createForm({
  initialValues: { email: "" },
  schema: zodAdapter(z.object({ email: z.string().email() })),
  onSubmit,
});
```

Core stays free of Zod — adapters implement `SchemaAdapter`.

---

## Headless HTML progressive enhancement

```ts
createForm({
  target: "#register",
  schema: { email: "email", password: "password" },
  onSubmit: async (values) => api.register(values),
});
```

Errors announce with `role="alert"` and `aria-invalid` automatically.

**Done?** Browse the [API Reference](/packages/form-intelligent/api/) or [open the playground](/playground/form-intelligent/).
