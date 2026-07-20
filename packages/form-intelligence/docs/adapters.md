# Adapters

Use Form Intelligence with your existing UI stack — native HTML, React, or headless bindings.

**Previous:** [Integrations](/packages/form-intelligence/modules/integrations) · **Next:** [Plugins](/packages/form-intelligence/modules/plugins)

::: tip Playground
[Adapters explorer →](/playground/form-intelligence/adapters) — current integrations and planned bridges.

[HTML constraints →](/playground/form-intelligence/html-constraints) — native attributes → FI validators on attach.
:::

## Import path

| Layer                         | Package                                                         |
| ----------------------------- | --------------------------------------------------------------- |
| Core + `createFormController` | `@jayoncode/form-intelligence` (controller also on `/adapters`) |
| React / Vue / Angular         | `@jayoncode/form-intelligence-react` (etc.)                     |
| Schema adapters               | `@jayoncode/form-intelligence-zod`, `-yup`, `-valibot`, `-ajv`  |
| Adapter types                 | `@jayoncode/form-intelligence/adapters`                         |

[Entrypoints](/packages/form-intelligence/modules/entrypoints) for core subpaths.

## Overview

Adapters connect `createForm()` to framework-specific lifecycle and field bindings. The core package (`@jayoncode/form-intelligence`) remains framework-agnostic; each adapter ships as its own npm package.

See [Ecosystem architecture](https://github.com/itsjayoncode/joc/blob/master/packages/form-intelligence/engineering/001-ecosystem-architecture.md) for the full package map.

## Compatibility contract

Framework adapters share one product contract (lifecycle, field projection attrs, submit UX, controllers, focus). Details: [017-adapter-contract](https://github.com/itsjayoncode/joc/blob/master/packages/form-intelligence/engineering/017-adapter-contract.md).

| Capability                                             | React | Vue         | Angular                     |
| ------------------------------------------------------ | ----- | ----------- | --------------------------- |
| Reactive `state`                                       | Yes   | Yes (`Ref`) | Yes (`Signal`)              |
| `field()` → `aria-invalid` / `data-fi-status`          | Yes   | Yes         | Yes (+ `fiField` directive) |
| `submit()` from `form.ui.canSubmit`                    | Yes   | Yes         | Yes                         |
| `controller` / `fieldController` / `focusFirstInvalid` | Yes   | Yes         | Yes                         |
| Prefer `plugins: [ui()]`                               | Yes   | Yes         | Yes                         |

`field()` does **not** spread controlled `value`/`onChange` — use the DOM enhancer or `fieldController(path).bind()` for headless inputs.

---

## Native HTML (built-in)

No extra package. Use `target` / `form.ref` for **DOM-backed forms** (plain HTML or framework bindings that render real inputs under a bound `<form>`).

Constraint attributes on those inputs are imported into Form Intelligence validators **once on DOM attach** (not via the browser’s `checkValidity`). Native validation UI is disabled (`novalidate`).

### Phase 1 HTML → validators

| HTML           | Form Intelligence                         |
| -------------- | ----------------------------------------- |
| `required`     | `required`                                |
| `minlength`    | `minLength(n)`                            |
| `maxlength`    | `maxLength(n)`                            |
| `pattern`      | `regex(…)` (invalid patterns are skipped) |
| `type="email"` | `email`                                   |
| `type="url"`   | `url`                                     |

Merge precedence for the same validator **kind**: **Field > Schema > HTML**. Custom validators are kept. HTML `required` also seeds Presentation required (same baseline as schema — see [Validation](/packages/form-intelligence/modules/validation#html-constraints-dom-backed)).

Deferred: `min` / `max` / `step` / `multiple` / date-time constraints, MutationObserver re-extraction.

```ts
createForm({
  target: "#register",
  // optional — Field/Schema override HTML when kinds collide
  async onSubmit(values) {
    await api.register(values);
  },
});
```

```html
<form id="register">
  <input name="email" required type="email" />
  <input name="password" type="password" required minlength="8" />
  <button type="submit">Register</button>
</form>
```

You can still pass `schema` / `validators` — they merge with HTML as above:

```ts
createForm({
  target: "#register",
  schema: { email: "email", password: "password" },
  async onSubmit(values) {
    await api.register(values);
  },
});
```

---

## React — `@jayoncode/form-intelligence-react`

```bash
npm install @jayoncode/form-intelligence @jayoncode/form-intelligence-react
```

```tsx
import { useForm } from "@jayoncode/form-intelligence-react";

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
    <input {...form.field("password")} type="password" />
    <button {...form.submit()}>Login</button>
  </form>
);
```

`useForm` owns instance lifecycle (StrictMode-safe). `form.field(path)` spreads `name`, `aria-*`, and `data-fi-status` from the UI projection (`showError` / `status`). Submit buttons use `form.ui.canSubmit`. Prefer `plugins: [ui()]` so DOM parity and custom policies stay aligned — see [UI projection](/packages/form-intelligence/modules/ui-projection). Use `form.fieldController(path)` / `form.controller` for the full controller surface (`bind`, `setAriaIds`, `focusFirstInvalid`).

Read `form.state` in JSX — never `subscribe()` (or `createForm({ subscribe })`) in application code.

Internally the adapter uses:

```ts
useSyncExternalStore(form.subscribe, () => form.state);
```

---

## Headless bindings (any framework)

```ts
const email = form.field("email");
const binding = email.bind();
// { name, value, onChange, onBlur, onFocus }

email.setAriaIds({ errorId: "email-error", descriptionId: "email-help" });
const { attributes } = email.aria;
// { "aria-invalid", "aria-required"?, "aria-describedby"? }
```

Prefer **Field / Form Controllers** for design-system binding:

```ts
import { createFormController } from "@jayoncode/form-intelligence";

const controller = createFormController(form);
const field = controller.field("email");
field.setAriaIds({ errorId: "email-err" });
<input {...field.bind()} {...field.aria.attributes} />

await form.submit();
if (!form.isValid()) {
  controller.focusFirstInvalid(); // SSR-safe; focuses `[name=…]` when document exists
}
```

---

## Accessibility (`field.aria`)

`field.aria` is a thin wrapper over `computeFieldAria` (also on `/accessibility`) — a pure function you can call directly for a custom binding layer or tests:

```ts
import { computeFieldAria } from "@jayoncode/form-intelligence";

computeFieldAria({
  error: form.state.errors.email, // string | undefined
  required: true,
  ids: { descriptionId: "email-help", errorId: "email-error" },
});
// → {
//   aria: { ariaInvalid, ariaRequired, ariaDescribedBy? },
//   attributes: { "aria-invalid", "aria-required"?, "aria-describedby"? },
// }
```

| Flag / attribute                       | Source                                                      |
| -------------------------------------- | ----------------------------------------------------------- |
| `ariaInvalid` / `aria-invalid`         | Non-empty field error                                       |
| `ariaRequired` / `aria-required`       | Presentation `required === true`                            |
| `ariaDescribedBy` / `aria-describedby` | `descriptionId` then `errorId` (error id only when invalid) |

`attributes` is spread-ready (`"aria-required"` omitted when `false`); `aria` exposes the plain booleans. Prefer `field.aria` — call `computeFieldAria` directly only when building a custom controller.

---

## Zod — `@jayoncode/form-intelligence-zod`

```bash
npm install @jayoncode/form-intelligence @jayoncode/form-intelligence-zod zod
```

```ts
import { createForm } from "@jayoncode/form-intelligence";
import { zodAdapter } from "@jayoncode/form-intelligence-zod";
import { z } from "zod";

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const form = createForm({
  initialValues: { email: "", password: "" },
  schema: zodAdapter(signupSchema),
  onSubmit,
});
```

---

## Yup — `@jayoncode/form-intelligence-yup`

```bash
npm install @jayoncode/form-intelligence @jayoncode/form-intelligence-yup yup
```

```ts
import { createForm } from "@jayoncode/form-intelligence";
import { yupAdapter } from "@jayoncode/form-intelligence-yup";
import * as yup from "yup";

const signupSchema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().min(8).required(),
});

const form = createForm({
  initialValues: { email: "", password: "" },
  schema: yupAdapter(signupSchema),
  onSubmit,
});
```

---

## Valibot — `@jayoncode/form-intelligence-valibot`

```bash
npm install @jayoncode/form-intelligence @jayoncode/form-intelligence-valibot valibot
```

```ts
import { createForm } from "@jayoncode/form-intelligence";
import { valibotAdapter } from "@jayoncode/form-intelligence-valibot";
import * as v from "valibot";

const signupSchema = v.object({
  email: v.pipe(v.string(), v.email()),
  password: v.pipe(v.string(), v.minLength(8)),
});

const form = createForm({
  initialValues: { email: "", password: "" },
  schema: valibotAdapter(signupSchema),
  onSubmit,
});
```

---

## AJV — `@jayoncode/form-intelligence-ajv`

```bash
npm install @jayoncode/form-intelligence @jayoncode/form-intelligence-ajv ajv
```

```ts
import { createForm } from "@jayoncode/form-intelligence";
import { ajvAdapter } from "@jayoncode/form-intelligence-ajv";

const signupSchema = {
  type: "object",
  properties: {
    email: { type: "string", minLength: 1 },
    password: { type: "string", minLength: 8 },
  },
  required: ["email", "password"],
} as const;

const form = createForm({
  initialValues: { email: "", password: "" },
  schema: ajvAdapter(signupSchema),
  onSubmit,
});
```

Pass a pre-compiled `ValidateFunction` when reusing a configured `Ajv` instance or async keywords.

---

## Vue — `@jayoncode/form-intelligence-vue`

**Status: SHIPPED** (controller contract aligned with React).

```bash
npm install @jayoncode/form-intelligence @jayoncode/form-intelligence-vue vue
```

```vue
<script setup lang="ts">
import { useForm } from "@jayoncode/form-intelligence-vue";
import { ui } from "@jayoncode/form-intelligence/ui";

const form = useForm({
  plugins: [ui()],
  schema: { email: "email", password: "password" },
  onSubmit,
});
</script>

<template>
  <form v-bind="form.form()">
    <input v-bind="form.field('email')" />
    <span v-if="form.fieldController('email').ui.showError">{{ form.state.errors.email }}</span>
    <button v-bind="form.submit()">Login</button>
  </form>
</template>
```

Use `provideForm()` in a parent and `useField('path')` in children for deep trees (`useField` exposes `setAriaIds` / `aria` / `controller`). Prefer `form.submit()` — it already disables from `form.ui.canSubmit`.

---

## Angular — `@jayoncode/form-intelligence-angular`

**Status: SHIPPED** (controller contract + `fiField` projection attrs aligned with React).

```bash
npm install @jayoncode/form-intelligence @jayoncode/form-intelligence-angular
```

```typescript
import { Component } from "@angular/core";
import {
  FormIntelligentFieldDirective,
  FormIntelligentFormDirective,
  injectForm,
  provideFormIntelligent,
} from "@jayoncode/form-intelligence-angular";
import { ui } from "@jayoncode/form-intelligence/ui";

@Component({
  standalone: true,
  imports: [FormIntelligentFormDirective, FormIntelligentFieldDirective],
  providers: [
    provideFormIntelligent({
      plugins: [ui()],
      schema: { email: "email" },
      onSubmit,
    }),
  ],
  template: `
    <form fiForm>
      <input fiField="email" />
      @if (form.fieldController("email").ui.showError) {
        <span>{{ form.state().errors.email }}</span>
      }
      <button type="submit" [disabled]="form.submit().disabled">Login</button>
    </form>
  `,
})
export class LoginComponent {
  readonly form = injectForm();
}
```

`fiField` keeps `name`, `aria-invalid`, `data-fi-status`, and related aria attrs in sync. Prefer `form.submit().disabled` (or host bindings from `submit()`) over `isSubmitting` alone.

---

## Planned adapters

| Package                | What it adds                              |
| ---------------------- | ----------------------------------------- |
| RHF / TanStack bridges | Coexist with field registration libraries |

---

## Problem → approach

| Layer                           | Responsibility                                                  |
| ------------------------------- | --------------------------------------------------------------- |
| React Hook Form / TanStack Form | Field registration, controlled inputs                           |
| **Form Intelligence**           | Validation, submit lifecycle, DOM enhancement, autosave, wizard |
| Your components                 | Normal markup — `name` attributes or adapter spread props       |

---

## Schema adapter contract matrix

Error keys use Form Intelligence **dot paths** (`address.city`, `friends.0.name`). Form-level issues use `_form`.

| Package                                | Contract harness | Nested / array paths                                      | Async                      | Status      |
| -------------------------------------- | ---------------- | --------------------------------------------------------- | -------------------------- | ----------- |
| Core `SchemaAdapter`                   | Unit             | Nested sole-path regression                               | Sync + async               | **SHIPPED** |
| `@jayoncode/form-intelligence-zod`     | Yes              | Dot paths from Zod issue path                             | `refine` async             | **SHIPPED** |
| `@jayoncode/form-intelligence-yup`     | Yes              | Bracket indexes normalized (`friends[0]` → `friends.0`)   | `.test` async              | **SHIPPED** |
| `@jayoncode/form-intelligence-valibot` | Yes              | `getDotPath()`                                            | `pipeAsync` / `checkAsync` | **SHIPPED** |
| `@jayoncode/form-intelligence-ajv`     | Yes              | `instancePath` + `required`/`additionalProperties` params | Compiled / `$async` fn     | **SHIPPED** |

Bridge any library:

```ts
import type { SchemaAdapter } from "@jayoncode/form-intelligence/adapters";

const adapter: SchemaAdapter = {
  name: "custom",
  validate: async (values) => {
    return {}; // { fieldPath: "error message" }
  },
};
```

Core also exports `PersistenceAdapter`, `FrameworkAdapter`, `SubmitTransportAdapter`, and `createFormController` — see `@jayoncode/form-intelligence/adapters`.

**Next:** [Plugins](/packages/form-intelligence/modules/plugins) — lifecycle hooks · [Patterns](/packages/form-intelligence/modules/patterns)

**Done with the guides?** Browse the [API Reference](/packages/form-intelligence/api/) or explore [all playground routes](/playground/form-intelligence/).
