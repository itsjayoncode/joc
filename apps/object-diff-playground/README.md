# Object Diff Playground

Official engineering shell for `@jayoncode/object-diff`.

The home route (`/`) is the **Interactive Object Diff Laboratory** — a multi-panel workspace for configuring snapshots, diff/patch/merge options, inspecting results, benchmarking, and copying generated API code.

Focused explorers remain available for deep-dives: Diff, Patch, JSON, Performance, Examples.

## Commands

```bash
pnpm --filter @jayoncode/object-diff-playground dev
pnpm --filter @jayoncode/object-diff-playground build
pnpm --filter @jayoncode/object-diff-playground preview
pnpm --filter @jayoncode/object-diff-playground test
```

Dev server: [http://127.0.0.1:4275](http://127.0.0.1:4275)

## Routes

| Route          | Focus                     |
| -------------- | ------------------------- |
| `/`            | Object Diff Lab (primary) |
| `/dashboard`   | Package overview          |
| `/diff`        | Diff explorer             |
| `/patch`       | Patch explorer            |
| `/json`        | JSON viewer               |
| `/performance` | Benchmark presets         |
| `/examples`    | Usage snippets            |

## Architecture

- `src/lib/object-diff.ts` — sole package integration boundary
- `src/sandbox/` — Lab shell (toolbar, config, workspace, inspector, console)
- Package imports only through the lib boundary (except types where needed)

## Documentation

- [docs/playground.md](./docs/playground.md)
- Package overview: `/packages/object-diff/` in the docs site
