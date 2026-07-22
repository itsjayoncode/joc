# Presence Detection

Understand whether **this browser session** is currently available, away, idle, hidden, or offline — page-local signals, not multi-user presence.

## Signals

| Signal  | Event / snapshot                      |
| ------- | ------------------------------------- |
| Visible | `page:visible`, `snapshot.visibility` |
| Hidden  | `page:hidden`                         |
| Active  | `session:active`                      |
| Idle    | `session:idle`                        |
| Offline | `connection:offline` (advisory)       |

For the higher-level page-local facade, see [`createPresenceApi`](/packages/browser-lifecycle/modules/presence).

## Playground

[State Explorer](/playground/browser-lifecycle/state)
