# Plugin Development

## Recommended

- Keep plugins focused on one responsibility
- Implement `onStop` and `onDestroy` cleanup
- Handle errors without throwing from hooks when possible

## Not recommended

Performing heavy synchronous work inside `onEvent`.

## Playground

[Plugin Playground](http://127.0.0.1:4273/plugins)

## Pattern

[Plugin Architecture](/patterns/plugin-architecture)
