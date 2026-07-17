# Engines & entrypoints

Optional engines live on tree-shakeable subpaths. Root keeps compatibility re-exports for core helpers.

**Previous:** [Serialization](/packages/object-diff/modules/serialize) · **Next:** [Merge](/packages/object-diff/modules/merge)

## Subpath map

| Import                             | Exports                                                                         | Notes                     |
| ---------------------------------- | ------------------------------------------------------------------------------- | ------------------------- |
| `@jayoncode/object-diff`           | `diff`, `compare`, `hasChanges`, filters, `patch`, `applyPatch`, `serialize`, … | Compatibility entry       |
| `@jayoncode/object-diff/core`      | `diff`, `compare`, `hasChanges`, filters                                        | Slim — no patch/serialize |
| `@jayoncode/object-diff/patch`     | `patch`, `applyPatch`, validate, optimize, …                                    | Patch domain              |
| `@jayoncode/object-diff/formatter` | `serialize`, `createSerializer`                                                 | Formats + plugins         |
| `@jayoncode/object-diff/merge`     | `merge`                                                                         | Two-/three-way merge      |
| `@jayoncode/object-diff/query`     | `find`, `filter`, `exclude`, `query`, …                                         | DiffResult helpers        |
| `@jayoncode/object-diff/stats`     | `statistics`                                                                    | Rich metrics              |
| `@jayoncode/object-diff/plugins`   | `createEngine`                                                                  | Opt-in plugin host        |
| `@jayoncode/object-diff/view`      | `createDiffView`                                                                | Fluent wrapper            |

## When to use which

| Goal                                 | Prefer                 |
| ------------------------------------ | ---------------------- |
| Dirty check only                     | `/core` + `hasChanges` |
| Sync ops over the wire               | `/patch`               |
| Collaborative drafts                 | `/merge`               |
| Filter an existing diff              | `/query`               |
| Telemetry / dashboards               | `/stats`               |
| Custom matchers / formatters / hooks | `/plugins`             |
| Fluent chaining                      | `/view`                |

Root import of merge/query/stats/plugins is **not** supported — use the subpath.

## Guides

| Engine                | Guide                                                      |
| --------------------- | ---------------------------------------------------------- |
| Merge                 | [Merge](/packages/object-diff/modules/merge)               |
| Query                 | [Query](/packages/object-diff/modules/query)               |
| Fluent DX             | [DX](/packages/object-diff/modules/dx)                     |
| Integrations          | [Integrations](/packages/object-diff/modules/integrations) |
| Performance / budgets | [Performance](/packages/object-diff/modules/performance)   |
