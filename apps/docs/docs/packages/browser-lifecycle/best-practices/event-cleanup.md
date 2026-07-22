# Event Cleanup

## Recommended

Prefer named event subscriptions that return unsubscribe functions.

Use the [Event Explorer](/playground/browser-lifecycle/events) to confirm listeners are removed after cleanup.

## Common mistake

Subscribing inside render without storing the unsubscribe handle — or creating a session without ever calling `dispose()`.

Prefer **one shared session** and tear it down with `lifecycle.dispose()` on route/app unmount (unsubscribes alone are not enough if the session still owns browser listeners).

## Related

- [Memory Management](/packages/browser-lifecycle/best-practices/memory-management)
- [FAQ — Lifecycle](/packages/browser-lifecycle/faq/lifecycle)
- [FAQ — Events](/packages/browser-lifecycle/faq/events)
- [Tutorial](/packages/browser-lifecycle/modules/getting-started)
