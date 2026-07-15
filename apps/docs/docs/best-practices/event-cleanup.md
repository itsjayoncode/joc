# Event Cleanup

## Recommended

Prefer named event subscriptions that return unsubscribe functions.

Use the [Event Explorer](http://127.0.0.1:4273/events) to confirm listeners are removed after cleanup.

## Common mistake

Subscribing inside render without storing the unsubscribe handle.

## Related

- [Memory Management](/best-practices/memory-management)
- [FAQ — Events](/faq/events)
