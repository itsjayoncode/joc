# Patterns

Common Form Intelligence recipes — wizard, autosave, offline submit, plugins.

**Previous:** [Plugins](/packages/form-intelligence/modules/plugins) · **Next:** [Migration](/packages/form-intelligence/modules/migration)

::: tip Playground
Try [Workflow](/playground/form-intelligence/workflow), [Submission](/playground/form-intelligence/submission), [HTML constraints](/playground/form-intelligence/html-constraints), [Plugins](/playground/form-intelligence/plugins), and [CAPTCHA](/playground/form-intelligence/captcha) (loading / pending gates).
:::

## Import path

Recipes below use `@jayoncode/form-intelligence` unless noted. Formatters → `/format`; lifecycle plugins → `/plugins`; schema packages → `@jayoncode/form-intelligence-zod` (etc.). [Entrypoints](/packages/form-intelligence/modules/entrypoints).

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

## Composition: draft on tab hide (Browser Lifecycle)

**Composition without coupling** — install both packages; wire via the Form Intelligence plugin (optional peer). No shared runtime.

```ts
import { createForm } from "@jayoncode/form-intelligence";
import { createBrowserLifecyclePlugin } from "@jayoncode/form-intelligence/plugins";
import { createBrowserLifecycle } from "@jayoncode/browser-lifecycle";

const lifecycle = createBrowserLifecycle({ autoStart: true, idleTimeout: 60_000 });

const form = createForm({
  initialValues: { notes: "" },
  workflow: {
    draft: { enabled: true, storageKey: "editor-draft" },
    // optional: also flush queued submits when back online
    offlineQueue: { enabled: true, storageKey: "editor-offline" },
  },
  plugins: [
    createBrowserLifecyclePlugin({
      saveDraftOnHidden: true, // page:hidden → form.saveDraft()
      flushOfflineQueueOnOnline: true,
      lifecycle, // shared session; plugin does not dispose it
    }),
  ],
  onSubmit: async (values) => api.publish(values),
});

// App owns the session:
lifecycle.dispose();
form.destroy();
```

| Signal | Effect |
| ------ | ------ |
| `page:hidden` | Persist draft so a refresh / resume does not lose work |
| `connection:online` | Flush offline submit queue when configured |

Manual alternative (no plugin): `lifecycle.on("page:hidden", () => form.saveDraft())`.

API tables: [Integrations → Browser lifecycle](/packages/form-intelligence/modules/integrations#browser-lifecycle-draft-on-hide) · Browser events: [Visibility](/packages/browser-lifecycle/modules/visibility).

---

## Composition: dirty audit / patch (Object Diff)

**Composition without coupling** — optional peer `@jayoncode/object-diff` for submit-time audit or instance diffs.

```ts
import { createForm } from "@jayoncode/form-intelligence";
import { createObjectDiffPlugin } from "@jayoncode/form-intelligence/plugins";
import { diff, hasChanges, patch, applyPatch } from "@jayoncode/object-diff";

const form = createForm({
  initialValues: { title: "", body: "" },
  plugins: [
    createObjectDiffPlugin({
      onSubmitDiff: async (diffResult, values) => {
        // e.g. send audit trail / only PATCH changed fields
        if (diffResult.hasChanges) {
          await api.audit(diffResult);
        }
      },
      diffOptions: { maxDepth: 8, treatUndefinedAsMissing: true },
    }),
  ],
  onSubmit: async (values) => api.save(values),
});

// Ad-hoc compare (no plugin required):
await form.diffFromDefaults({ maxDepth: 8 });
await form.diffFrom(savedSnapshot);
await form.submit({ includeDiff: true });

// Pure Object Diff (no Form Intelligence):
if (hasChanges(saved, draft)) {
  const ops = patch(diff(saved, draft));
  const next = applyPatch(saved, ops);
}
```

| Goal | Prefer |
| ---- | ------ |
| Audit on successful submit | `createObjectDiffPlugin` |
| Compare live values to defaults / snapshot | `form.diffFromDefaults()` / `form.diffFrom()` |
| Generate / apply JSON Patch outside forms | `diff` / `patch` / `applyPatch` from `@jayoncode/object-diff` |

Details: [Integrations → Object Diff](/packages/form-intelligence/modules/integrations#object-diff-plugin) · [State → Object diffs](/packages/form-intelligence/modules/state#object-diffs) · [Object Diff integrations](/packages/object-diff/modules/integrations).

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
createForm({
  initialValues: { email: "" },
  plugins: [
    {
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
    },
  ],
});
// Or later: form.use({ name: "audit", setup(...) { ... } });
```

Hooks: `beforeValidate`, `afterValidate`, `beforeSubmit`, `afterSubmit`, `onAutosave`, `onDraftRestore`. Full authoring rules (ownership, `engines`, testing): [Plugins — author guide](/packages/form-intelligence/modules/plugins#plugin-author-guide).

---

## Schema adapters (Zod)

```ts
import { zodAdapter } from "@jayoncode/form-intelligence-zod";
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
  // schema optional — HTML required / type="email" / minlength also import as validators
  schema: { email: "email", password: "password" },
  onSubmit: async (values) => api.register(values),
});
```

```html
<form id="register">
  <input name="email" required type="email" />
  <input name="password" required minlength="8" type="password" />
  <button type="submit">Register</button>
</form>
```

Phase 1 attributes become FI validators on attach (Field > Schema > HTML). Errors announce with `role="alert"` and `aria-invalid` automatically (`novalidate`). Lab: [HTML constraints](/playground/form-intelligence/html-constraints).

**Done?** Browse the [API Reference](/packages/form-intelligence/api/) or [open the playground](/playground/form-intelligence/).
