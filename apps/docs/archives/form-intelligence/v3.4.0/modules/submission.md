---
title: Submission
description: Form Intelligence documentation for Submission.
---

# Submission

Send valid data to your API — with loading state, cancel, retries, and offline queueing.

**Previous:** [Validation](/packages/form-intelligence/modules/validation) · **Next:** [State](/packages/form-intelligence/modules/state)

::: tip Playground
[Submission explorer →](/playground/form-intelligence/submission) — flaky API, offline queue, double-submit guard, cancel.
:::

## Import path

Prefer the **instance API** (`form.submit()`, `workflow.offlineQueue`). Low-level classes live on `@jayoncode/form-intelligence/submission` and `/offline` — see [Entrypoints](/packages/form-intelligence/modules/entrypoints).

```ts
import { createForm } from "@jayoncode/form-intelligence";
```

## Problem → solution

| Problem                                 | Solution                                                  |
| --------------------------------------- | --------------------------------------------------------- |
| Double-submit and missing loading flags | Built-in `isSubmitting` + concurrent-submit guard         |
| Need cancel / retry on flaky networks   | `cancelSubmit()`, `retry`, AbortSignal in `onSubmit` meta |
| Submit while offline                    | `workflow.offlineQueue`                                   |

## Overview

1. `submit()` runs field validation
2. On success, invokes `onSubmit(values, meta)`
3. `isSubmitting` is `true` for the handler duration
4. Concurrent `submit()` calls are ignored while in flight (by default)

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

1. Guard concurrent submits (`preventDoubleSubmit`)
2. `submitPhase = "validating"` → validate
3. Onion `useMiddleware` (`beforeSubmit`) then plugin `beforeSubmit` hooks
4. `submitPhase = "submitting"` → `onSubmit` (with retry / cancel)
5. Plugin `afterSubmit` hooks then middleware `afterSubmit`
6. Settle `submitPhase` to `success` / `error` / `idle` (cancel)

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

Calling `submit()` again while the first is still running returns `false` — your handler is **not** called twice.

```ts
await form.submit();
await form.submit(); // → false while in flight
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

Overflow `reject` and storage quota throw `OfflineQueueError` (`code: "offline_error"`).

Storage format remains a JSON array of `{ id, values, enqueuedAt, attempt?, idempotencyKey? }` — older payloads without the new fields still load.

Pair with `createBrowserLifecyclePlugin({ flushOfflineQueueOnOnline: true })` — see [Integrations](/packages/form-intelligence/modules/integrations).

---

## Common patterns

| Scenario            | What to do                                                      |
| ------------------- | --------------------------------------------------------------- |
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
createForm({
  target: "#contact",
  schema: { message: { required: true } },
  onSubmit: async (values, meta) => {
    await api.send(values, { signal: meta?.signal });
  },
});

document.querySelector("#cancel")?.addEventListener("click", () => {
  form.cancelSubmit();
});
```

While submitting, the engine sets `aria-busy` on the form and disables submit buttons.

### React JSX

```tsx
<form {...form.form()}>
  <label>
    Message
    <textarea {...form.field("message")} rows={4} />
    {form.state.errors.message ? <span role="alert">{form.state.errors.message}</span> : null}
  </label>

  <button {...form.submit()} disabled={form.state.isSubmitting || form.state.ui.submitDisabled}>
    {form.state.isSubmitting ? "Sending…" : "Send"}
  </button>
  <button type="button" onClick={() => form.cancelSubmit()} disabled={!form.state.isSubmitting}>
    Cancel
  </button>
</form>
```

---

## Cheat sheet

```ts
const ok = await form.submit({ retry: 2, includeDiff: true });
form.cancelSubmit();
form.state.isSubmitting;
form.state.submitCount;
form.state.submissionQueue;
await form.flushOfflineQueue();
```

**Next:** [State](/packages/form-intelligence/modules/state) — snapshots, field meta, undo/redo, diffs.
