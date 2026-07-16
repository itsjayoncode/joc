/**
 * Angular adapter example — illustration only (needs an Angular app).
 *
 * Install peers:
 *   npm install @jayoncode/form-intelligent @jayoncode/form-intelligent-angular @angular/core
 *
 * Prefer `provideFormIntelligent` + directives in a real app.
 * See packages/form-intelligent-angular/README.md.
 */
import { provideFormIntelligent } from "@jayoncode/form-intelligent-angular";

export const loginFormProviders = [
  provideFormIntelligent({
    schema: {
      email: "email",
      password: "password",
    },
    async onSubmit(values) {
      console.log("angular submit", values);
    },
  }),
];
