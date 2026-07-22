# Performance

Typed deep comparison costs scale with visited nodes. Prefer `hasChanges` for dirty checks.

**Previous:** [Integrations](/packages/object-diff/modules/integrations) · **Back to:** [Overview](/packages/object-diff/overview)

## Quick guidance

| Need                   | Prefer                              |
| ---------------------- | ----------------------------------- |
| Dirty flag only        | `hasChanges(a, b)`                  |
| Full change list       | `diff(a, b)`                        |
| Ignore noisy paths     | `{ ignore: [...] }` on both         |
| Identity-stable arrays | `{ identityKey }` on `diff` / dirty |

## Complexity

| Operation                             | Class          | Notes                                                        |
| ------------------------------------- | -------------- | ------------------------------------------------------------ |
| `compare` / `hasChanges` (no filters) | O(N)           | Single walk; early exit on first mismatch                    |
| `hasChanges` + ignore/include         | O(N′)          | Visits allowed paths only; no DiffResult allocation          |
| `hasChanges` + `identityKey`          | O(N)           | Same early-exit walk (identity map); no full `diff` fallback |
| `hasChanges` + `detectMoves`          | O(N)           | Early-exits on the first move or value change                |
| `diff`                                | O(N)           | Allocates change records                                     |
| Identity array match                  | O(n)           | Map by key                                                   |
| `applyPatch`                          | O(ops × depth) | Path resolve per op                                          |
| `merge`                               | O(N)           | Union of object keys; arrays optional identity map           |
| `detectMoves` (arrays)                | O(n·m)         | LCS over array elements, then greedy pairing of leftovers    |
| `detectMoves` (object keys)           | O(R·A)         | LCS / equality coalesce of removed↔added after the walk      |

## Allocation

- `hasChanges` does **not** build a `changes` array (including with `identityKey` / `detectMoves` / path filters).
- No unbounded memo caches keyed on arbitrary objects.
- Path segments allocate per descent (tradeoff vs correctness / simplicity).
- Array LCS allocates an `(n+1)×(m+1)` DP table for that array — prefer `identityKey` for large identity-stable lists when you only need content diffs.

## Benchmarks (CI)

Vitest budgets live in `tests/performance/performance-budget.test.ts`.

Bundle gates: `node scripts/check-object-diff-bundle.mjs` (locked in `engineering/bundle-budget.json` when `--write`).

When auditing forms, prefer `hasChanges` / plugin submit audits over full `diff` on every keystroke — see [FI composition recipe](/packages/form-intelligence/modules/patterns#composition-dirty-audit--patch-object-diff).

## Bundle policy

Root keeps patch + serialize for compatibility. Prefer `/core` when you only need compare/diff. Optional engines (`/merge`, `/query`, `/stats`, `/plugins`, `/view`) must not be pulled by a root-only import. Bundle gate: `pnpm object-diff:bundle`.
