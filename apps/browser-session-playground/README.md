# Browser Session Playground

Official engineering shell for `@jayoncode/browser-lifecycle`.

The home route (`/`) is the **Interactive Browser Lifecycle Developer Sandbox** — a multi-panel laboratory for configuring the runtime, observing live browser state, simulating transitions, inspecting events/capabilities, and copying generated API code.

Focused explorers remain available for deep-dives (Visibility, Focus, Connectivity, Idle, Lifecycle, Cross Tab, Plugins, Events, State, Configuration, Performance, Developer Tools).

## Commands

```bash
pnpm --filter @jayoncode/browser-session-playground dev
pnpm --filter @jayoncode/browser-session-playground build
pnpm --filter @jayoncode/browser-session-playground preview
pnpm --filter @jayoncode/browser-session-playground test
```

Dev server: [http://127.0.0.1:4273](http://127.0.0.1:4273)

## Routes

| Route                              | Focus                       |
| ---------------------------------- | --------------------------- |
| `/`                                | Lifecycle Sandbox (primary) |
| `/dashboard`                       | Package overview            |
| `/visibility` … `/developer-tools` | Focused explorers           |

## Architecture

- `src/lib/` — package integration boundary
- `src/sandbox/` — Lab shell (toolbar, config, canvas, inspector, console)
- Future modules register via `src/sandbox/capabilities.ts`

## Documentation

- [docs/playground.md](./docs/playground.md)
- Package overview: `/packages/browser-lifecycle/` in the docs site
