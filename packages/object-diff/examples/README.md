# Examples

Runnable sketches for common Object Diff integrations. Build the package first, then:

```bash
pnpm exec tsx packages/object-diff/examples/basic-diff.ts
pnpm exec tsx packages/object-diff/examples/form-dirty-audit.ts
pnpm exec tsx packages/object-diff/examples/session-snapshot.ts
pnpm exec tsx packages/object-diff/examples/audit-events.ts
pnpm exec tsx packages/object-diff/examples/merge-collaboration.ts
pnpm exec tsx packages/object-diff/examples/engine-plugins.ts
pnpm exec tsx packages/object-diff/examples/create-diff-view.ts
```

Typecheck:

```bash
pnpm exec tsc -p packages/object-diff/tsconfig.examples.json
```

| File                     | Scenario                     |
| ------------------------ | ---------------------------- |
| `basic-diff.ts`          | Diff + patch round-trip      |
| `form-dirty-audit.ts`    | Dirty check + markdown audit |
| `session-snapshot.ts`    | Session snapshot compare     |
| `audit-events.ts`        | Change records → events      |
| `merge-collaboration.ts` | Three-way `/merge`           |
| `engine-plugins.ts`      | Optional `createEngine`      |
| `create-diff-view.ts`    | Fluent `/view` wrapper       |

See [Integrations](../docs/integrations.md) and [DX](../docs/dx.md).
