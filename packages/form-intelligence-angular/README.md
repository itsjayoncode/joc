# @jayoncode/form-intelligence-angular

Angular adapter for [`@jayoncode/form-intelligence`](../form-intelligence/README.md).

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

@Component({
  standalone: true,
  imports: [FormIntelligentFormDirective, FormIntelligentFieldDirective],
  providers: [
    provideFormIntelligent({
      schema: { email: "email", password: "password" },
      onSubmit: async (values) => api.login(values),
    }),
  ],
  template: `
    <form fiForm>
      <input fiField="email" />
      @if (form.state().errors.email) {
        <span>{{ form.state().errors.email }}</span>
      }
      <button type="submit" [disabled]="!form.state().isValid">Login</button>
    </form>
  `,
})
export class LoginComponent {
  readonly form = injectForm();
}
```

## FormService (headless)

```typescript
import { Component, DestroyRef, inject } from "@angular/core";
import { FormIntelligentService } from "@jayoncode/form-intelligence-angular";

@Component({...})
export class HeadlessComponent {
  private readonly destroyRef = inject(DestroyRef);
  readonly form = inject(FormIntelligentService).create(
    { schema: { email: "email" }, onSubmit },
    this.destroyRef,
  );
}
```

Call `form.instance.ref(element)` manually when not using the `fiForm` directive.

`selectFormState(form, (state) => state.errors.email)` returns a computed signal for derived slices.
