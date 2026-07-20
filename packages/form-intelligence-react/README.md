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

That boilerplate repeats per screen. Subscriptions are easy to forget.

## The solution

`useForm` owns the React subscription (`useSyncExternalStore`) and the instance lifecycle (StrictMode-safe: the instance is destroyed and recreated across the dev double-mount). The headless engine still owns validation, rules, drafts, and submit.

`form.field(path)` does **not** spread controlled `value` / `onChange`. It spreads `name` + `aria-*` + `data-fi-status`, matching the Vue and Angular adapters — the DOM enhancer (`form.ref` / `<form {...form.form()}>`) owns values and change events for native inputs. Put Phase 1 HTML constraints on those inputs (`required`, `minLength`, `type="email"`, …) — they become FI validators on attach (same as core `target` / `form.ref`). For headless / design-system inputs, use `form.fieldController(path).bind()` instead, which returns `{ name, value, onChange, onBlur, onFocus }` (no HTML-constraint import unless a real input is also bound).

## What you get

| API                                     | Purpose                                                                                                                                                                                                                                                                            |
| --------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `useForm(config)`                       | Create + subscribe; same options as `createForm` (`schema`, `rules`, `workflow`, `validateOn`, `onSubmit`, …). Config is only read on the **first** render — later prop/config changes are ignored (remount with a `key`, or call instance methods directly, to apply new config). |
| `form.form()`                           | Props for `<form>`: `{ ref, noValidate: true }`. The DOM enhancer attached via `ref` handles submit; there is no separate submit handler in the returned props.                                                                                                                    |
| `form.field(path)`                      | Native-friendly props for inputs: `name`, `aria-invalid`, `aria-required`, `aria-describedby`, `data-fi-status`. No `value`/`onChange`.                                                                                                                                            |
| `form.fieldController(path)`            | Full `FieldController` for the path — `bind()` (`{ name, value, onChange, onBlur, onFocus }`), `aria`, `setAriaIds`, `ui`                                                                                                                                                          |
| `form.controller`                       | Full `FormController` façade over the same instance (`field()`, `focusFirstInvalid()`, …)                                                                                                                                                                                          |
| `form.submit()` / `form.submitButton()` | Props for submit buttons: `{ type: "submit", disabled?, "aria-busy"? }`, disabled/derived from `form.instance.ui.canSubmit`                                                                                                                                                        |
| `form.focusFirstInvalid()`              | Focus the first invalid field after a failed submit (SSR-safe; no-ops without `document`)                                                                                                                                                                                          |
| `form.state`                            | Live snapshot: `values`, `errors`, `isValid`, `isSubmitting`, `isDirty`, field meta                                                                                                                                                                                                |
| `form.instance`                         | Escape hatch to the underlying Form Intelligence instance                                                                                                                                                                                                                          |
| `form.ref`                              | The same DOM enhancer ref used by `form.form()`, if you need it standalone                                                                                                                                                                                                         |
| `useFormState(form.instance, select)`   | Subscribe to a **slice** of state without re-rendering on every keystroke                                                                                                                                                                                                          |

Everything from core still applies through config: `when()` rules, autosave, drafts, wizards, async validators, plugins. Prefer passing `plugins: [ui()]` (from `@jayoncode/form-intelligence/ui`) so `field()`'s `data-fi-status` / `aria-*` output stays aligned with your own UI policies.

## Install

```bash
npm install @jayoncode/form-intelligence @jayoncode/form-intelligence-react
```

## Usage

```tsx
import { useForm } from "@jayoncode/form-intelligence-react";
import { when } from "@jayoncode/form-intelligence";
import { ui } from "@jayoncode/form-intelligence/ui";

export default function CheckoutPage() {
  const form = useForm({
    plugins: [ui()],
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
      <button {...form.submit()}>Continue</button>
    </form>
  );
}
```

### Headless inputs — `fieldController(path).bind()`

Design-system components that expect a controlled `value` / `onChange` pair should use the full field controller instead of `field()`:

```tsx
const email = form.fieldController("email");

<MyTextInput {...email.bind()} {...email.aria.attributes} />;
```

### Focus first invalid field after a failed submit

```tsx
await form.instance.submit();
if (!form.instance.isValid()) {
  form.focusFirstInvalid();
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
