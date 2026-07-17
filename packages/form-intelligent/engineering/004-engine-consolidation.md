# 004 — Engine Consolidation Plan

Fold the four Phase B satellite packages back into `@jayoncode/form-intelligent` as domain engines. After this, consumers install **one package** and import optional engines via subpaths.

**Status:** Complete (B′/C consolidated — engines live under `src/engines/` + subpath shims)  
**Depends on:** Phase A complete, Phase B satellites shipped (workspace only)  
**Outcome:** No `dependencies` on `@jayoncode/form-intelligent-*` in core `package.json`

---

## Why consolidate

| Problem (today)                                                | After consolidation                            |
| -------------------------------------------------------------- | ---------------------------------------------- |
| Core `package.json` depends on 4 satellite packages            | Core is self-contained                         |
| `npm install @jayoncode/form-intelligent` pulls all satellites | Optional code only loads when subpath imported |
| Publishing/versioning 5+ form packages                         | One version line for the form engine           |
| Phase B inverted dependency rule                               | Engines are folders inside core                |

---

## Source mapping

| From (satellite)                                                                                               | To (core)                                    | Notes                                           |
| -------------------------------------------------------------------------------------------------------------- | -------------------------------------------- | ----------------------------------------------- |
| `form-intelligent-formatter/src/*`                                                                             | `form-intelligent/src/engines/formatter/`    | Keep `format/index.ts` subpath shim             |
| `form-intelligent-offline/src/*`                                                                               | `form-intelligent/src/engines/offline/`      | Keep `offline/index.ts` shim                    |
| `form-intelligent-analytics/src/*`                                                                             | `form-intelligent/src/engines/analytics/`    | Keep `analytics/index.ts` shim                  |
| `form-intelligent-workflow/src/when.ts`, `evaluate.ts`, `calculations.ts`, `types.ts`, `utils.ts`, `errors.ts` | `form-intelligent/src/engines/workflow/`     | Rules + calculations                            |
| `form-intelligent-workflow/src/draft.ts`                                                                       | Split → `engines/draft/` + `engines/wizard/` | `loadDraft`/`saveDraft` vs `resolveWizardState` |

### Files to delete after merge

```
packages/form-intelligent-formatter/
packages/form-intelligent-offline/
packages/form-intelligent-analytics/
packages/form-intelligent-workflow/
```

Keep `form-intelligent-react/` — it is a framework adapter, not an engine.

---

## Step-by-step checklist

### 1. Create engine folders

```bash
mkdir -p packages/form-intelligent/src/engines/{formatter,offline,analytics,workflow,draft,wizard}
```

### 2. Copy satellite source (preserve git history optional)

For each satellite, move `src/*` into the target engine folder. Prefer `git mv` if consolidating in one PR:

```bash
git mv packages/form-intelligent-formatter/src packages/form-intelligent/src/engines/formatter
git mv packages/form-intelligent-offline/src packages/form-intelligent/src/engines/offline
git mv packages/form-intelligent-analytics/src packages/form-intelligent/src/engines/analytics
# workflow: move files individually, then split draft.ts
```

### 3. Split draft vs wizard

From current `draft.ts`:

| Export                                                   | Target engine     |
| -------------------------------------------------------- | ----------------- |
| `loadDraft`, `saveDraft`, `clearDraft`                   | `engines/draft/`  |
| `resolveWizardState`, `assertStepIndex`, `getStepFields` | `engines/wizard/` |

Add subpath entrypoints:

- `src/draft/index.ts` → re-exports from `engines/draft/`
- `src/wizard/index.ts` → re-exports from `engines/wizard/`

Update `package.json` exports:

```json
"./draft": { "types": "./dist/draft/index.d.ts", "import": "./dist/draft/index.js" },
"./wizard": { "types": "./dist/wizard/index.d.ts", "import": "./dist/wizard/index.js" }
```

### 4. Fix internal imports

Replace across `packages/form-intelligent/`:

```ts
// Before
import { when } from "@jayoncode/form-intelligent-workflow";

// After
import { when } from "../engines/workflow/when.js";
// or from subpath consumer perspective: unchanged public API
```

Key files to update:

- `src/core/create-form.ts`
- `src/index.ts`
- `src/types/index.ts`
- `src/rules/index.ts`
- `src/workflow/index.ts`
- `src/format/index.ts`
- `src/offline/index.ts`
- `src/analytics/index.ts`
- `src/modules/register-configured.ts`

### 5. Remove satellite dependencies

In `packages/form-intelligent/package.json`, delete:

```json
"dependencies": {
  "@jayoncode/form-intelligent-formatter": "workspace:*",
  "@jayoncode/form-intelligent-offline": "workspace:*",
  "@jayoncode/form-intelligent-analytics": "workspace:*",
  "@jayoncode/form-intelligent-workflow": "workspace:*"
}
```

### 6. Update monorepo config

**Root `tsconfig.json`** — remove references:

```json
{ "path": "./packages/form-intelligent-formatter" },
{ "path": "./packages/form-intelligent-offline" },
{ "path": "./packages/form-intelligent-analytics" },
{ "path": "./packages/form-intelligent-workflow" }
```

**`packages/form-intelligent/tsconfig.json`** — remove satellite project references.

**`pnpm-workspace.yaml`** — no change needed if glob is `packages/*`; deleted folders simply disappear.

**`tsconfig.tests.json`** / **vitest** — ensure test paths point to consolidated locations.

### 7. Migrate tests

| Current                             | After                                                              |
| ----------------------------------- | ------------------------------------------------------------------ |
| `form-intelligent-formatter/tests/` | `form-intelligent/tests/unit/format-*.test.ts` (may already exist) |
| `form-intelligent-workflow/tests/`  | `form-intelligent/tests/unit/workflow-*.test.ts`                   |
| Satellite-specific tests            | Merge or relocate under `form-intelligent/tests/`                  |

Run:

```bash
pnpm exec vitest run packages/form-intelligent/tests packages/form-intelligent-react/tests
```

### 8. Update playground and docs

- `apps/form-intelligent-playground` — no import changes if using `@jayoncode/form-intelligent` barrel
- `apps/docs` — update any references to satellite package names
- Satellite READMEs — fold content into `form-intelligent/docs/` or delete

### 9. Delete satellite packages

After tests pass:

```bash
rm -rf packages/form-intelligent-formatter
rm -rf packages/form-intelligent-offline
rm -rf packages/form-intelligent-analytics
rm -rf packages/form-intelligent-workflow
pnpm install
```

### 10. Verify bundle boundary

Smoke-check that core-only import does not pull workflow:

```ts
// scripts/check-bundle-boundary.ts (Phase C)
import { createForm } from "@jayoncode/form-intelligent";
// analyze dist graph — workflow code should not appear without subpath import
```

---

## Backward compatibility

### Public API — no breaks intended

| Import                                                                | Status after merge                                           |
| --------------------------------------------------------------------- | ------------------------------------------------------------ |
| `import { createForm, when } from "@jayoncode/form-intelligent"`      | ✅ unchanged                                                 |
| `import { when } from "@jayoncode/form-intelligent/workflow"`         | ✅ unchanged                                                 |
| `import { applyFormatter } from "@jayoncode/form-intelligent/format"` | ✅ unchanged                                                 |
| `import { when } from "@jayoncode/form-intelligent-workflow"`         | ❌ remove — was never intended as stable public API for apps |

### npm deprecations (if satellites were published)

If any `@jayoncode/form-intelligent-*` satellite was published to npm:

1. Publish final core version with merged code
2. Deprecate satellite packages on npm with message: _"Merged into @jayoncode/form-intelligent. Use subpath imports."_

(As of consolidation planning, satellites are workspace-only.)

---

## Risk register

| Risk                                  | Mitigation                                                       |
| ------------------------------------- | ---------------------------------------------------------------- |
| Missed import after merge             | `grep -r "@jayoncode/form-intelligent-" packages/` before delete |
| Circular deps between engines         | Enforce: `workflow` must not import `create-form`                |
| Draft/wizard split breaks create-form | Run wizard + draft tests from `form-os-features.test.ts`         |
| tsconfig path aliases in tests        | Update vitest/tsconfig aliases if any pointed at satellites      |

---

## Suggested PR breakdown

| PR       | Scope                                                              | Size   |
| -------- | ------------------------------------------------------------------ | ------ |
| **PR 1** | Move formatter + offline into `engines/`, fix imports, tests green | Small  |
| **PR 2** | Move analytics + workflow, split draft/wizard subpaths             | Medium |
| **PR 3** | Delete satellite packages, update tsconfig/docs, bundle baseline   | Small  |

Single PR is also fine if the team prefers one atomic consolidation.

---

## Definition of done

- [x] `packages/form-intelligent/package.json` has no `@jayoncode/form-intelligent-*` dependencies
- [x] Satellite package directories removed from repo
- [x] All form-intelligent + form-intelligent-react tests pass
- [x] Subpath exports include `/draft` and `/wizard`
- [x] `003-modular-packages.md` Phase B′ checklist complete
- [x] `008-folder-architecture.md` updated to `engines/` layout
