# Form Intelligence — Angular

[![npm version](https://img.shields.io/npm/v/@jayoncode/form-intelligence-angular.svg)](https://www.npmjs.com/package/@jayoncode/form-intelligence-angular)
[![Become a Sponsor](https://img.shields.io/badge/Become%20a%20Sponsor-%23ea4aaa?style=flat&logo=githubsponsors&logoColor=white)](https://github.com/sponsors/jayoncoding)

Angular adapter for [`@jayoncode/form-intelligence`](https://www.npmjs.com/package/@jayoncode/form-intelligence).

## The problem

Complex Angular forms often run **two systems at once**: Reactive Forms for controls, plus custom services for drafts, wizards, and API rules. ValueChanges subscriptions pile up for show/hide and autosave. Signals get glued on so the template stays reactive.

## The solution

Form Intelligence owns the workflow. This adapter wires Angular DI, signals, and thin directives (`fiForm` / `fiField`) so templates stay declarative and cleanup goes through `DestroyRef`.

## What you get

| API                                                         | Purpose                                                                                                                                                                                                                    |
| ----------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `provideFormIntelligent(config)`                            | Provide a form from component `providers` (same options as `createForm`)                                                                                                                                                   |
| `injectForm()`                                              | Inject the reactive form handle in the component tree                                                                                                                                                                      |
| `FORM_INTELLIGENT_FORM`                                     | The `InjectionToken` behind `provideFormIntelligent()` / `injectForm()` — inject it directly (with `{ optional: true }` if you need to check for absence) when you don't want the `injectForm()` throw-if-missing behavior |
| `FormIntelligentService` (alias: `FormService`)             | Imperative `create(config, destroyRef)` for headless setups                                                                                                                                                                |
| `fiForm` directive                                          | Bind the host `<form>` to the engine (`ref`, submit)                                                                                                                                                                       |
| `fiField` directive                                         | Sync `name` + projection `aria-invalid` / `data-fi-status`                                                                                                                                                                 |
| `form.controller` / `fieldController` / `focusFirstInvalid` | Same controller contract as React                                                                                                                                                                                          |
| `form.state()`                                              | Signal snapshot: values, errors, `isValid`, `isSubmitting`, …                                                                                                                                                              |
| `form.submit()` / `submitButton()`                          | Button UX from `form.ui.canSubmit`                                                                                                                                                                                         |
| `selectFormState(form, selector)`                           | Computed signal for a state slice                                                                                                                                                                                          |

Core config still includes: schema/validators, `validateOn`, `when()` rules, autosave, drafts, wizard, plugins, async validation, formatters.

## Install

```bash
npm install @jayoncode/form-intelligence @jayoncode/form-intelligence-angular
```

## Usage

```typescript
import { Component } from "@angular/core";
import {
  FormIntelligentFieldDirective,
  FormIntelligentFormDirective,
  injectForm,
  provideFormIntelligent,
} from "@jayoncode/form-intelligence-angular";
import { when } from "@jayoncode/form-intelligence";
import { ui } from "@jayoncode/form-intelligence/ui";

@Component({
  standalone: true,
  imports: [FormIntelligentFormDirective, FormIntelligentFieldDirective],
  providers: [
    provideFormIntelligent({
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
      onSubmit: async (values) => api.checkout(values),
    }),
  ],
  template: `
    <form fiForm>
      <select fiField="plan">
        <option value="starter">Starter</option>
        <option value="enterprise">Enterprise</option>
      </select>
      <input fiField="email" />
      @if (form.fieldController("email").ui.showError) {
        <span>{{ form.state().errors.email }}</span>
      }
      <input fiField="seatCount" type="number" />
      <button type="submit" [disabled]="form.submit().disabled">Continue</button>
    </form>
  `,
})
export class CheckoutComponent {
  readonly form = injectForm();
}
```

### Headless + signals

```typescript
readonly form = inject(FormIntelligentService).create(
  { schema: { email: "email" }, onSubmit },
  inject(DestroyRef),
);

readonly emailError = selectFormState(this.form, (s) => s.errors.email);
```

`FormIntelligentService` is also exported as `FormService` — a shorter alias for the same injectable:

```typescript
import { FormService } from "@jayoncode/form-intelligence-angular";

readonly form = inject(FormService).create({ schema: { email: "email" }, onSubmit }, inject(DestroyRef));
```

Call `form.instance.ref(element)` when you are not using `fiForm`.

### Injecting the token directly

`injectForm()` is a thin wrapper around the `FORM_INTELLIGENT_FORM` injection token that throws when `provideFormIntelligent()` is missing from an ancestor's providers. Inject the token directly when you want to handle the "no form provided" case yourself:

```typescript
import { FORM_INTELLIGENT_FORM } from "@jayoncode/form-intelligence-angular";

readonly form = inject(FORM_INTELLIGENT_FORM, { optional: true });
```

## Docs

- Core capabilities: https://itsjayoncode.github.io/joc/packages/form-intelligence/modules/capabilities
- Adapters: https://itsjayoncode.github.io/joc/packages/form-intelligence/modules/adapters

## License

MIT © [JayOnCode](https://github.com/itsjayoncode)
