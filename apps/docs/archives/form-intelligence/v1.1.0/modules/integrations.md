---
title: Integrations
description: Form Intelligence documentation for Integrations.
---

# Integrations

Browser session, keyboard shortcuts, analytics, and DevTools — attach with plugins or `workflow` config.

**Previous:** [Formatters](/packages/form-intelligence/modules/formatters) · **Next:** [Adapters](/packages/form-intelligence/modules/adapters)

::: tip Playground
[Integrations →](/playground/form-intelligent/integrations) · [Plugins →](/playground/form-intelligent/plugins) · [DevTools →](/playground/form-intelligent/devtools)
:::

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
});

form.use(
  createBrowserLifecyclePlugin({
    saveDraftOnHidden: true,
    flushOfflineQueueOnOnline: true,
  }),
);
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

```ts
createForm({
  initialValues: { email: "" },
  workflow: {
    analytics: { enabled: true },
  },
});

const snap = form.getAnalytics();
// startedAt, completedAt, errorCount, errorsByField,
// fieldViews, dropOffField, abandonedAt, currentStep
```

Use for drop-off diagnosis and field-level error heatmaps — not a replacement for product analytics SDKs.

---

## DevTools

```ts
import {
  connectFormDevToolsToGlobal,
  enableFormDevTools,
  getFormDevTools,
} from "@jayoncode/form-intelligence/devtools";

enableFormDevTools(form);
connectFormDevToolsToGlobal();

getFormDevTools().getActiveForms();
getFormDevTools().getStateSnapshot(form.id);
```

Playground DevTools mirrors this inspector: event log, validation log, workflow timeline, export/import state.

A dedicated browser extension is planned (Phase 5.4.8).

---

## Subpath imports

| Subpath                                  | Use for                                                                                                                                                             |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@jayoncode/form-intelligence/plugins`   | Lifecycle + keyboard plugins                                                                                                                                        |
| `@jayoncode/form-intelligence/devtools`  | Inspector API                                                                                                                                                       |
| `@jayoncode/form-intelligence/analytics` | Analytics helpers                                                                                                                                                   |
| `@jayoncode/form-intelligence/offline`   | Offline queue primitives                                                                                                                                            |
| `@jayoncode/form-intelligence/history`   | Undo/redo primitives                                                                                                                                                |
| `@jayoncode/form-intelligence/rules`     | `when` + rule helpers — use when you want an explicit rules entry (see [Rules → Which import](/packages/form-intelligence/modules/rules#which-import-should-i-use)) |

**Next:** [Adapters](/packages/form-intelligence/modules/adapters) — React, Vue, Zod, and core interfaces.
