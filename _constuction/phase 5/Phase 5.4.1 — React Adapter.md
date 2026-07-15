# JOC ENGINEERING TASK
# Phase 5.4.1 — React Adapter
# Package: @jayoncode/form-intelligent-react

===============================================================================
OBJECTIVE
===============================================================================

First framework adapter — highest priority for ecosystem adoption.

===============================================================================
OUTPUT
===============================================================================

```
packages/form-intelligent-react/
  src/
    useForm.ts
    FormProvider.tsx
    useField.ts
    useFormState.ts
```

===============================================================================
API
===============================================================================

```tsx
const form = useForm({ ...FormConfig });
<FormProvider form={form}>
  <input {...form.field('email').bind()} />
</FormProvider>
```

===============================================================================
REQUIREMENTS
===============================================================================

- Peer: `react >= 18`, `@jayoncode/form-intelligent`
- Fine-grained re-renders via `form.use(selector)`
- StrictMode safe
- SSR compatible

===============================================================================
TESTS
===============================================================================

@testing-library/react integration tests.

===============================================================================
STOP CONDITION
===============================================================================

STOP after React adapter ships.
