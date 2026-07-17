# Plugin Development

## Recommended

- Keep plugins focused on one responsibility
- Implement `onStop` and `onDestroy` cleanup
- Handle errors without throwing from hooks when possible

## Not recommended

Performing heavy synchronous work inside `onEvent`.

## Playground

[Plugin Playground](/playground/browser-lifecycle/plugins)

## Pattern

[Plugin Architecture](/packages/browser-lifecycle/patterns/plugin-architecture)
