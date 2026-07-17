# Object Diff Playground

Learn the API by **doing** — the home route is an **Interactive Object Diff Laboratory**, not a demo page.

[Open playground →](/playground/object-diff/)

## Object Diff Lab (`/`)

Multi-panel engineering workspace:

| Panel            | Role                                                                                  |
| ---------------- | ------------------------------------------------------------------------------------- |
| Toolbar          | Undo/redo, swap, import/export, copy result/patch/code, share URL, benchmark, theme   |
| Left config      | Snapshots A/B, templates, diff/patch/merge/formatter/performance options, experiments |
| Center workspace | Raw JSON, tree, side-by-side, patch, merge, visual flow, formatter preview            |
| Right inspector  | Diff metadata, patch ops, statistics, performance + history, generated code           |
| Bottom console   | Chronological engine logs (filterable by docking)                                     |

Everything updates live — no page refresh.

## Match docs to playground

| Docs guide                                                 | Playground route                                                      | What to try                         |
| ---------------------------------------------------------- | --------------------------------------------------------------------- | ----------------------------------- |
| [Tutorial](/packages/object-diff/modules/getting-started)  | [/](/playground/object-diff/)                                         | Lab templates + generated code      |
| [Concepts](/packages/object-diff/modules/concepts)         | [/](/playground/object-diff/)                                         | Snapshot A/B + tree view            |
| [Diffing](/packages/object-diff/modules/diff)              | [/](/playground/object-diff/) + [/diff](/playground/object-diff/diff) | Moves, identity key, ignore/include |
| [Patching](/packages/object-diff/modules/patch)            | Lab Patch tab + [/patch](/playground/object-diff/patch)               | Apply / revert / optimize           |
| [Merge](/packages/object-diff/modules/merge)               | Lab Merge options                                                     | Three-way conflicts                 |
| [Serialization](/packages/object-diff/modules/serialize)   | Lab Formatter                                                         | JSON / markdown / table / human     |
| [Performance](/packages/object-diff/modules/performance)   | Lab experiments + [/performance](/playground/object-diff/performance) | 100 → 10k objects                   |
| [Integrations](/packages/object-diff/modules/integrations) | [/examples](/playground/object-diff/examples)                         | Consumer snippets                   |

## Experiments

From the left panel: 100 / 1k / 10k objects, large arrays, nested trees, circular refs, array reorder + identity matching, merge conflicts, broken JSON, stress test.

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
