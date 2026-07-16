# Form Intelligent — Ecosystem Architecture

Form Intelligent follows the same packaging model as **Browser Lifecycle**: one framework-agnostic engine, optional adapters per UI stack.

## Package family

| Package                                  | Role                                                                              | Status                |
| ---------------------------------------- | --------------------------------------------------------------------------------- | --------------------- |
| `@jayoncode/form-intelligent`            | Core engine — `createForm`, schema, DOM enhancer, validation, submit, module host | **Shipped**           |
| `@jayoncode/form-intelligent/validation` | Subpath — validators + pipeline                                                   | **Shipped** (subpath) |
| `@jayoncode/form-intelligent/rules`      | Subpath — `when()`, rule evaluation                                               | **Shipped** (subpath) |
| `@jayoncode/form-intelligent/format`     | Subpath — formatters + presets                                                    | **Shipped** (subpath) |
| `@jayoncode/form-intelligent/offline`    | Subpath — offline queue module                                                    | **Shipped** (subpath) |
| `@jayoncode/form-intelligent/analytics`  | Subpath — analytics module                                                        | **Shipped** (subpath) |
| `@jayoncode/form-intelligent-react`      | React — `useForm()`, `form.form()`, `form.field()`, `form.submit()`               | **Shipped**           |
| `@jayoncode/form-intelligent-zod`        | Zod — `zodAdapter()` schema bridge                                                | **Shipped**           |
| `@jayoncode/form-intelligent-yup`        | Yup — `yupAdapter()` schema bridge                                                | **Shipped**           |
| `@jayoncode/form-intelligent-valibot`    | Valibot — `valibotAdapter()` schema bridge                                        | **Shipped**           |
| `@jayoncode/form-intelligent-ajv`        | AJV — `ajvAdapter()` JSON Schema bridge                                           | **Shipped**           |
| `@jayoncode/form-intelligent-vue`        | Vue — composables (`useForm`, `provideForm`, `useField`)                          | **Shipped**           |
| `@jayoncode/form-intelligent-angular`    | Angular — `FormService`, signals, `fiForm` / `fiField` directives                 | **Shipped**           |

Schema bridges (Zod, Yup, Valibot, AJV) and devtools ship as separate optional packages — same pattern as Browser Lifecycle plugins.

## Dependency rules

```
@jayoncode/form-intelligent          (no framework deps)
        ↑
        ├── @jayoncode/form-intelligent-react   (peer: react >= 18)
        ├── @jayoncode/form-intelligent-vue     (peer: vue >= 3)
        └── @jayoncode/form-intelligent-angular (peer: @angular/core >= 17)
```

- **Core stays portable** — no React/Vue/Angular imports in `form-intelligent`.
- **Adapters are thin** — lifecycle wiring, binding helpers, re-render subscriptions.
- **Behavior lives in core** — validation order, submit guards, DOM enhancement, autosave, wizard.

## Adoption paths

### 1. Native HTML (primary — like Browser Lifecycle)

Point at existing markup. The engine discovers fields by `name`, applies schema validators, wires events, and enhances submit UX — no manual `onChange` / `onBlur` handlers.

```ts
createForm({
  target: "#login",
  schema: {
    email: { required: true, email: true },
    password: { required: true, minLength: 8 },
  },
  async onSubmit(values) {
    await api.login(values);
  },
});
```

```html
<form id="login">
  <input name="email" />
  <input name="password" type="password" />
  <button type="submit">Login</button>
</form>
```

In React, attach lazily with `form.ref`:

```tsx
const form = useForm({ schema: { email: "email" }, onSubmit });
return <form ref={form.ref}>…</form>;
```

### 2. React (idiomatic)

```tsx
const form = useForm({
  schema: { email: "email", password: "password" },
  onSubmit,
});

return (
  <form {...form.form()}>
    <input {...form.field("email")} />
    <input {...form.field("password")} type="password" />
    <button {...form.submit()}>Login</button>
  </form>
);
```

`useForm` owns instance lifecycle (StrictMode-safe). The core engine owns validation, submit, and loading state.

### 3. Headless / custom UI

```ts
createForm({ initialValues, validators, onSubmit });
form.field("email").bind(); // manual wiring
```

## Parity with Browser Lifecycle

| Browser Lifecycle                                | Form Intelligent                                                 |
| ------------------------------------------------ | ---------------------------------------------------------------- |
| `@jayoncode/browser-lifecycle`                   | `@jayoncode/form-intelligent`                                    |
| Framework-agnostic session modules               | Framework-agnostic form engine                                   |
| `createBrowserLifecycle({ … })` enhances runtime | `createForm({ target, schema })` enhances forms                  |
| Playground per concern                           | Form Intelligent playground (`apps/form-intelligent-playground`) |
| Optional future React/Vue helpers                | `form-intelligent-react` (shipped), Vue/Angular planned          |

## Playground integration process

The official playground (`apps/form-intelligent-playground`) demonstrates every adoption path:

| Concern          | Location                                                                 |
| ---------------- | ------------------------------------------------------------------------ |
| Package imports  | `src/lib/form-intelligent.ts` only                                       |
| Sample instances | `createSampleForm()` in lib                                              |
| Version display  | `vite.config.ts` → `define` → `app-metadata.ts`                          |
| Explorer routes  | `src/pages/*` + `src/constants/navigation.ts`                            |
| Docs sync        | `apps/form-intelligent-playground/docs` → docs site via `pnpm docs:sync` |

Dev command: `pnpm form-intelligent-playground:dev` (port `4277`).

## Naming

The npm scope is **`@jayoncode/form-intelligent`** with adapter suffixes (`-react`, `-vue`, `-angular`). Product name: **Form Intelligent**.

Do not use the legacy `form-intelligence` folder or package names — they were consolidated into `form-intelligent`.
