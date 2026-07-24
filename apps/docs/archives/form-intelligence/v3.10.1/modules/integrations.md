---
title: Integrations
description: Form Intelligence documentation for Integrations.
---

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
import { createBrowserLifecycle } from "@jayoncode/browser-lifecycle";

const shared = createBrowserLifecycle({ idleTimeout: 60_000 });

const form = createForm({
  initialValues: { notes: "" },
  workflow: {
    draft: { enabled: true, storageKey: "editor-draft" },
  },
  plugins: [
    createBrowserLifecyclePlugin({
      // Both default ON when omitted (`!== false`)
      saveDraftOnHidden: true,
      flushOfflineQueueOnOnline: true,
      lifecycle: shared, // optional — inject a shared session (adapter does not dispose it)
    }),
  ],
});
// Or after create: form.use(createBrowserLifecyclePlugin({ ... }));
```

| Option                      | Default | Effect                                                                                |
| --------------------------- | ------- | ------------------------------------------------------------------------------------- |
| `saveDraftOnHidden`         | **on**  | `page:hidden` → `form.saveDraft()`                                                    |
| `flushOfflineQueueOnOnline` | **on**  | `connection:online` → `form.flushOfflineQueue()`                                      |
| `lifecycle`                 | —       | Use an existing `BrowserLifecycle`; otherwise the plugin creates and disposes its own |

When the tab is hidden, the plugin calls `form.saveDraft()`. When connectivity returns, it can flush `workflow.offlineQueue`.

**Full recipe:** [Patterns → Draft on tab hide](/packages/form-intelligence/modules/patterns#composition-draft-on-tab-hide-browser-lifecycle).

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
      onSnapshot: (snapshot) => {
        // Fired whenever getAnalytics() produces a snapshot
        sendToYourPipeline(snapshot);
      },
    },
  },
});

const snap = form.getAnalytics();
// startedAt, completedAt, errorCount, errorsByField,
// fieldViews, dropOffField, abandonedAt, currentStep,
// timeToCompleteMs, timeToFirstErrorMs
```

Use for drop-off diagnosis and field-level error heatmaps. Export to Segment/GA yourself if needed — scrub paths before network.

### Analytics module API

`workflow.analytics` registers a `FormAnalyticsTracker` module for you and exposes it through `form.getAnalytics()`. `@jayoncode/form-intelligence/analytics` exports the underlying pieces for a standalone tracker (no `createForm` module) or a custom plugin:

| Export                           | Role                                                                      |
| -------------------------------- | ------------------------------------------------------------------------- |
| `FormAnalyticsTracker`           | Stateful tracker — `recordFieldView`, `recordFieldError`, `getSnapshot()` |
| `createAnalyticsPlugin(tracker)` | Wraps a tracker as a `FormPlugin` you can pass to `plugins: []`           |

```ts
import {
  FormAnalyticsTracker,
  createAnalyticsPlugin,
} from "@jayoncode/form-intelligence/analytics";

const tracker = new FormAnalyticsTracker();

createForm({
  plugins: [createAnalyticsPlugin(tracker)],
});
```

Prefer `workflow.analytics` + `form.getAnalytics()` — reach for the tracker/plugin directly only when you need a tracker instance that outlives the form or want to compose analytics into your own module.

---

## Object diff plugin

Optional peer `@jayoncode/object-diff`. Audits changes vs defaults on successful submit:

```ts
import { createObjectDiffPlugin } from "@jayoncode/form-intelligence/plugins";

form.use(
  createObjectDiffPlugin({
    auditOnSubmit: true, // default true when onSubmitDiff is set
    diffOptions: { maxDepth: 8, treatUndefinedAsMissing: true },
    onSubmitDiff: async (diff, values) => {
      await api.audit({
        changeCount: diff.metadata.changeCount,
        paths: diff.changes.map((c) => c.path),
      });
    },
  }),
);
```

| Option          | Notes                                                                                      |
| --------------- | ------------------------------------------------------------------------------------------ |
| `auditOnSubmit` | Default **on** when `onSubmitDiff` is provided (`!== false`)                               |
| `onSubmitDiff`  | `(diff, values) => void \| Promise<void>` after successful submit                          |
| `diffOptions`   | Pass-through `FormDiffOptions` (`maxDepth`, `includeUnchanged`, `treatUndefinedAsMissing`) |

Instance helpers `form.diffFromDefaults()` / `form.diffFrom()` / `submit({ includeDiff: true })` remain available without the plugin — see [State](/packages/form-intelligence/modules/state#object-diffs).

**Full recipe:** [Patterns → Dirty audit / patch](/packages/form-intelligence/modules/patterns#composition-dirty-audit--patch-object-diff).

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
inspector.getUiProjection(form.id); // hard guard + UX explain + field status
inspector.getPlugins(form.id);
inspector.getPerformanceMarks(form.id);
```

Playground DevTools (`/playground/form-intelligence/devtools`) consumes this inspector: **UI projection / explain panels**, event log, validation log, workflow timeline, plugins, performance marks, export/import state.

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
  maxEvents: 200,
  maxValidationEntries: 100,
  maxWorkflowEntries: 100,
  maxPerformanceMarks: 100,
});

const safe = redactFormStateSnapshot(form.getFormState());
```

| Ring option            | Role                  |
| ---------------------- | --------------------- |
| `maxEvents`            | Cap general event log |
| `maxValidationEntries` | Cap validation log    |
| `maxWorkflowEntries`   | Cap workflow timeline |
| `maxPerformanceMarks`  | Cap performance marks |

A dedicated browser extension is planned (Phase 5.4.8).

---

## Subpath imports

For the complete main-vs-subpath map (including `/format`, `/middleware`, `/presentation`, …), see [Entrypoints & subpaths](/packages/form-intelligence/modules/entrypoints). Rules dual-export notes: [Rules → Which import](/packages/form-intelligence/modules/rules#which-import-should-i-use).

**Next:** [Adapters](/packages/form-intelligence/modules/adapters) — React, Vue, Zod, and core interfaces.
