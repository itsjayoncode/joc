# @jayoncode/form-intelligent-vue

Vue adapter for [`@jayoncode/form-intelligent`](../form-intelligent/README.md).

## Install

```bash
npm install @jayoncode/form-intelligent @jayoncode/form-intelligent-vue
```

## Usage

```vue
<script setup lang="ts">
import { useForm } from "@jayoncode/form-intelligent-vue";

const form = useForm({
  schema: {
    email: "email",
    password: "password",
  },
  async onSubmit(values) {
    await api.login(values);
  },
});
</script>

<template>
  <form v-bind="form.form()">
    <input v-bind="form.field('email')" />
    <span v-if="form.state.errors.email">{{ form.state.errors.email }}</span>
    <input v-bind="form.field('password')" type="password" />
    <button v-bind="form.submit()" :disabled="!form.state.isValid">Login</button>
  </form>
</template>
```

`form.state` is a ref — auto-unwrapped in templates; use `form.state.value` in `<script>`.

## Provide / inject

```vue
<script setup lang="ts">
import { provideForm } from "@jayoncode/form-intelligent-vue";

const form = provideForm({
  schema: { email: "email" },
  onSubmit,
});
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
import { useField } from "@jayoncode/form-intelligent-vue";

const email = useField("email");
</script>

<template>
  <input v-bind="email" />
</template>
```
