# Integrations

Browser session, keyboard shortcuts, analytics, and DevTools — attach with plugins or `workflow` config.

**Previous:** [Formatters](/packages/form-intelligence/modules/formatters) · **Next:** [Adapters](/packages/form-intelligence/modules/adapters)

::: tip Playground
[Integrations →](/playground/form-intelligence/integrations) · [Plugins →](/playground/form-intelligence/plugins) · [DevTools →](/playground/form-intelligence/devtools)
:::

## Import path

| Feature                               | Import                                                                  |
| ------------------------------------- | ----------------------------------------------------------------------- |
| Lifecycle + keyboard plugins          | `@jayoncode/form-intelligence/plugins`                                  |
| DevTools inspector                    | `@jayoncode/form-intelligence/devtools` only                            |
| Analytics / offline / history helpers | Prefer `workflow` config; optional `/analytics`, `/offline`, `/history` |

Canonical table: [Entrypoints & subpaths](/packages/form-intelligence/modules/entrypoints).

## Browser lifecycle (draft on hide)

Optional peer: `@jayoncode/browser-lifecycle`.

```ts
import { createForm } from "@jayoncode/form-intelligence";
import { createBrowserLifecyclePlugin } from "@jayoncode/form-intelligence/plugins";

const form = createForm({
  initialValues: { notes: "" },
  workflow: {
    draft: { enabled: true, storageKey: "editor-draft" },
  },
  plugins: [
    createBrowserLifecyclePlugin({
      saveDraftOnHidden: true,
      flushOfflineQueueOnOnline: true,
    }),
  ],
});
// Or after create: form.use(createBrowserLifecyclePlugin({ ... }));
```

When the tab is hidden, the plugin calls `form.saveDraft()`. When connectivity returns, it can flush `workflow.offlineQueue`.

---

## Keyboard shortcuts

### Via workflow config

```ts
createForm({
  initialValues: { body: "" },
  workflow: {
    draft: { enabled: true, storageKey: "doc" },
    keyboard: [
      { combo: "Ctrl+S", action: "saveDraft" },
      { combo: "Ctrl+Z", action: "undo" },
      { combo: "Ctrl+Shift+Z", action: "redo" },
      { combo: "Ctrl+Enter", action: "submit" },
    ],
  },
});
```

### Via plugin

```ts
import { createKeyboardPlugin, keyboard } from "@jayoncode/form-intelligence/plugins";

form.use(
  createKeyboardPlugin([
    keyboard.shortcut("mod+s", (f) => f.saveDraft()),
    keyboard.shortcut("mod+enter", (f) => {
      void f.submit();
    }),
  ]),
);
```

---

## Analytics

Form UX metrics only — **not** a product analytics SDK (no pageviews, funnels-as-a-service, or vendor lock-in). Snapshots never include field **values**.

```ts
createForm({
  initialValues: { email: "", ssn: "" },
  workflow: {
    analytics: {
      enabled: true,
      excludePaths: ["ssn"], // path denylist
      // includePaths: ["email"], // deny-by-default allowlist
    },
  },
});

const snap = form.getAnalytics();
// startedAt, completedAt, errorCount, errorsByField,
// fieldViews, dropOffField, abandonedAt, currentStep,
// timeToCompleteMs, timeToFirstErrorMs
```

Use for drop-off diagnosis and field-level error heatmaps. Export to Segment/GA yourself if needed — scrub paths before network.

---

## DevTools

```ts
import {
  connectFormDevToolsToGlobal,
  enableFormDevTools,
  getFormDevTools,
  redactFormStateSnapshot,
} from "@jayoncode/form-intelligence/devtools";

enableFormDevTools(form);
connectFormDevToolsToGlobal();

const inspector = getFormDevTools();
inspector.getActiveForms();
inspector.getStateSnapshot(form.id);
inspector.getPlugins(form.id);
inspector.getPerformanceMarks(form.id);
```

Playground DevTools (`/playground/form-intelligence/devtools`) consumes this inspector: event log, validation log, workflow timeline, plugins, performance marks, export/import state.

### Production redaction

- **Never** enable DevTools by default in production builds — opt in explicitly (local, staging, or a feature flag).
- Import only `@jayoncode/form-intelligence/devtools` (optional subpath). Core `createForm` does not pull it into the login bundle.
- Prefer metadata-only recording (`captureStateOnWorkflowEvents` defaults to `false`).
- When capturing state, `redactValues` defaults to `true` (values become `***`).
- For exports/logs use `redactFormStateSnapshot` / `redactValuesRecord` before sending anywhere.

```ts
enableFormDevTools(form, {
  captureStateOnWorkflowEvents: true, // opt-in
  redactValues: true, // default
});

const safe = redactFormStateSnapshot(form.getFormState());
```

A dedicated browser extension is planned (Phase 5.4.8).

---

## Subpath imports

For the complete main-vs-subpath map (including `/format`, `/middleware`, `/presentation`, …), see [Entrypoints & subpaths](/packages/form-intelligence/modules/entrypoints). Rules dual-export notes: [Rules → Which import](/packages/form-intelligence/modules/rules#which-import-should-i-use).

**Next:** [Adapters](/packages/form-intelligence/modules/adapters) — React, Vue, Zod, and core interfaces.
