# Browser Lifecycle Playground

Learn the API by **doing** — every module has a live demo with explanations and inspectors.

[Open playground →](/playground/browser-lifecycle/)

## Match docs to playground

Follow the [learning path](/packages/browser-lifecycle/) in docs, then try each topic live:

| Docs guide                                                                     | Playground route                                              | What to try                    |
| ------------------------------------------------------------------------------ | ------------------------------------------------------------- | ------------------------------ |
| [Tutorial](/packages/browser-lifecycle/modules/getting-started)                | [/](/playground/browser-lifecycle/)                           | Create session, quick validate |
| [Concepts](/packages/browser-lifecycle/modules/concepts)                       | [/state](/playground/browser-lifecycle/state)                 | Live snapshot JSON             |
| [Visibility](/packages/browser-lifecycle/modules/visibility)                   | [/visibility](/playground/browser-lifecycle/visibility)       | Switch tabs                    |
| [Events](/packages/browser-lifecycle/modules/events)                           | [/events](/playground/browser-lifecycle/events)               | Event feed                     |
| [Session core](/packages/browser-lifecycle/modules/session-core)               | [/lifecycle](/playground/browser-lifecycle/lifecycle)         | Lifecycle phases               |
| [Core infrastructure](/packages/browser-lifecycle/modules/core-infrastructure) | [/configuration](/playground/browser-lifecycle/configuration) | Config options                 |
| Plugins                                                                        | [/plugins](/playground/browser-lifecycle/plugins)             | Plugin hooks                   |
| Cross-tab                                                                      | [/cross-tab](/playground/browser-lifecycle/cross-tab)         | Multi-tab sync                 |
| Performance                                                                    | [/performance](/playground/browser-lifecycle/performance)     | Benchmarks                     |

## How each page works

1. **Read** the explanation panel at the top
2. **Interact** with the demo controls
3. **Inspect** state, events, or diagnostics in the side panel

## Run locally

```bash
pnpm browser-session-playground:dev
```

Open [http://127.0.0.1:4273](http://127.0.0.1:4273).

## Foundation architecture

The playground separates shell UI from Browser Lifecycle runtime state. See the original foundation notes below for folder layout and technology choices.

---

# Playground Foundation

## Purpose

The Browser Session Playground is the long-lived engineering shell for Browser Lifecycle.

It is not a one-off demo. It is the workspace where future module pages will be developed, validated, and documented.

## Architecture

The foundation separates responsibilities across:

- `app/`: bootstrap and provider composition
- `layouts/`: shell structure
- `pages/`: route screens
- `components/`: reusable UI pieces
- `providers/` and `contexts/`: theme and shell state
- `routes/`: route organization
- `services/`: persistence helpers
- `lib/`: Browser Lifecycle integration boundary
- `constants/`, `types/`, `utils/`: static models and helpers

This keeps application UI concerns separate from Browser Lifecycle runtime concerns.

## Technology Choices

- React
- TypeScript
- Vite
- React Router
- Vitest
- CSS Modules

[Back to package overview →](/packages/browser-lifecycle/)
