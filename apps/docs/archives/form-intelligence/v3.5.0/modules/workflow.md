---
title: Workflow
description: Form Intelligence documentation for Workflow.
---

# Workflow

Autosave, drafts, wizards, progress, and related workflow config.

**Previous:** [State](/packages/form-intelligence/modules/state) · **Next:** [Rules](/packages/form-intelligence/modules/rules)

::: tip Playground
[Workflow explorer →](/playground/form-intelligence/workflow) — autosave debounce, draft restore, wizard steps.
:::

## Import path

Configure via `createForm({ workflow })` on the **main** entry. Subpaths `/workflow`, `/draft`, `/wizard` are low-level internals — prefer config + instance methods. [Entrypoints](/packages/form-intelligence/modules/entrypoints).

```ts
import { createForm } from "@jayoncode/form-intelligence";
```

## Problem → solution

| Problem                                   | Solution            |
| ----------------------------------------- | ------------------- |
| Debounced draft save duplicated per form  | `workflow.autosave` |
| Lose progress on reload                   | `workflow.draft`    |
| Multi-step forms with per-step validation | `workflow.wizard`   |

## Overview

| Feature        | Use case                                                                                      |
| -------------- | --------------------------------------------------------------------------------------------- |
| `autosave`     | Debounced persistence on value change                                                         |
| `draft`        | Restore values after navigation or reload                                                     |
| `wizard`       | Step index with per-step validation                                                           |
| `offlineQueue` | Queue submits while offline ([Submission](/packages/form-intelligence/modules/submission))    |
| `keyboard`     | Shortcut actions ([Integrations](/packages/form-intelligence/modules/integrations))           |
| `analytics`    | Drop-off / error snapshots ([Integrations](/packages/form-intelligence/modules/integrations)) |

Conditional show/hide lives in [Rules](/packages/form-intelligence/modules/rules) (`when()`), not in workflow config.

---

## Autosave

```ts
createForm({
  initialValues: { notes: "" },
  workflow: {
    autosave: {
      enabled: true,
      debounceMs: 500,
      onSave: async (values) => {
        await api.saveDraft(values);
      },
    },
  },
});
```

Pending autosave is **canceled** on `submit()` and `destroy()` so saves do not race with submit or teardown.

Status: `form.state.workflow.isAutosaving`, `form.state.workflow.lastAutosaveAt`.

Plugin hook: `api.on("onAutosave", …)` — see [Plugins](/packages/form-intelligence/modules/plugins).

---

## Draft restore

Persists to storage and merges on next visit:

```ts
workflow: {
  draft: {
    enabled: true,
    storageKey: "signup-draft-v1",
    onRestore: (values) => console.log("Welcome back!", values),
    // promptOnRestore: true,
    // onRestorePrompt: (values) => window.confirm("Restore draft?"),
    // versioning: true,
    // schemaVersion: "2",
    // migrateDraft: (envelope) => ({ ...envelope, schemaVersion: "2" }),
  },
},
```

Manual:

```ts
form.saveDraft();
await form.restoreDraft(); // after mount
await form.restoreDraft({ force: true }); // overwrite dirty values
await form.restoreDraft({ prompt: true }); // honor onRestorePrompt
await form.restoreDraft({ merge: "replace" });
```

Successful `submit()` clears the stored draft. Quota failures throw `DraftStorageError` (`code: "draft_error"`).

**Multi-tab:** last-write-wins today; conflict strategies are deferred (not Phase 11).

::: info Try it
Fill fields in the [Workflow playground](/playground/form-intelligence/workflow), reload — the draft comes back.
:::

---

## Multi-step wizard

Each step may include an `id`, fields to validate on `next()`, and optional branching:

```ts
workflow: {
  wizard: {
    initialStep: 0,
    goToValidation: "step", // default "all" — validate entire form on goTo
    persistStepInDraft: true, // restore currentStep with drafts
    steps: [
      { id: "profile", fields: ["name", "email"] },
      {
        id: "business",
        fields: ["company"],
        when: (values) => values.kind === "business",
      },
      { id: "review", fields: ["bio"] },
    ],
  },
},
```

Navigate:

```ts
await form.workflow.next();
form.workflow.prev();
await form.workflow.goTo("review");
await form.workflow.goTo(2, { validate: "none" });
form.workflow.visibleSteps();
form.workflow.getStepGraph();
```

Progress (`state.workflow.progress` / `totalSteps` / `canGoNext`) counts **visible** steps only.

Progress UI:

```ts
const w = form.state.workflow;
w.currentStep; // 0-based
w.totalSteps;
w.canGoNext;
w.canGoPrev;
w.progress; // 0–100
```

---

## Element structure (wizard)

Render one step panel at a time from `workflow.currentStep`.

### React JSX

```tsx
const step = form.state.workflow.currentStep;

return (
  <form {...form.form()}>
    <div className="progress" style={{ width: `${form.state.workflow.progress}%` }} />

    {step === 0 ? (
      <section>
        <input {...form.field("name")} placeholder="Name" />
        <input {...form.field("email")} placeholder="Email" />
      </section>
    ) : (
      <section>
        <textarea {...form.field("bio")} placeholder="Bio" />
      </section>
    )}

    <button
      type="button"
      disabled={!form.state.workflow.canGoPrev}
      onClick={() => form.workflow.prev()}
    >
      Back
    </button>
    <button
      type="button"
      disabled={!form.state.workflow.canGoNext}
      onClick={() => void form.workflow.next()}
    >
      Next
    </button>
    {step === form.state.workflow.totalSteps - 1 ? (
      <button {...form.submit()}>Finish</button>
    ) : null}
  </form>
);
```

### Native HTML

```html
<form id="wizard">
  <div data-step="0">
    <input name="name" />
    <input name="email" />
  </div>
  <div data-step="1" hidden>
    <textarea name="bio"></textarea>
  </div>
  <button type="button" data-action="prev">Back</button>
  <button type="button" data-action="next">Next</button>
  <button type="submit">Finish</button>
</form>
```

Toggle `[data-step]` visibility from `form.state.workflow.currentStep` in your `subscribe()` render loop (or framework adapter).

---

## Cheat sheet

```ts
form.saveDraft();
form.state.workflow.isAutosaving;
await form.workflow.next();
form.workflow.prev();
form.state.workflow.progress;
```

**Next:** [Rules](/packages/form-intelligence/modules/rules) — `when()` show/hide/require/populate.
