# Form Intelligence — Ecosystem Architecture

Form Intelligence follows the same packaging model as **Browser Lifecycle**: one framework-agnostic engine, optional adapters per UI stack.

## Package family

| Package                                   | Role                                                                              | Status                                 |
| ----------------------------------------- | --------------------------------------------------------------------------------- | -------------------------------------- |
| `@jayoncode/form-intelligence`            | Core engine — `createForm`, schema, DOM enhancer, validation, submit, module host | **Shipped**                            |
| `@jayoncode/form-intelligence/validation` | Subpath — validators + pipeline                                                   | **Shipped** (subpath)                  |
| `@jayoncode/form-intelligence/rules`      | Subpath — `when()`, rule evaluation                                               | **Shipped** (subpath)                  |
| `@jayoncode/form-intelligence/format`     | Subpath — formatters + presets                                                    | **Shipped** (subpath)                  |
| `@jayoncode/form-intelligence/offline`    | Subpath — offline queue module                                                    | **Shipped** (subpath)                  |
| `@jayoncode/form-intelligence/analytics`  | Subpath — analytics module                                                        | **Shipped** (subpath)                  |
| `@jayoncode/form-intelligence-react`      | React — `useForm()`, `form.form()`, `form.field()`, `form.submit()`               | **Shipped**                            |
| `@jayoncode/form-intelligence-zod`        | Zod — `zodAdapter()` schema bridge                                                | **Shipped**                            |
| `@jayoncode/form-intelligence-yup`        | Yup — `yupAdapter()` schema bridge                                                | **Shipped**                            |
| `@jayoncode/form-intelligence-valibot`    | Valibot — `valibotAdapter()` schema bridge                                        | **Shipped**                            |
| `@jayoncode/form-intelligence-ajv`        | AJV — `ajvAdapter()` JSON Schema bridge                                           | **Shipped**                            |
| `@jayoncode/form-intelligence-vue`        | Vue — composables (`useForm`, `provideForm`, `useField`)                          | **PARTIAL** (aria/controllers pending) |
| `@jayoncode/form-intelligence-angular`    | Angular — `FormService`, signals, `fiForm` / `fiField` directives                 | **PARTIAL** (aria/controllers pending) |

Schema bridges (Zod, Yup, Valibot, AJV) ship as satellite packages. **DevTools** is an optional **subpath** of core (`@jayoncode/form-intelligence/devtools`) — not a separate npm package.

## Dependency rules

```
@jayoncode/form-intelligence          (no framework deps)
        ↑
        ├── @jayoncode/form-intelligence-react   (peer: react >= 18)
        ├── @jayoncode/form-intelligence-vue     (peer: vue >= 3)
        └── @jayoncode/form-intelligence-angular (peer: @angular/core >= 17)
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

| Browser Lifecycle                                | Form Intelligence                                                  |
| ------------------------------------------------ | ------------------------------------------------------------------ |
| `@jayoncode/browser-lifecycle`                   | `@jayoncode/form-intelligence`                                     |
| Framework-agnostic session modules               | Framework-agnostic form engine                                     |
| `createBrowserLifecycle({ … })` enhances runtime | `createForm({ target, schema })` enhances forms                    |
| Playground per concern                           | Form Intelligence playground (`apps/form-intelligence-playground`) |
| Optional future React/Vue helpers                | `form-intelligent-react` (shipped), Vue/Angular planned            |

## Playground integration process

The official playground (`apps/form-intelligence-playground`) demonstrates every adoption path:

| Concern          | Location                                                                  |
| ---------------- | ------------------------------------------------------------------------- |
| Package imports  | `src/lib/form-intelligence.ts` only                                       |
| Sample instances | `createSampleForm()` in lib                                               |
| Version display  | `vite.config.ts` → `define` → `app-metadata.ts`                           |
| Explorer routes  | `src/pages/*` + `src/constants/navigation.ts`                             |
| Docs sync        | `apps/form-intelligence-playground/docs` → docs site via `pnpm docs:sync` |

Dev command: `pnpm form-intelligence-playground:dev` (port `4277`).

## Naming

The npm scope is **`@jayoncode/form-intelligence`** with adapter suffixes (`-react`, `-vue`, `-angular`). Product name: **Form Intelligence**.

Do not use the legacy `form-intelligence` folder or package names — they were consolidated into `form-intelligent`.
