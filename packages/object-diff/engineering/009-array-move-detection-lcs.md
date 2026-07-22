# 009 — Array move detection (LCS)

**Status:** Accepted  
**Date:** 2026-07-23  
**Context:** Phase 1 Compare quality — `detectMoves` for arrays and object-key reshapes.

## Decision

Use **longest common subsequence (LCS)** of equal elements to keep a stable subsequence in place, then **greedily pair** remaining equal leftovers as `moved`. Object-key remove+add coalescing uses the same LCS/greedy helpers after the walk.

When `identityKey` is set with `detectMoves`, match by identity first and emit `moved` when the index changes; unpaired items without ids fall back to the LCS path.

## Why not Myers / pure greedy?

| Option                     | Pros                                                             | Cons                                                                |
| -------------------------- | ---------------------------------------------------------------- | ------------------------------------------------------------------- |
| Greedy remove↔add only     | Simple                                                           | Poor reorder quality when many equal values / crossed moves         |
| Myers / edit script        | Optimal edit distance                                            | Heavier code and harder to map onto our `moved` + nested walk model |
| **LCS + greedy leftovers** | Clear “what stayed”, intuitive list reorders, fits existing walk | O(n·m) DP table per array                                           |

LCS matches the product story: drag-and-drop / repeater reorders should surface as moves, not index-by-index churn.

## Complexity budget

- Per array with `detectMoves`: O(n·m) time and space for the DP table.
- Prefer `identityKey` for large identity-stable lists when content diffs matter more than positional moves.
- `hasChanges` uses the same walk and early-exits on the first move or allowed value change — no full `DiffResult` allocation.

## Consequences

- Index-only walks (no `detectMoves`) still emit positional `changed` / add / remove.
- `identityKey` alone still treats pure reorders of equal items as unchanged (position is not semantic).
- Docs: `docs/diff.md` (`detectMoves`, `ignore` `.**`), `docs/performance.md`.
