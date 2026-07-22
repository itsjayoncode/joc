# 011 — DiffView `explain()`

**Status:** Accepted  
**Date:** 2026-07-23  
**Context:** Phase 3 DiffView DX — structured + human explanations without a parallel “review pack” API.

## Decision

- Add `view.explain(options?)` on `createDiffView` only (`/view`).
- Default return: `DiffExplanation[]` (`path`, `type`, `reason`, `confidence`, `summary`, optional values / `from`).
- `explain({ format: "human" })` returns multi-line review text (checkmark blocks).
- Optional `identityKey` string is a **wording hint** when the underlying diff used identity matching — `DiffResult` does not retain options.
- Polish `serialize` markdown / console / human move lines to show `from → path` clearly; do not duplicate `explain()` as a new top-level API.

## Non-goals

- Attaching `explain` onto `diff()` return values
- Inferring `identityKey` from records alone (pass the hint when needed)
- Playground Explain UI (Phase 4)
