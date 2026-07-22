# Events FAQ

## How do I subscribe to events?

```ts
const unsubscribe = lifecycle.on("page:visible", (event) => {
  console.log(event.metadata);
});
```

## How do I inspect all events?

Use `lifecycle.subscribe()` for the full feed or open the [Event Explorer](/playground/browser-lifecycle/events).

## Related documentation

- [Events Module](/packages/browser-lifecycle/modules/events)
- [Event Cleanup Best Practices](/packages/browser-lifecycle/best-practices/event-cleanup)
