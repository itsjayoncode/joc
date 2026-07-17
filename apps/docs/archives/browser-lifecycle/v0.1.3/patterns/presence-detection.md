# Presence Detection

Distinguish active, idle, hidden, and offline users.

## Signals

| Signal  | Event / snapshot                           |
| ------- | ------------------------------------------ |
| Visible | `page:visible`, `snapshot.page.visibility` |
| Hidden  | `page:hidden`                              |
| Active  | `session:active`                           |
| Idle    | `session:idle`                             |
| Offline | `connection:offline`                       |

## Playground

[State Explorer](/playground/browser-lifecycle/state)
