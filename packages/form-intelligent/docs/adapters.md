# Adapters

Use Form Intelligent with your existing UI stack — today with headless HTML, tomorrow with framework packages.

**Previous:** [Plugins](/packages/form-intelligent/modules/plugins) · **Back to:** [Overview](/packages/form-intelligent/)

::: tip Playground
[Adapters explorer →](/playground/form-intelligent/adapters) — current integrations and planned bridges.
:::

## Overview

Adapters connect `createForm()` to framework-specific field registration or schema tooling. The core package remains headless; adapters ship as optional integration layers.

---

## Headless HTML (built-in)

Works in any environment. No extra package:

```ts
const binding = form.field("email").bind();

<input
  name={binding.name}
  value={binding.value}
  onChange={(e) => binding.onChange(e.target.value)}
  onBlur={binding.onBlur}
/>
```

---

## Coming soon

| Package                             | What it adds                                    |
| ----------------------------------- | ----------------------------------------------- |
| `@jayoncode/form-intelligent-react` | `useFormField()` hook                           |
| `@jayoncode/form-intelligent-zod`   | Zod schema → validators                         |
| Vue / Angular / Svelte              | Framework-native composables                    |
| RHF / TanStack bridges              | Keep field registration; delegate workflow here |

---

## Problem → approach

| Layer                           | Responsibility                                                                     |
| ------------------------------- | ---------------------------------------------------------------------------------- |
| React Hook Form / TanStack Form | Field registration, controlled inputs, local field state                           |
| Form Intelligent                | Workflow orchestration — validation timing, submit lifecycle, autosave, multi-step |
| Your components                 | Render UI; wire `bind()` or framework hooks to either stack                        |

Use **both** when you want framework field ergonomics **and** centralized workflow orchestration — not one package trying to own everything.

---

## Schema adapter (advanced)

Bridge any validation library via `SchemaAdapter`:

```ts
const adapter: SchemaAdapter = {
  validate: async (values) => {
    // return { fieldPath: "error message" }
    return {};
  },
};
```

**Done with the guides?** Browse the [API Reference](/packages/form-intelligent/api/) or explore [all playground routes](/playground/form-intelligent/).
