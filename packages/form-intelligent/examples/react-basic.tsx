/**
 * React adapter example — illustration only (needs a React renderer).
 *
 * Install peers:
 *   npm install @jayoncode/form-intelligent @jayoncode/form-intelligent-react react react-dom
 *
 * The adapter attaches via `form.ref` / `form.form()` and discovers inputs by `name`.
 * For a live UI, use apps/form-intelligent-playground.
 */
import { useForm } from "@jayoncode/form-intelligent-react";

export function LoginForm() {
  const form = useForm({
    schema: {
      email: "email",
      password: "password",
    },
    async onSubmit(values) {
      console.log("react submit", values);
    },
  });

  return (
    <form {...form.form()}>
      <input {...form.field("email")} type="email" />
      <input {...form.field("password")} type="password" />
      <button {...form.submit()} type="submit">
        Sign in
      </button>
      {form.state.errors.email ? <p role="alert">{form.state.errors.email}</p> : null}
    </form>
  );
}
