# Form Intelligence — Vue

[![npm version](https://img.shields.io/npm/v/@jayoncode/form-intelligence-vue.svg)](https://www.npmjs.com/package/@jayoncode/form-intelligence-vue)

Vue adapter for [`@jayoncode/form-intelligence`](https://www.npmjs.com/package/@jayoncode/form-intelligence).

## The problem

A multi-field Vue form often grows a forest of `watch` / `computed` sync for show/hide, errors, and drafts — plus prop-drilling the form into every child. Template rules and script rules drift apart.

## The solution

`useForm`, `provideForm`, and `useField` bridge Form Intelligence to Vue reactivity. Nested fields inject the form; rules, autosave, and submit stay in the engine.

`form.field(path)` does **not** spread controlled `value` / `onChange`. It spreads `name` + `aria-*` + `data-fi-status` — the same contract as React and Angular. The DOM enhancer attached via `form.form()`'s `ref` owns values and change events for native inputs. For headless / design-system inputs, use `form.fieldController(path).bind()` (or the object `useField(path)` returns) instead.

## What you get

| API                                     | Purpose                                                                                                                                                                                                |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `useForm(config)`                       | Create form + reactive `form.state` (ref); same core options as `createForm`. Config is only read once, when the composable runs — later reactive prop changes are **not** re-applied to the instance. |
| `provideForm(config)`                   | Same as `useForm`, plus `provide()` for descendants                                                                                                                                                    |
| `useProvidedForm()`                     | `inject()` the form provided by an ancestor `provideForm()`; throws if none is found                                                                                                                   |
| `useField(path, form?)`                 | Field bindings (`name` + `aria-*` + `data-fi-status`) plus `controller`, `aria`, `bind()`, `setAriaIds()`. Uses `useProvidedForm()` when `form` is omitted.                                            |
| `form.form()`                           | `{ ref, noValidate: true }` for `v-bind` on `<form>` — the DOM enhancer (via `ref`) owns submit                                                                                                        |
| `form.field(path)`                      | `{ name, aria-invalid, aria-required?, aria-describedby?, data-fi-status }` for `v-bind` on inputs                                                                                                     |
| `form.fieldController(path)`            | Full `FieldController` — `bind()` (`{ name, value, onChange, onBlur, onFocus }`), `aria`, `setAriaIds`, `ui`                                                                                           |
| `form.controller`                       | Full `FormController` façade over the same instance                                                                                                                                                    |
| `form.submit()` / `form.submitButton()` | `{ type: "submit", disabled?, "aria-busy"? }` for `v-bind`, derived from `form.instance.ui.canSubmit`                                                                                                  |
| `form.focusFirstInvalid()`              | Focus the first invalid field after a failed submit (SSR-safe)                                                                                                                                         |
| `form.state`                            | Ref of values, errors, flags (`isValid`, `isSubmitting`, …) — auto-unwrap in templates                                                                                                                 |
| `form.instance`                         | Underlying Form Intelligence instance                                                                                                                                                                  |
| `useFormState(form.instance, selector)` | `ComputedRef` for a state slice, without recomputing on every keystroke outside that slice                                                                                                             |

Core features available via config: schema/validators, `validateOn`, `when()` rules, calculations, formatters, autosave, drafts, wizard, plugins, async validation. Prefer passing `plugins: [ui()]` (from `@jayoncode/form-intelligence/ui`) so `field()`'s output stays aligned with your own UI policies.

## Install

```bash
npm install @jayoncode/form-intelligence @jayoncode/form-intelligence-vue
```

## Usage

```vue
<script setup lang="ts">
import { useForm } from "@jayoncode/form-intelligence-vue";
import { when } from "@jayoncode/form-intelligence";
import { ui } from "@jayoncode/form-intelligence/ui";

const form = useForm({
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
  async onSubmit(values) {
    await api.checkout(values);
  },
});
</script>

<template>
  <form v-bind="form.form()">
    <select v-bind="form.field('plan')">
      <option value="starter">Starter</option>
      <option value="enterprise">Enterprise</option>
    </select>
    <input v-bind="form.field('email')" />
    <span v-if="form.fieldController('email').ui.showError">{{ form.state.errors.email }}</span>
    <input v-bind="form.field('seatCount')" type="number" />
    <button v-bind="form.submit()">Continue</button>
  </form>
</template>
```

### Nested fields

```vue
<script setup lang="ts">
import { provideForm } from "@jayoncode/form-intelligence-vue";

const form = provideForm({ schema: { email: "email" }, onSubmit });
</script>

<template>
  <form v-bind="form.form()">
    <EmailField />
    <button v-bind="form.submit()">Submit</button>
  </form>
</template>
```

```vue
<script setup lang="ts">
import { useField } from "@jayoncode/form-intelligence-vue";

const email = useField("email");
</script>

<template>
  <input v-bind="email" />
</template>
```

`useField` resolves the ancestor form via `useProvidedForm()` when no `form` argument is passed — call it inside a descendant of `provideForm()`, or pass an explicit `form` (e.g. one returned by `useForm()`).

### Headless inputs — `fieldController(path).bind()`

```vue
<script setup lang="ts">
const email = form.fieldController("email");
</script>

<template>
  <MyTextInput v-bind="email.bind()" v-bind="email.aria.attributes" />
</template>
```

### Selective re-renders

```ts
import { useFormState } from "@jayoncode/form-intelligence-vue";

const emailError = useFormState(form.instance, (s) => s.errors.email);
```

In `<script>`, use `form.state.value` when you need the unwrapped snapshot.

## Docs

- Core capabilities: https://itsjayoncode.github.io/joc/packages/form-intelligence/modules/capabilities
- Adapters: https://itsjayoncode.github.io/joc/packages/form-intelligence/modules/adapters

## License

MIT © [JayOnCode](https://github.com/itsjayoncode)
