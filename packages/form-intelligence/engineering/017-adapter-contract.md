# Adapter compatibility contract

**Status:** Active  
**Date:** 2026-07-20  
**Packages:** `@jayoncode/form-intelligence-{react,vue,angular}`  
**Related:** [016-maturity-backlog](./016-maturity-backlog.md), [docs/adapters.md](../docs/adapters.md)

## Goal

Every framework adapter implements the **same product contract**. Framework APIs may differ (`Ref` vs `Signal` vs `useSyncExternalStore`), but the **capabilities** below must be reachable without digging into undocumented internals.

## Contract surface

| Area              | Required capability                                                         | Reference (React)                     |
| ----------------- | --------------------------------------------------------------------------- | ------------------------------------- |
| **Lifecycle**     | Create once; destroy on unmount / scope dispose                             | `useForm` + `destroy()`               |
| **State**         | Reactive `form.state` (+ optional selector helper)                          | `state`, `useFormState`               |
| **Form bind**     | Attach host `<form>` + `noValidate`                                         | `form.form()` / `fiForm`              |
| **Field bind**    | `name` + projection `aria-invalid` / `data-fi-status` (+ optional aria ids) | `form.field(path)`                    |
| **Submit UX**     | Button props from `form.ui.canSubmit` (+ `aria-busy` while submitting)      | `form.submit()` / `submitButton()`    |
| **Controllers**   | Thin façade + per-field controller                                          | `controller`, `fieldController(path)` |
| **Focus**         | Focus first invalid after failed submit                                     | `focusFirstInvalid()`                 |
| **UI plugin**     | Docs prefer `plugins: [ui()]` for policy parity with DOM                    | `ui()` from `/ui`                     |
| **Error display** | Examples gate messages with `showError`, not raw errors alone               | `field.ui.showError`                  |

### Explicitly out of scope for `field()`

Controlled `value` / `onChange` props. Values are owned by the DOM enhancer when `form.ref` / `fiForm` is used, or by `fieldController(path).bind()` for headless inputs.

## Status (2026-07)

| Capability                                             | React   | Vue                              | Angular                                       |
| ------------------------------------------------------ | ------- | -------------------------------- | --------------------------------------------- |
| Lifecycle + state                                      | Done    | Done                             | Done                                          |
| `field()` projection attrs                             | Done    | Done                             | Done (handle); **`fiField` directive synced** |
| `submit()` / `canSubmit`                               | Done    | Done                             | Done                                          |
| `controller` / `fieldController` / `focusFirstInvalid` | Done    | **Done**                         | **Done**                                      |
| `useField` aria depth                                  | N/A     | **Done** (`setAriaIds` / `aria`) | N/A                                           |
| Docs: `ui()` + `showError`                             | Partial | Updated                          | Updated                                       |

## Verification

- Unit / browser tests per adapter package
- Playground Adapters page (React) remains the interactive reference
