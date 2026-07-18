# Form Intelligence — React

[![npm version](https://img.shields.io/npm/v/@jayoncode/form-intelligence-react.svg)](https://www.npmjs.com/package/@jayoncode/form-intelligence-react)

React adapter for [`@jayoncode/form-intelligence`](https://www.npmjs.com/package/@jayoncode/form-intelligence).

## The problem

You already picked Form Intelligence for rules and workflows — but in React you still wire the engine by hand:

```tsx
const [tick, setTick] = useState(0);

useEffect(() => form.subscribe(() => setTick((n) => n + 1)), [form]);

<input
  value={form.values.email}
  onChange={(e) => form.setValue("email", e.target.value)}
  onBlur={() => form.field("email").onBlur()}
/>;
```

That boilerplate repeats per screen. Subscriptions are easy to forget. Controlled inputs fight the engine’s timing.

## The solution

`useForm` owns the React subscription (`useSyncExternalStore`) and gives you **spreadable bindings**. The headless engine still owns validation, rules, drafts, and submit.

## What you get

| API                          | Purpose                                                                                                       |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `useForm(config)`            | Create + subscribe; same options as `createForm` (`schema`, `rules`, `workflow`, `validateOn`, `onSubmit`, …) |
| `form.form()`                | Props for `<form>` (submit handler, noValidate, …)                                                            |
| `form.field(path)`           | Props for inputs (`name`, `value`, `onChange`, `onBlur`, `onFocus`)                                           |
| `form.submit()`              | Props for submit buttons (disabled while submitting when wired)                                               |
| `form.state`                 | Live snapshot: `values`, `errors`, `isValid`, `isSubmitting`, `isDirty`, field meta                           |
| `form.instance`              | Escape hatch to the underlying Form Intelligence instance                                                     |
| `useFormState(form, select)` | Subscribe to a **slice** of state without re-rendering on every keystroke                                     |

Everything from core still applies through config: `when()` rules, autosave, drafts, wizards, async validators, plugins.

## Install

```bash
npm install @jayoncode/form-intelligence @jayoncode/form-intelligence-react
```

## Usage

```tsx
import { useForm } from "@jayoncode/form-intelligence-react";
import { when } from "@jayoncode/form-intelligence";

export default function CheckoutPage() {
  const form = useForm({
    schema: {
      plan: { required: true },
      email: "email",
      seatCount: { required: true },
    },
    validateOn: "onBlur",
    rules: [when("plan").equals("enterprise").show("seatCount").require("seatCount")],
    workflow: {
      autosave: { enabled: true, debounceMs: 800, onSave: (v) => api.saveDraft(v) },
    },
    async onSubmit(values) {
      await api.checkout(values);
    },
  });

  return (
    <form {...form.form()}>
      <select {...form.field("plan")}>
        <option value="starter">Starter</option>
        <option value="enterprise">Enterprise</option>
      </select>
      <input {...form.field("email")} />
      {form.state.errors.email && <span>{form.state.errors.email}</span>}
      <input {...form.field("seatCount")} type="number" />
      <button {...form.submit()} disabled={form.state.isSubmitting}>
        Continue
      </button>
    </form>
  );
}
```

### Selective re-renders

```tsx
import { useFormState } from "@jayoncode/form-intelligence-react";

const emailError = useFormState(form.instance, (s) => s.errors.email);
```

## Docs

- Core capabilities: https://itsjayoncode.github.io/joc/packages/form-intelligence/modules/capabilities
- Adapters: https://itsjayoncode.github.io/joc/packages/form-intelligence/modules/adapters
- Playground: https://itsjayoncode.github.io/joc/playground/form-intelligence/adapters

## License

MIT © [JayOnCode](https://github.com/itsjayoncode)
