# Composition: Form + Lifecycle (+ Diff)

Reference wiring for **composition without coupling**:

- `@jayoncode/form-intelligence` owns the form
- `@jayoncode/browser-lifecycle` owns session signals
- `@jayoncode/object-diff` answers “is it dirty?” before persisting on hide

No shared JOC runtime. The app owns teardown (`dispose` / `destroy`).

## Run

```bash
pnpm install
pnpm --filter @jayoncode/example-composition-form-lifecycle start
```

## Docs

- [Composition guide](https://itsjayoncode.github.io/joc/guides/composition)
- [Form Intelligence patterns](https://itsjayoncode.github.io/joc/packages/form-intelligence/modules/patterns)
