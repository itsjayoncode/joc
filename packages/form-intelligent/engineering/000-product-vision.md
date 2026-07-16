# Form Intelligent — Product Vision

`@jayoncode/form-intelligent` is a **native form intelligence engine** for the JOC ecosystem.

## Mission

**Keep your HTML. Make your forms smarter.**

Developers own the UI — `<form>`, `<input>`, `<select>`, `<textarea>`, `<button>`. The package owns behavior: validation, formatting, dirty/touched state, async checks, submission workflow, autosave, drafts, and integration with Browser Lifecycle (offline, visibility, etc.).

Same philosophy as `@jayoncode/browser-lifecycle`:

| Browser Lifecycle                                                  | Form Intelligent                                              |
| ------------------------------------------------------------------ | ------------------------------------------------------------- |
| Does not create pages                                              | Does not create forms                                         |
| Observes browser events                                            | Observes and enhances native form controls                    |
| Developer does not wire `window.addEventListener` for every signal | Developer does not wire `onChange` / `onBlur` for every field |

## What we do **not** do

- Generate HTML for the developer
- Ship `<JocInput />`, `<FormField />`, or other UI components
- Compete with component libraries (MUI, Chakra, etc.)
- Require `register()` / `bind()` for the default adoption path

## Target developer experience (v1 requirement)

Developer writes ordinary markup:

```html
<form id="register">
  <input name="email" />
  <input name="password" type="password" />
  <button type="submit">Register</button>
</form>
```

Developer attaches the engine:

```ts
const form = createForm({
  target: "#register",
  schema: {
    email: "email",
    password: "password",
  },
  async onSubmit(values) {
    await api.register(values);
  },
});
```

The engine:

1. Resolves the native `<form>` (alias: `form` option — same as `target`)
2. Discovers named controls inside the form
3. Attaches listeners (input, blur, submit) — developer does not
4. Runs the validation pipeline (built-in → custom → async)
5. Surfaces errors on controls (convention TBD: `aria-invalid`, message slot)
6. Tracks dirty / touched / submitting / double-submit guard
7. Calls `onSubmit` when valid

In React, `<input name="email" />` is enough — no spread props from a registration API.

## Schema model

Two layers:

1. **Built-in rules** — shorthand strings and flags: `email`, `password`, `required`, `url`, etc.
2. **Custom rules** — business logic the library cannot know (username exists, credit limits, cross-field match)

Shorthand:

```ts
schema: {
  email: "email",
  password: "password",
}
```

Rich field config:

```ts
schema: {
  username: {
    type: "text",
    validate: {
      required: true,
      custom: async ({ value }) => {
        if (await api.userExists(value)) return "Username already exists.";
        return true;
      },
    },
  },
  confirmPassword: {
    validators: [
      ({ value, form }) => value === form.get("password") || "Passwords do not match.",
    ],
  },
}
```

### Validation pipeline (engine-owned order)

On change / blur / submit (per `validateOn` policy):

1. Required
2. Type / built-in rules
3. Formatting (normalize stored value)
4. Custom sync validators
5. Async validators (debounce, cancel in-flight, loading state)
6. Block submit until valid

Developers write domain rules; the engine owns timing, cancellation, error display, and submit gating.

### Reusable validator packs (later)

```ts
const companyRules = createValidationPack({ tin: ..., sss: ..., philHealth: ... });
form.use(companyRules);
```

Organization-wide rules installed once per app.

## Ecosystem packages

Structured like `@jayoncode/browser-lifecycle`:

| Package                               | Purpose                               |
| ------------------------------------- | ------------------------------------- |
| `@jayoncode/form-intelligent`         | Framework-independent engine          |
| `@jayoncode/form-intelligent-react`   | React hooks and bindings (`useForm`)  |
| `@jayoncode/form-intelligent-vue`     | Vue composables (planned)             |
| `@jayoncode/form-intelligent-angular` | Angular services/directives (planned) |

See [Ecosystem architecture](./001-ecosystem-architecture.md) for dependency rules and adoption paths.

## Architecture layers

| Layer                  | Responsibility                                                                                             | Status                 |
| ---------------------- | ---------------------------------------------------------------------------------------------------------- | ---------------------- |
| **Core engine**        | Values, errors, validation pipeline, submit, workflow (autosave, draft, wizard), plugins                   | Implemented (headless) |
| **DOM enhancer**       | `target` / `ref` resolution, field discovery, listener attachment, error presentation, submit interception | Implemented            |
| **Schema compiler**    | String shorthand → validators; field config → pipeline                                                     | Implemented            |
| **Framework adapters** | `@jayoncode/form-intelligent-react` (`useForm`)                                                            | React adapter shipped  |
| **Rules engine**       | `when()` conditional logic, `fieldUi`, business rules                                                      | Shipped (foundation)   |

Current public API (`initialValues` + `validators` + `field().bind()`) is the **headless core** — useful for playgrounds, tests, and manual wiring. The **primary adoption path** is native form enhancement via `target` + `schema`.

## Positioning vs React Hook Form

|              | React Hook Form                          | Form Intelligent                                |
| ------------ | ---------------------------------------- | ----------------------------------------------- |
| Field wiring | `{...register("email")}`                 | `name="email"` on native control                |
| Scope        | Field registration + validation in React | Workflow + validation + native form enhancement |
| Framework    | React-first                              | Framework-agnostic (HTML first)                 |

Can be used **together**: RHF for field registration in React-heavy apps; Form Intelligent for workflow orchestration — or Form Intelligent alone when markup is plain HTML or `name` attributes suffice.

## Marketing line

**Keep your HTML. Make your forms smarter.**

**One sentence:** `@jayoncode/form-intelligent` is a headless form workflow engine that manages everything that happens before, during, and after form submission — validation is one feature; the real value is centralizing the entire lifecycle of complex forms while developers keep complete control over UI.

See [Form OS capabilities](./002-form-os-capabilities.md) for the full 25-feature roadmap with SHIPPED / PARTIAL / PLANNED status.
