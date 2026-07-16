# Form Intelligent React

Official React adapter for [`@jayoncode/form-intelligent`](../form-intelligent/README.md).

## Install

```bash
npm install @jayoncode/form-intelligent @jayoncode/form-intelligent-react
```

## Usage

`useForm` mirrors core `createForm` options. You never call `subscribe()` — the hook uses `useSyncExternalStore` internally.

```tsx
import { useForm } from "@jayoncode/form-intelligent-react";

export default function LoginForm() {
  const form = useForm({
    schema: {
      email: "email",
      password: "password",
    },
    async onSubmit(values) {
      await api.login(values);
    },
  });

  return (
    <form {...form.form()}>
      <input {...form.field("email")} />
      {form.state.errors.email && <span>{form.state.errors.email}</span>}
      <input {...form.field("password")} type="password" />
      <button {...form.submit()} disabled={!form.state.isValid}>
        Login
      </button>
    </form>
  );
}
```

### Lazy DOM attach

```tsx
const form = useForm({ schema: { email: "email" }, onSubmit });

return (
  <form ref={form.ref}>
    <input name="email" />
    <button type="submit">Login</button>
  </form>
);
```

## API surface

| Export                         | Role                                                                |
| ------------------------------ | ------------------------------------------------------------------- |
| `useForm(options)`             | Create/destroy instance across React lifecycle (StrictMode-safe)    |
| `useFormState(form, selector)` | Select a slice of `form.state` with re-renders                      |
| `form.state`                   | Current snapshot — `values`, `errors`, `isValid`, `isSubmitting`, … |
| `form.form()`                  | Spread onto `<form>` (submit handler, noValidate)                   |
| `form.field(path)`             | Spread onto inputs (`name`, events)                                 |
| `form.submit()`                | Spread onto submit button (`disabled`, `aria-busy`)                 |
| `form.ref`                     | Callback ref for lazy DOM enhancement                               |
| `form.instance`                | Underlying core `FormInstance` when you need imperative APIs        |

## Architecture

```
useForm()
  └── useSyncExternalStore(form.subscribe, () => cached form.state)
```

Application code reads `form.state`. Adapters own `subscribe()`.

## Ecosystem

See [Ecosystem architecture](../form-intelligent/engineering/001-ecosystem-architecture.md).

Interactive demos: [Form Intelligent Playground](https://itsjayoncode.github.io/joc/playground/form-intelligent/adapters).
