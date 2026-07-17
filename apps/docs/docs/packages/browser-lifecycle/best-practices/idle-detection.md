# Idle Detection

## Recommended

Choose idle thresholds based on product risk, not library defaults:

```ts
idle: { enabled: true, thresholdMs: 300_000 }
```

## Not recommended

Using idle detection as a security boundary without re-authentication.

## Playground

[Idle Playground](/playground/browser-lifecycle/idle)
