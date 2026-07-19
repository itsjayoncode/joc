# Idle Detection

## Recommended

Choose idle timeouts based on product risk, not library defaults (`idleTimeout` defaults to **off**):

```ts
createBrowserLifecycle({
  idleTimeout: 300_000, // 5 minutes
});
```

## Not recommended

Using idle detection as a security boundary without re-authentication.

## Playground

[Idle Playground](/playground/browser-lifecycle/idle)

## Related

- [Idle module](/packages/browser-lifecycle/modules/idle)
- [Configuration](/packages/browser-lifecycle/guides/configuration)
