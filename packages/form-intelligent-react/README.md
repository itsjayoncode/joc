# Form Intelligent React

React adapter for [`@jayoncode/form-intelligent`](../form-intelligent/README.md).

## Install

```bash
npm install @jayoncode/form-intelligent @jayoncode/form-intelligent-react
```

## Usage

```tsx
import { useForm } from "@jayoncode/form-intelligent-react";

export default function App() {
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

Keep your markup. The engine owns validation, submit, and loading state. No `subscribe()` in app code.
