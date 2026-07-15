# Submission

Send valid data to your API — with loading state and protection against double-clicks.

**Previous:** [Validation](/packages/form-intelligent/modules/validation) · **Next:** [Workflow](/packages/form-intelligent/modules/workflow)

::: tip Try it first
[Open Submission playground →](/playground/form-intelligent/submission) — simulate flaky APIs, offline queue, and double-submit.
:::

## In plain English

1. User clicks submit
2. Form Intelligent **validates** all fields
3. If valid, runs your **`onSubmit`** handler
4. While the handler runs, **`isSubmitting`** is `true`

You write step 3. The engine handles 1, 2, and 4.

---

## Level 1 — Basic submit

```ts
const form = createForm({
  initialValues: { message: "" },
  validators: { message: [required] },
  onSubmit: async (values) => {
    await api.sendMessage(values);
  },
});

await form.submit(); // returns true on success, false on validation fail
```

Show a loading button:

```ts
const { isSubmitting } = form.getFormState();
// disabled={isSubmitting}
```

---

## Level 2 — Handle failures

If `onSubmit` throws, `submit()` returns `false` and `onSubmitError` runs:

```ts
createForm({
  onSubmit: async (values) => {
    const res = await fetch("/api/signup", { method: "POST", body: JSON.stringify(values) });
    if (!res.ok) throw new Error("Signup failed");
  },
  onSubmitError: (error) => {
    toast.error(error instanceof Error ? error.message : "Something went wrong");
  },
});
```

---

## Level 3 — Double-submit guard

Calling `submit()` again while the first is still running returns `false` — your handler is **not** called twice.

```ts
// User double-clicks — safe by default
await form.submit();
await form.submit(); // → false, onSubmit not invoked again
```

Opt out: `form.submit({ preventDoubleSubmit: false })`.

---

## Common patterns

| Scenario          | What to do                                               |
| ----------------- | -------------------------------------------------------- |
| Retry after error | Show error UI; user clicks submit again                  |
| Optimistic UI     | Update UI before `onSubmit`; rollback in `onSubmitError` |
| Offline           | Queue in your app; flush when back online                |
| Cancel request    | Use `AbortController` inside `onSubmit`                  |

---

## Cheat sheet

```ts
const ok = await form.submit();
form.getFormState().isSubmitting; // true while handler runs
form.getFormState().submitCount; // how many successful submits
```

**Next:** [Workflow](/packages/form-intelligent/modules/workflow) — autosave, drafts, and wizards.
