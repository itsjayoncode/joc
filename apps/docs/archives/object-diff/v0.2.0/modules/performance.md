---
title: Performance
description: Object Diff documentation for Performance.
---

# Performance

Typed deep comparison costs scale with visited nodes. Prefer `hasChanges` for dirty checks.

**Previous:** [Integrations](/packages/object-diff/modules/integrations) · **Back to:** [Overview](/packages/object-diff/overview)

## Quick guidance

| Need                   | Prefer                                                      |
| ---------------------- | ----------------------------------------------------------- |
| Dirty flag only        | `hasChanges(a, b)`                                          |
| Full change list       | `diff(a, b)`                                                |
| Ignore noisy paths     | `{ ignore: [...] }` on both                                 |
| Identity-stable arrays | `{ identityKey }` (uses full collect path for `hasChanges`) |

## Complexity

| Operation                             | Class          | Notes                                               |
| ------------------------------------- | -------------- | --------------------------------------------------- |
| `compare` / `hasChanges` (no filters) | O(N)           | Single walk; early exit on first mismatch           |
| `hasChanges` + ignore/include         | O(N′)          | Visits allowed paths only; no DiffResult allocation |
| `hasChanges` + `identityKey`          | O(N)           | Falls back to `diff` collection for correctness     |
| `diff`                                | O(N)           | Allocates change records                            |
| Identity array match                  | O(n)           | Map by key                                          |
| `applyPatch`                          | O(ops × depth) | Path resolve per op                                 |
| `merge`                               | O(N)           | Union of object keys                                |
| LCS moves                             | —              | Not implemented (`detectMoves` throws)              |

## Allocation

- `hasChanges` without `identityKey` does **not** build a `changes` array.
- No unbounded memo caches keyed on arbitrary objects.
- Path segments allocate per descent (tradeoff vs correctness / simplicity).

## Benchmarks (CI)

Vitest budgets live in `tests/performance/performance-budget.test.ts`.

Bundle gates: `node scripts/check-object-diff-bundle.mjs` (locked in `engineering/bundle-budget.json` when `--write`).

## Bundle policy

Core includes patch + serialize today (compatibility). Optional engines (`/merge`, `/query`, `/stats`, `/plugins`) must not be pulled by a root-only import. See construction `BUNDLE_SIZE.md` + ADR for locked byte budgets.
