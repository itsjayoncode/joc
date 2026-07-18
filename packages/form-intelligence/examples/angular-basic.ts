/**
 * Angular adapter example — illustration only (needs an Angular app).
 *
 * Install peers:
 *   npm install @jayoncode/form-intelligence @jayoncode/form-intelligence-angular @angular/core
 *
 * Prefer `provideFormIntelligent` + directives in a real app.
 * See packages/form-intelligence-angular/README.md.
 */
import { provideFormIntelligent } from "@jayoncode/form-intelligence-angular";

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
