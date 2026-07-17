# Error Handling

Browser Lifecycle surfaces failures through typed errors and events.

## Typed errors

| Error                     | When it throws                                    |
| ------------------------- | ------------------------------------------------- |
| `ConfigurationError`      | Invalid or incompatible configuration             |
| `LifecycleError`          | Invalid `start`, `stop`, or `dispose` transitions |
| `InitializationError`     | Module startup failure                            |
| `PluginError`             | Plugin hook failure                               |
| `UnsupportedFeatureError` | Required capability unavailable                   |
| `ModuleRegistryError`     | Internal module registration conflict             |

## Plugin errors

Listen for plugin failures without crashing the session:

```ts
lifecycle.on("plugin:error", (event) => {
  console.error(event.metadata.pluginId, event.metadata.error);
});
```

## Listener errors

Typed event infrastructure isolates listener failures. Use the [Event Explorer](http://127.0.0.1:4273/events) to confirm delivery order when debugging.

## Production recommendations

- Log configuration validation failures before creating a session
- Treat `dispose()` as mandatory cleanup
- Surface plugin errors to observability tooling
- Avoid swallowing `LifecycleError` without fixing the transition sequence

## Related documentation

- [Troubleshooting](/packages/browser-lifecycle/troubleshooting/)
- [FAQ — Debugging](/packages/browser-lifecycle/faq/debugging)
