# Submission

Send valid data to your API — with loading state, cancel, retries, offline queueing, and hard submission guards.

**Previous:** [Validation](/packages/form-intelligence/modules/validation) · **Next:** [State](/packages/form-intelligence/modules/state)

::: tip Playground
[Submission explorer →](/playground/form-intelligence/submission) — hard `submissionGuard()`, `form.ui.canSubmit`, flaky API, offline queue, cancel.
:::

## Import path

Prefer the **instance API** (`form.submit()`, `form.submissionGuard()`, `workflow.offlineQueue`). Low-level helpers live on `@jayoncode/form-intelligence/submission` and `/offline` — see [Entrypoints](/packages/form-intelligence/modules/entrypoints).

```ts
import { createForm } from "@jayoncode/form-intelligence";
```

## Problem → solution

| Problem                                 | Solution                                                  |
| --------------------------------------- | --------------------------------------------------------- |
| Double-submit and missing loading flags | Hard `submissionGuard()` + `isSubmitting`                 |
| Button UX forked from engine safety     | `form.ui.canSubmit` / `explain("submit")` — see below     |
| Need cancel / retry on flaky networks   | `cancelSubmit()`, `retry`, AbortSignal in `onSubmit` meta |
| Submit while offline                    | `workflow.offlineQueue`                                   |

## Overview

1. `submit()` checks **hard** `submissionGuard()` (may refuse before validation)
2. Runs field validation
3. Re-checks `ruleDisabled` after validate (rules may have changed)
4. Runs the **Security Stage** when registered (e.g. CAPTCHA via `/captcha`)
5. On success, invokes `onSubmit(values, meta)` — token at `meta.security.captcha`
6. `isSubmitting` is `true` for the handler duration
7. Concurrent `submit()` calls are ignored while in flight (by default)

---

## Hard guards vs button UX

Two related APIs — **do not treat them as the same thing:**

| Question                                   | API                         | Enforced by engine?                          |
| ------------------------------------------ | --------------------------- | -------------------------------------------- |
| May the submission pipeline **start**?     | `form.submissionGuard()`    | **Yes** — `submit()` refuses when `!allowed` |
| Should the submit **button** look enabled? | `form.ui.canSubmit`         | **No** — presentation only                   |
| **Why** is the button disabled?            | `form.ui.explain("submit")` | No — explanation only                        |

```ts
const guard = form.submissionGuard();
// { allowed: boolean, reasons: ("alreadySubmitting" | "ruleDisabled")[] }

form.ui.canSubmit; // composes hard guard + UX policy (disableSubmitWhen)
form.ui.explain("submit"); // { value, reasons, contributors }
```

### Hard guards (Submission owns these)

| Reason              | When                                                                 |
| ------------------- | -------------------------------------------------------------------- |
| `alreadySubmitting` | In-flight submit (default double-submit protection)                  |
| `ruleDisabled`      | Presentation / `when(…).disableSubmit()` set `formUi.submitDisabled` |

`submit()` evaluates the guard **before** starting and **re-checks `ruleDisabled` after** validate-on-submit.

`form.submissionGuard()` is a thin wrapper over the standalone `evaluateSubmissionGuard` — call the pure function directly for tests/tooling that check eligibility without a live form:

```ts
import { evaluateSubmissionGuard } from "@jayoncode/form-intelligence/submission";

evaluateSubmissionGuard({ alreadySubmitting, ruleSubmitDisabled });
// → { allowed: boolean, reasons: ("alreadySubmitting" | "ruleDisabled")[] }
```

### UX policy (`/ui` — button only)

`disableSubmitWhen` tokens such as `validating` or opt-in `invalid` can disable the **button** via `form.ui.canSubmit` without changing whether `submit()` is allowed. Hard-guard reasons always force `canSubmit === false`.

Defaults omit `invalid` so users can click Submit to run validate-on-submit.

Full policy table: [UI projection](/packages/form-intelligence/modules/ui-projection).

```tsx
import { ui } from "@jayoncode/form-intelligence/ui";

const form = useForm({
  plugins: [ui()],
  schema: { message: { required: true } },
  onSubmit,
});

<button {...form.submit()} disabled={!form.instance.ui.canSubmit}>
  Send
</button>;
```

Prefer `form.submit()` / adapter helpers that already wire `form.ui.canSubmit` — see [Adapters](/packages/form-intelligence/modules/adapters).

---

## Basics — submit handler

```ts
const form = createForm({
  initialValues: { message: "" },
  validators: { message: [required] },
  onSubmit: async (values, meta) => {
    await api.sendMessage(values, { signal: meta?.signal });
  },
});

await form.submit(); // true on success, false on validation fail / cancel / guard
```

Loading UI:

```ts
form.state.isSubmitting;
form.state.submitPhase; // "idle" | "validating" | "submitting" | "success" | "error"
// or form.isSubmitting()
```

Submit pipeline (Phase 10):

1. Hard `submissionGuard()` (`preventDoubleSubmit` / `ruleDisabled`)
2. `submitPhase = "validating"` → validate
3. Re-check `ruleDisabled`
4. **Security Stage** (when registered — e.g. CAPTCHA) — abort on failure; no `onSubmit`
5. Onion `useMiddleware` (`beforeSubmit`) then plugin `beforeSubmit` hooks
6. `submitPhase = "submitting"` → `onSubmit` (with retry / cancel; `meta.security` when stage succeeded)
7. Plugin `afterSubmit` hooks then middleware `afterSubmit`
8. Settle `submitPhase` to `success` / `error` / `idle` (cancel)

---

## AbortSignal and cancel

`onSubmit` receives `meta.signal` so you can abort in-flight fetches:

```ts
onSubmit: async (values, meta) => {
  await fetch("/api/save", {
    method: "POST",
    body: JSON.stringify(values),
    signal: meta?.signal,
  });
},
```

Cancel from UI:

```ts
form.cancelSubmit();
```

---

## Retries

```ts
await form.submit({
  retry: 3, // number of attempts
});

await form.submit({
  retry: {
    maxAttempts: 3,
    delayMs: 250,
    // optional shouldRetry(error, attempt)
  },
});
```

---

## Include object diff in meta

```ts
await form.submit({ includeDiff: true });

onSubmit: async (values, meta) => {
  console.log(meta?.diff); // FormDiffResult when includeDiff is set
},
```

Requires optional peer `@jayoncode/object-diff`.

---

## Error handling

If `onSubmit` throws, `submit()` returns `false` and `onSubmitError` runs:

```ts
createForm({
  onSubmit: async (values) => {
    const res = await fetch("/api/signup", {
      method: "POST",
      body: JSON.stringify(values),
    });
    if (!res.ok) throw new Error("Signup failed");
  },
  onSubmitError: (error) => {
    toast.error(error instanceof Error ? error.message : "Something went wrong");
  },
});
```

---

## Double-submit guard

Calling `submit()` again while the first is still running returns `false` — your handler is **not** called twice. Same condition surfaces as `submissionGuard().reasons` including `alreadySubmitting`.

```ts
await form.submit();
await form.submit(); // → false while in flight
form.submissionGuard(); // { allowed: false, reasons: ["alreadySubmitting"] }
```

Opt out: `form.submit({ preventDoubleSubmit: false })`.

---

## Offline queue

Queue submits while offline; flush when back online:

```ts
createForm({
  initialValues: { email: "" },
  validators: { email: [required, email] },
  workflow: {
    offlineQueue: {
      enabled: true,
      storageKey: "signup:offline",
      maxItems: 50,
      overflow: "drop-oldest", // or "drop-newest" | "reject"
      onOverflow: (dropped, policy) => {
        console.warn("dropped offline item", dropped.id, policy);
      },
      idempotencyKey: (values) => values.email,
      onConflict: (local, error) => {
        // Flush failure: keep (default), drop, or retry
        console.warn("offline conflict", local.id, error);
        return "keep";
      },
    },
  },
  onSubmit: async (values) => api.register(values),
});

form.state.submissionQueue.pending;
form.state.submissionQueue.flushing;

await form.flushOfflineQueue();
```

| Option           | Notes                                                                  |
| ---------------- | ---------------------------------------------------------------------- |
| `maxItems`       | Soft cap on queued items                                               |
| `overflow`       | Default `"drop-oldest"`; also `"drop-newest"` \| `"reject"`            |
| `onOverflow`     | `(dropped, policy) => void` — called when an item is dropped by policy |
| `idempotencyKey` | Skip enqueue when a pending item shares the same key                   |
| `onConflict`     | Flush failure policy: `"keep"` \| `"drop"` \| `"retry"`                |

When `/captcha` is registered, enqueue requires a successful Security Stage, and flush re-runs it so `onSubmit` receives a fresh `meta.security.captcha` (see [CAPTCHA](/packages/form-intelligence/modules/captcha#offline-queue)).

Overflow `reject` and storage quota throw `OfflineQueueError` (`code: "offline_error"`).

Storage format remains a JSON array of `{ id, values, enqueuedAt, attempt?, idempotencyKey? }` — older payloads without the new fields still load.

Pair with `createBrowserLifecyclePlugin({ flushOfflineQueueOnOnline: true })` — see [Integrations](/packages/form-intelligence/modules/integrations).

---

## Security Stage API

The Security Stage runs between validation and `beforeSubmit` (see [Overview](#overview)). `captcha()` registers through it; you can also register your own stage for CSRF / OTP-style gates:

| Export                           | Role                                                                |
| -------------------------------- | ------------------------------------------------------------------- |
| `registerSecurityStage`          | Register one stage handler per form (last registration wins)        |
| `runSecurityStage`               | Invoked internally by `submit()` — run the registered stage handler |
| `getSecurityStageExplainReasons` | Soft reasons surfaced in `form.ui.explain("submit")`                |

See [CAPTCHA → Custom Security Stage](/packages/form-intelligence/modules/captcha#custom-security-stage) for a full example.

## Low-level `/submission` exports (advanced)

`@jayoncode/form-intelligence/submission` also exposes the orchestrator internals behind `form.submit()` / `workflow.offlineQueue`. Prefer the instance API — these are for building an alternate submit surface or unit-testing the pipeline in isolation.

| Export                   | Role                                                             |
| ------------------------ | ---------------------------------------------------------------- |
| `executeSubmit`          | Runs one submit attempt (validation → security → `onSubmit`)     |
| `SubmissionOrchestrator` | Stateful class behind `form.submit()` / `cancelSubmit()`         |
| `SubmissionController`   | Cancel-token bookkeeping (`cancelSubmit()`)                      |
| `OfflineSubmitQueue`     | Class behind `workflow.offlineQueue`                             |
| `clearOfflineQueue`      | Reset persisted queue state for a storage key                    |
| `normalizeRetryPolicy`   | Normalize the `retry` option (number or `RetryPolicy`) shorthand |
| `DEFAULT_RETRY_POLICY`   | Default `{ maxAttempts, delayMs }` used when `retry` is omitted  |

---

## Common patterns

| Scenario            | What to do                                                      |
| ------------------- | --------------------------------------------------------------- |
| Disable the button  | `disabled={!form.ui.canSubmit}` (or adapter `submit()` helper)  |
| Inspect eligibility | `form.submissionGuard()` / `form.ui.explain("submit")`          |
| Retry after error   | Show error UI; user clicks submit again — or use `retry` option |
| Cancel slow request | `form.cancelSubmit()` + honor `meta.signal`                     |
| Offline             | Enable `workflow.offlineQueue`                                  |
| Optimistic UI       | Update UI before `onSubmit`; rollback in `onSubmitError`        |

---

## Element structure

### Native HTML

```html
<form id="contact">
  <label>
    Message
    <textarea name="message" rows="4"></textarea>
  </label>
  <button type="submit">Send</button>
  <button type="button" id="cancel">Cancel</button>
</form>
```

```ts
import { ui } from "@jayoncode/form-intelligence/ui";

const form = createForm({
  target: "#contact",
  plugins: [ui()],
  schema: { message: { required: true } },
  onSubmit: async (values, meta) => {
    await api.send(values, { signal: meta?.signal });
  },
});

document.querySelector("#cancel")?.addEventListener("click", () => {
  form.cancelSubmit();
});
```

With `ui()` registered, the enhancer disables submit from `form.ui.canSubmit` and sets `aria-busy` while submitting.

### React JSX

```tsx
<form {...form.form()}>
  <label>
    Message
    <textarea {...form.field("message")} rows={4} />
    {form.fieldController("message").ui.showError ? (
      <span role="alert">{form.state.errors.message}</span>
    ) : null}
  </label>

  <button {...form.submit()}>{form.state.isSubmitting ? "Sending…" : "Send"}</button>
  <button type="button" onClick={() => form.cancelSubmit()} disabled={!form.state.isSubmitting}>
    Cancel
  </button>
</form>
```

`form.submit()` already disables from `form.ui.canSubmit` — do not reintroduce `isSubmitting || state.ui.submitDisabled` by hand.

---

## Cheat sheet

```ts
const ok = await form.submit({ retry: 2, includeDiff: true });
form.submissionGuard(); // hard eligibility
form.ui.canSubmit; // button UX
form.ui.explain("submit");
form.cancelSubmit();
form.state.isSubmitting;
form.state.submitCount;
form.state.submissionQueue;
await form.flushOfflineQueue();
```

**Related:** [UI projection](/packages/form-intelligence/modules/ui-projection) · **Next:** [State](/packages/form-intelligence/modules/state) — snapshots, field meta, undo/redo, diffs.
