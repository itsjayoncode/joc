# Configuration FAQ

## Why do configuration changes require a restart?

Configuration is resolved when the session starts. Modules register observers based on the resolved shape.

## Can I pass `getSnapshot()` output back into merge helpers?

No. Use input-shaped configuration objects. Passing resolved configuration can throw `ConfigurationError`.

## Playground

[Configuration Playground](http://127.0.0.1:4273/configuration)

## Related guide

[Configuration](/guides/browser-lifecycle/configuration)
