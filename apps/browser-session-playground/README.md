# Browser Lifecycle Playground

Interactive playground for [`@jayoncode/browser-lifecycle`](https://www.npmjs.com/package/@jayoncode/browser-lifecycle).

**Observe browser state. Derive session intelligence. React with confidence.**

The home route (`/`) is the **Lifecycle Sandbox** — configure the runtime, observe live browser state, simulate transitions, inspect events/capabilities, and copy generated API code.

> One session. One snapshot. One event stream.  
> Session intelligence and DX factories are opt-in — this playground focuses on the core Observe layer; package factories (`createTimelineApi`, etc.) are available in the library even when not wired into every sandbox panel.

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
- `src/sandbox/` — sandbox UI and capability registry
- Docs deep-link: `/playground/browser-lifecycle/`
