---
title: Playground
description: Object Diff playground documentation for Playground.
playground: /playground/object-diff/
---

# Object Diff Playground

Learn the API by **doing** — the home route is an **Interactive Object Diff Laboratory**, not a demo page.

[Open playground →](/playground/object-diff/)

## Object Diff Lab (`/`)

Multi-panel engineering workspace:

| Panel            | Role                                                                                  |
| ---------------- | ------------------------------------------------------------------------------------- |
| Toolbar          | Undo/redo, swap, import/export, copy result/patch/code, share URL, benchmark, theme   |
| Left config      | Snapshots A/B, templates, diff/patch/merge/formatter/performance options, experiments |
| Center workspace | Raw JSON, tree, side-by-side, **moves**, patch, merge, **explain**, visual, formatter |
| Right inspector  | Diff metadata, patch ops, statistics, **explain**, performance + dirty check, code    |
| Bottom console   | Chronological engine logs (filterable by docking)                                     |

Everything updates live — no page refresh.

### Phase 4 surfaces

| Tab / panel        | What it shows                                                                  |
| ------------------ | ------------------------------------------------------------------------------ |
| **Moves**          | Before/after list lanes (root arrays) + `from → path` move arrows              |
| **Merge**          | Three-way value + structured conflict cards (`reason`, `identity`, left/right) |
| **Explain**        | `createDiffView(result).explain()` human text + structured JSON                |
| **Patch**          | Ops + apply / revert previews                                                  |
| **Perf inspector** | `hasChanges` timing vs full `diff`, dirty flag, benchmark history              |

**UI only:** move arrows / lanes are playground visualization — not a public core timeline API.

## Match docs to playground

| Docs guide                                                 | Playground route                                                         | What to try                                          |
| ---------------------------------------------------------- | ------------------------------------------------------------------------ | ---------------------------------------------------- |
| [Tutorial](/packages/object-diff/modules/getting-started)  | [/](/playground/object-diff/)                                            | Lab templates + generated code                       |
| [Concepts](/packages/object-diff/modules/concepts)         | [/](/playground/object-diff/)                                            | Snapshot A/B + tree view                             |
| [Diffing](/packages/object-diff/modules/diff)              | Lab **Moves** tab + [/diff](/playground/object-diff/diff)                | Detect moves, identity key, Array Reorder experiment |
| [DX / DiffView](/packages/object-diff/modules/dx)          | Lab **Explain** tab                                                      | Human + structured `explain()`                       |
| [Patching](/packages/object-diff/modules/patch)            | Lab Patch tab + [/patch](/playground/object-diff/patch)                  | Apply / revert / optimize                            |
| [Merge](/packages/object-diff/modules/merge)               | Lab Merge tab + Merge Conflicts experiment                               | Conflict cards + identity-aware merge                |
| [Serialization](/packages/object-diff/modules/serialize)   | Lab Formatter                                                            | JSON / markdown / table / human                      |
| [Performance](/packages/object-diff/modules/performance)   | Lab Perf inspector + [/performance](/playground/object-diff/performance) | `hasChanges` vs `diff` timings                       |
| [Integrations](/packages/object-diff/modules/integrations) | [/examples](/playground/object-diff/examples)                            | Consumer snippets                                    |

## Experiments

From the left panel: 100 / 1k / 10k objects, large arrays, nested trees, circular refs, **array reorder** (opens Moves + Explain), identity matching, **merge conflicts**, broken JSON, stress test.

## Run locally

```bash
pnpm object-diff-playground:dev
```

Open [http://127.0.0.1:4275](http://127.0.0.1:4275).

## All routes

| Route          | Focus                         |
| -------------- | ----------------------------- |
| `/`            | **Object Diff Lab** (primary) |
| `/dashboard`   | Package overview              |
| `/diff`        | Diff explorer                 |
| `/patch`       | Patch explorer                |
| `/json`        | JSON viewer                   |
| `/performance` | Benchmark presets             |
| `/examples`    | Usage snippets                |

[Back to package overview →](/packages/object-diff/)
