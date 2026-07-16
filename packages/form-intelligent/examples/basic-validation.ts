/**
 * Headless validation with built-in validators.
 *
 * Typecheck: `pnpm --filter @jayoncode/form-intelligent typecheck:examples`
 * Smoke: covered by `tests/integration/examples-smoke.test.ts`
 */
import { createForm, email, minLength, required } from "@jayoncode/form-intelligent";

export async function runBasicValidationExample(): Promise<void> {
  const form = createForm({
    initialValues: {
      email: "",
      password: "",
    },
    validators: {
      email: [required, email],
      password: [required, minLength(8)],
    },
    validateOn: "onSubmit",
    async onSubmit(values) {
      console.log("valid submit", values);
    },
  });

  const empty = await form.validate();
  console.log("empty form valid?", empty, form.getErrors());

  form.setValue("email", "not-an-email");
  form.setValue("password", "short");
  const invalid = await form.validate();
  console.log("invalid form valid?", invalid, form.getErrors());

  form.setValue("email", "user@example.com");
  form.setValue("password", "secret123");
  const ok = await form.submit();
  console.log("submit ok?", ok, "submitCount", form.state.submitCount);

  form.destroy();
}
