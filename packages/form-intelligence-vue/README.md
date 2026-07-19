# Form Intelligence — Vue

[![npm version](https://img.shields.io/npm/v/@jayoncode/form-intelligence-vue.svg)](https://www.npmjs.com/package/@jayoncode/form-intelligence-vue)

Vue adapter for [`@jayoncode/form-intelligence`](https://www.npmjs.com/package/@jayoncode/form-intelligence).

## The problem

A multi-field Vue form often grows a forest of `watch` / `computed` sync for show/hide, errors, and drafts — plus prop-drilling the form into every child. Template rules and script rules drift apart.

## The solution

`useForm`, `provideForm`, and `useField` bridge Form Intelligence to Vue reactivity. Nested fields inject the form; rules, autosave, and submit stay in the engine.

## What you get

| API                                              | Purpose                                                                                |
| ------------------------------------------------ | -------------------------------------------------------------------------------------- |
| `useForm(config)`                                | Create form + reactive `form.state` (ref); same core options as `createForm`           |
| `provideForm(config)`                            | Same as `useForm`, plus provide for descendants                                        |
| `useField(path)`                                 | Injected field bindings + `controller` / `setAriaIds` / `aria`                         |
| `form.form()` / `form.field()` / `form.submit()` | Object spreads for `v-bind`                                                            |
| `form.controller` / `fieldController`            | Same controller contract as React                                                      |
| `form.focusFirstInvalid()`                       | Focus first invalid field after failed submit                                          |
| `form.state`                                     | Ref of values, errors, flags (`isValid`, `isSubmitting`, …) — auto-unwrap in templates |
| `form.instance`                                  | Underlying Form Intelligence instance                                                  |

Core features available via config: schema/validators, `validateOn`, `when()` rules, calculations, formatters, autosave, drafts, wizard, plugins, async validation.

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

In `<script>`, use `form.state.value` when you need the unwrapped snapshot.

## Docs

- Core capabilities: https://itsjayoncode.github.io/joc/packages/form-intelligence/modules/capabilities
- Adapters: https://itsjayoncode.github.io/joc/packages/form-intelligence/modules/adapters

## License

MIT © [JayOnCode](https://github.com/itsjayoncode)
