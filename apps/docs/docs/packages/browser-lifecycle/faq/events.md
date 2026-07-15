# Events FAQ

## How do I subscribe to events?

```ts
const unsubscribe = lifecycle.on("page:visible", (event) => {
  console.log(event.metadata);
});
```

## How do I inspect all events?

Use `lifecycle.onEvent()` for the full feed or open the [Event Explorer](http://127.0.0.1:4273/events).

## Related documentation

- [Events Module](/packages/browser-lifecycle/modules/events)
- [Event Cleanup Best Practices](/packages/browser-lifecycle/best-practices/event-cleanup)
