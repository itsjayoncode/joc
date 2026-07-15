# Object Diff Playground

Learn the API by **doing** — compare objects, generate patches, and run benchmarks interactively.

[Open playground →](/playground/object-diff/)

## Match docs to playground

Follow the [learning path](/packages/object-diff/) in docs, then try each topic live:

| Docs guide                                                | Playground route                                    | What to try             |
| --------------------------------------------------------- | --------------------------------------------------- | ----------------------- |
| [Tutorial](/packages/object-diff/modules/getting-started) | [/](/playground/object-diff/)                       | Dashboard + sample diff |
| [Concepts](/packages/object-diff/modules/concepts)        | [/diff](/playground/object-diff/diff)               | Edit before/after JSON  |
| [Diffing](/packages/object-diff/modules/diff)             | [/diff](/playground/object-diff/diff)               | Inspect change records  |
| [Patching](/packages/object-diff/modules/patch)           | [/patch](/playground/object-diff/patch)             | Generate & apply ops    |
| [Serialization](/packages/object-diff/modules/serialize)  | [/json](/playground/object-diff/json)               | Export formats          |
| Performance                                               | [/performance](/playground/object-diff/performance) | Large object benchmarks |
| Snippets                                                  | [/examples](/playground/object-diff/examples)       | Copy-paste code         |

## How each page works

1. **Read** the explanation at the top
2. **Edit** the before/after objects or patch JSON
3. **Inspect** the output panel for changes, ops, or timing

## Run locally

```bash
pnpm object-diff-playground:dev
```

Open [http://127.0.0.1:4275](http://127.0.0.1:4275).

## All routes

| Route          | Focus                  |
| -------------- | ---------------------- |
| `/`            | Dashboard & quick diff |
| `/diff`        | Diff explorer          |
| `/patch`       | Patch explorer         |
| `/json`        | JSON viewer            |
| `/performance` | Benchmarks             |
| `/examples`    | Usage snippets         |

[Back to package overview →](/packages/object-diff/)
