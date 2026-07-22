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

| Option       | Type                                | Notes                          |
| ------------ | ----------------------------------- | ------------------------------ |
| `enabled`    | `boolean`                           | Opt-in persistence on change   |
| `debounceMs` | `number`                            | Delay after last value change  |
| `onSave`     | `(values) => void \| Promise<void>` | Required when autosave is used |

Pending autosave is **canceled** on `submit()` and `destroy()` so saves do not race with submit or teardown.

Status: `form.state.workflow.isAutosaving`, `form.state.workflow.lastAutosaveAt`.

Plugin hook: `api.on("onAutosave", …)` — see [Plugins](/packages/form-intelligence/modules/plugins).

### Legacy `autoSave` alias

Top-level `createForm({ autoSave })` still works. Prefer `workflow.autosave`. If you pass `every: "5s"`, it is converted to `debounceMs`.

```ts
// Prefer
workflow: { autosave: { enabled: true, debounceMs: 5000, onSave } }

// Legacy alias (still supported)
autoSave: { enabled: true, every: "5s", onSave }
```

---

## Draft restore

Persists to storage and merges on next visit:

```ts
workflow: {
  draft: {
    enabled: true,
    storageKey: "signup-draft-v1",
    storage: "localStorage", // default — or "sessionStorage"
    onRestore: (values) => console.log("Welcome back!", values),
    // promptOnRestore: true,
    // onRestorePrompt: (values) => window.confirm("Restore draft?"),
    // onRestoreDecline: "remember", // keep | clear | remember (default keep)
    // versioning: true,
    // schemaVersion: "2",
    // migrateDraft: (envelope) => ({ ...envelope, schemaVersion: "2" }),
    // adapter: customSyncAdapter, // overrides storage kind
  },
},
```

### Draft options

| Option             | Type                                   | Default          | Notes                                                                          |
| ------------------ | -------------------------------------- | ---------------- | ------------------------------------------------------------------------------ |
| `enabled`          | `boolean`                              | —                | Opt-in                                                                         |
| `storageKey`       | `string`                               | —                | Key used by the storage adapter                                                |
| `storage`          | `"localStorage"` \| `"sessionStorage"` | `"localStorage"` | Built-in sync web storage                                                      |
| `adapter`          | `DraftStorageAdapter`                  | —                | Custom sync `{ load, save, clear }` — wins over `storage`                      |
| `onRestore`        | `(values) => void`                     | —                | Fired after a successful restore                                               |
| `promptOnRestore`  | `boolean`                              | `false`          | When true with `restoreDraft({ prompt: true })`, call `onRestorePrompt`        |
| `onRestorePrompt`  | `(values) => boolean \| "defer"`       | —                | `true` restore · `false` decline · `"defer"` skip without decline side effects |
| `onRestoreDecline` | `"keep"` \| `"clear"` \| `"remember"`  | `"keep"`         | Policy when prompt returns `false` (see below)                                 |
| `versioning`       | `boolean`                              | `false`          | Persist versioned `DraftEnvelopeV1` instead of raw values                      |
| `schemaVersion`    | `string`                               | —                | Compared / migrated when envelopes are enabled                                 |
| `migrateDraft`     | `(envelope) => envelope`               | —                | Migrate before restore; throw to reject                                        |

### Declining restore

When `onRestorePrompt` returns `false`, `onRestoreDecline` controls what happens to the stored draft:

| Policy     | Behavior                                                                                                      |
| ---------- | ------------------------------------------------------------------------------------------------------------- |
| `keep`     | Leave the draft. The next `restoreDraft({ prompt: true })` / init prompt can ask again (default, back-compat) |
| `clear`    | Delete the draft (and any remember marker) so it will not prompt again                                        |
| `remember` | Keep the draft; suppress prompts for the **same content** until a later `saveDraft` changes values/step       |

`remember` fingerprints values + wizard step and ignores volatile envelope fields such as `savedAt`. Return `"defer"` from `onRestorePrompt` when you need to skip restore **without** applying the decline policy — for example, declining during `createForm` so you can call `restoreDraft({ prompt: true })` after mount:

```ts
let canPrompt = false;

createForm({
  workflow: {
    draft: {
      enabled: true,
      storageKey: "signup-draft-v1",
      promptOnRestore: true,
      onRestoreDecline: "remember",
      onRestorePrompt: (values) => {
        if (!canPrompt) return "defer";
        return window.confirm("Restore your saved draft?");
      },
    },
  },
});

// after mount
canPrompt = true;
await form.restoreDraft({ prompt: true });
```

::: tip Gotcha
If you decline with `remember` and then autosave **different** values into the same draft key, content changed — prompts re-arm. Keep the declined draft intact until the user edits, or use `clear` if cancel should discard the draft.
:::

```ts
import type { DraftStorageAdapter } from "@jayoncode/form-intelligence";

const memory: DraftStorageAdapter = {
  load: (key) => map.get(key) ?? null,
  save: (key, value) => {
    map.set(key, value);
  },
  clear: (key) => {
    map.delete(key);
  },
};
```

### IndexedDB drafts

For larger drafts (attachments, big nested forms), pass an async adapter instead of `storage`:

```ts
import { createIndexedDbDraftStorage } from "@jayoncode/form-intelligence/draft";

workflow: {
  draft: {
    enabled: true,
    storageKey: "signup-draft-v1",
    adapter: createIndexedDbDraftStorage({
      dbName: "my-app-drafts", // optional
      storeName: "drafts", // optional
    }),
  },
},
```

The adapter is `async` (`get`/`set`/`remove` return promises) — `saveDraft()` / `restoreDraft()` already await it. IndexedDB is unavailable during SSR; the adapter throws in that environment, so guard `enabled` (or the whole `draft` block) behind a client-only check.

`/draft` also exports lower-level building blocks used by the sync and async storage adapters — advanced, prefer `workflow.draft` config:

| Export               | Role                                                                      |
| -------------------- | ------------------------------------------------------------------------- |
| `createDraftStorage` | Build a sync `DraftStorageAdapter` over `localStorage` / `sessionStorage` |
| `wrapDraftEnvelope`  | Wrap raw values in the versioned `DraftEnvelopeV1` shape                  |
| `mergeDraftValues`   | Merge restored draft values into current values (`replace` / merge)       |
| `applyDraftRestore`  | Apply a parsed draft payload to a form-like target                        |

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
        canLeave: async ({ values, signal }) => {
          // abortable async gate before leaving this step
          return values.company !== "" && !signal.aborted;
        },
      },
      {
        id: "review",
        fields: ["bio"],
        canEnter: ({ fromStepId }) => fromStepId !== undefined,
      },
    ],
  },
},
```

### Wizard config

| Option               | Type                            | Default | Notes                                                |
| -------------------- | ------------------------------- | ------- | ---------------------------------------------------- |
| `steps`              | `WizardStep[]`                  | —       | Required                                             |
| `initialStep`        | `number`                        | `0`     | 0-based index                                        |
| `goToValidation`     | `"step"` \| `"all"` \| `"none"` | `"all"` | Default validation scope for `goTo`                  |
| `persistStepInDraft` | `boolean`                       | —       | When true, draft save/restore includes `currentStep` |

### Wizard step

| Option     | Type                                                       | Notes                                                     |
| ---------- | ---------------------------------------------------------- | --------------------------------------------------------- |
| `id`       | `string`                                                   | Stable id for `goTo("id")` / branching                    |
| `fields`   | `FieldPath[]`                                              | Validated on `next()` when step validation runs           |
| `validate` | `boolean`                                                  | Per-step override for whether fields validate on navigate |
| `when`     | `(values) => boolean`                                      | Skip step when `false` (conditional steps)                |
| `next`     | `string` \| `(values) => string \| undefined`              | Explicit next step id / resolver                          |
| `canLeave` | `(ctx: WizardGuardContext) => boolean \| Promise<boolean>` | Gate leaving this step; `false` blocks navigation         |
| `canEnter` | `(ctx: WizardGuardContext) => boolean \| Promise<boolean>` | Gate entering this step; `false` blocks navigation        |

### Wizard guards

`canLeave` / `canEnter` receive:

```ts
{
  values,        // current form values
  fromStepId,    // leaving step id (may be undefined)
  toStepId,      // entering step id
  signal,        // AbortSignal — abort if navigate is canceled
}
```

Guards may be async. Return `false` (or a rejected/aborted path) to block the move — step index stays put and validation errors (if any) remain.

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

### Wizard graph helpers (`/wizard`)

`form.workflow.*` wraps a small set of pure graph helpers over your `steps` config. Prefer the instance methods above; the standalone functions are for tests/tooling that need the graph without a live form:

| Export                   | Role                                              |
| ------------------------ | ------------------------------------------------- |
| `listVisibleStepIds`     | Step ids after filtering out `when: false` steps  |
| `listVisibleStepIndexes` | Same, as indexes into `steps`                     |
| `resolveNextStepIndex`   | Next visible index (honors per-step `next`)       |
| `resolvePrevStepIndex`   | Previous visible index                            |
| `getStepGraph`           | Full `WizardStepGraph` (nodes, edges, visibility) |
| `getStepFields`          | Fields declared for a step id/index               |
| `wizardStepId`           | Resolve a step's stable id from its config/index  |

```ts
import { getStepGraph } from "@jayoncode/form-intelligence/wizard";

const graph = getStepGraph(wizardConfig); // same config passed to workflow.wizard
graph.nodes; // WizardStepGraphNode[] — { id, index, nextIds }
```

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
