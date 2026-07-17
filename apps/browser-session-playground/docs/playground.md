# Browser Lifecycle Playground

Learn the API by **doing** — the home route is an **Interactive Browser Lifecycle Developer Sandbox**, not a demo page.

[Open playground →](/playground/browser-lifecycle/)

## Lifecycle Sandbox (`/`)

Multi-panel engineering workspace:

| Panel            | Role                                                                        |
| ---------------- | --------------------------------------------------------------------------- |
| Toolbar          | Start/stop, reset, import/export, copy code, diagnostics, theme, share URL  |
| Left config      | Runtime, modules, idle, cross-tab, plugins, diagnostics, browser simulation |
| Center dashboard | Live state cards, timeline, overview, snapshot JSON                         |
| Right inspector  | Runtime, events, snapshot diff, performance, capabilities, generated code   |
| Bottom console   | Chronological engine logs (pause / clear / filter by docking)               |

Everything updates live from a real `createBrowserLifecycle` session — no fake data unless you use mock simulation.

## Match docs to playground

| Docs guide                                                               | Playground route                                                               | What to try                    |
| ------------------------------------------------------------------------ | ------------------------------------------------------------------------------ | ------------------------------ |
| [Tutorial](/packages/browser-lifecycle/modules/getting-started)          | [/](/playground/browser-lifecycle/)                                            | Sandbox start + generated code |
| [Concepts](/packages/browser-lifecycle/modules/concepts)                 | Lab Snapshot / [/state](/playground/browser-lifecycle/state)                   | Live snapshot JSON             |
| [Visibility](/packages/browser-lifecycle/modules/visibility)             | Lab + [/visibility](/playground/browser-lifecycle/visibility)                  | Hide/show tab                  |
| [Events](/packages/browser-lifecycle/modules/events)                     | Lab Events tab / [/events](/playground/browser-lifecycle/events)               | Event feed                     |
| [Session core](/packages/browser-lifecycle/modules/session-core)         | [/lifecycle](/playground/browser-lifecycle/lifecycle)                          | Lifecycle phases               |
| [Configuration](/packages/browser-lifecycle/modules/core-infrastructure) | Lab left panel / [/configuration](/playground/browser-lifecycle/configuration) | Idle + cross-tab               |
| Plugins                                                                  | Lab Plugins / [/plugins](/playground/browser-lifecycle/plugins)                | Logger plugin                  |
| Cross-tab                                                                | Lab Cross Tab / [/cross-tab](/playground/browser-lifecycle/cross-tab)          | Primary election               |
| Performance                                                              | Lab Perf / [/performance](/playground/browser-lifecycle/performance)           | Diagnostics                    |

## Browser simulation

Use left-panel simulation buttons (Hide/Show, Focus/Blur, Offline/Online, Freeze/Resume). When native APIs are read-only, enable **Mock simulation mode** for educational overlays.

## Run locally

```bash
pnpm browser-session-playground:dev
```

Open [http://127.0.0.1:4273](http://127.0.0.1:4273).

## Routes

| Route                              | Focus                           |
| ---------------------------------- | ------------------------------- |
| `/`                                | **Lifecycle Sandbox** (primary) |
| `/dashboard`                       | Package overview                |
| `/visibility` … `/developer-tools` | Focused explorers               |

[Back to package overview →](/packages/browser-lifecycle/)
