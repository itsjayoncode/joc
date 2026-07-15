# Core concepts

Terminology and architecture for `@jayoncode/form-intelligent`.

**Previous:** [Overview](/packages/form-intelligent/) · **Next:** [Tutorial](/packages/form-intelligent/modules/getting-started)

## Problem → approach

| Without a form orchestration layer                                             | With Form Intelligent                               |
| ------------------------------------------------------------------------------ | --------------------------------------------------- |
| Validation, submit guards, and autosave spread across `useEffect` and handlers | One `createForm()` instance owns the workflow       |
| Field state duplicated between UI and store                                    | `getFormState()` is the single source of truth      |
| Framework-specific hooks lock you to one renderer                              | `field().bind()` is headless; adapters are optional |
| Double-submit and in-flight race conditions handled ad hoc                     | `submit()` + `isSubmitting` built in                |

## Form instance

`createForm(options)` returns one instance per logical form:

| State        | Access                                                   |
| ------------ | -------------------------------------------------------- |
| Values       | `getFormState().values`                                  |
| Field errors | `getFormState().errors`                                  |
| Meta flags   | `touched`, `dirty`, `visited`, `isValid`, `isSubmitting` |
| Updates      | `subscribe(listener)`                                    |

## API map

| Concept   | Responsibility           | API                          |
| --------- | ------------------------ | ---------------------------- |
| Field     | Path in the value tree   | `form.field("email")`        |
| Binding   | Headless input contract  | `field().bind()`             |
| Validator | `true` or error message  | `validators: { path: [fn] }` |
| Submit    | Async handler when valid | `onSubmit`                   |
| Workflow  | Autosave, draft, wizard  | `workflow: { … }`            |

## Field meta flags

| Flag      | Set when         | Typical use          |
| --------- | ---------------- | -------------------- |
| `touched` | Blur after focus | Defer error display  |
| `dirty`   | Value ≠ initial  | Unsaved indicator    |
| `visited` | Focus received   | Analytics, help text |

## Next steps

| Goal                    | Guide                                                          |
| ----------------------- | -------------------------------------------------------------- |
| Integration walkthrough | [Tutorial](/packages/form-intelligent/modules/getting-started) |
| Validation              | [Validation](/packages/form-intelligent/modules/validation)    |
| Submit lifecycle        | [Submission](/packages/form-intelligent/modules/submission)    |
| Autosave / wizard       | [Workflow](/packages/form-intelligent/modules/workflow)        |

Inspect live state: [State explorer](/playground/form-intelligent/state)
