# 010 — Identity-aware merge

**Status:** Accepted  
**Date:** 2026-07-23  
**Context:** Phase 2 Merge — align `/merge` with `diff` `identityKey` strength.

## Decision

- Add optional `identityKey` to `MergeOptions` (same `IdentityKey` type as `diff`).
- When set, arrays merge **by identity**, not as atomic leaves.
- Enrich `MergeConflict` with required `reason` (`both-changed` | `delete-edit` | `both-added`) and optional `identity`.
- Result order: **right’s order** for ids present on right, then surviving left-only ids (left order). Three-way delete-vs-edit uses `reason: "delete-edit"`; strategy still decides the kept value (`undefined` from latest-wins on a delete omits the item).

## Non-goals (this phase)

- Full order/OT merge of arbitrary list permutations
- CRDT semantics
- Automatic `explain()` text (Phase 3 DiffView)

## Shared helper

`resolveIdentity` lives in `src/utils/identity.ts` and is shared with array walk / diff.

## Bundle budget

Identity-aware array merge grows `/merge` past the prior 20 KB minified gate (~20.3 KB measured). Raise `./merge` minified budget to **22 KB** in `scripts/check-object-diff-bundle.mjs` (gzip unchanged at 7 KB).
