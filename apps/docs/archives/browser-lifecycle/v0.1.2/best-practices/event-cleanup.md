# Event Cleanup

## Recommended

Prefer named event subscriptions that return unsubscribe functions.

Use the [Event Explorer](/playground/browser-lifecycle/events) to confirm listeners are removed after cleanup.

## Common mistake

Subscribing inside render without storing the unsubscribe handle.

## Related

- [Memory Management](/packages/browser-lifecycle/best-practices/memory-management)
- [FAQ — Events](/packages/browser-lifecycle/faq/events)
