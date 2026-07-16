/**
 * Progressive enhancement — attach Form Intelligent to existing markup.
 *
 * Requires a DOM (browser or jsdom). Smoke: `tests/integration/examples-smoke.test.ts`
 * Typecheck: `pnpm --filter @jayoncode/form-intelligent typecheck:examples`
 */
import { createForm } from "@jayoncode/form-intelligent";

export function runVanillaHtmlExample(): ReturnType<typeof createForm> {
  document.body.innerHTML = `
    <form id="login">
      <label>
        Email
        <input name="email" type="email" autocomplete="username" />
      </label>
      <label>
        Password
        <input name="password" type="password" autocomplete="current-password" />
      </label>
      <button type="submit">Sign in</button>
    </form>
  `;

  const form = createForm({
    target: "#login",
    schema: {
      email: "email",
      password: "password",
    },
    validateOn: "onBlur",
    async onSubmit(values, meta) {
      console.log("submitted", values, { aborted: meta?.signal?.aborted ?? false });
    },
  });

  console.log("form id", form.id);
  console.log("initial email", form.get("email"));
  return form;
}
