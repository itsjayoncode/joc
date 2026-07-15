# Troubleshooting

Common issues and fixes when integrating Browser Lifecycle.

## ConfigurationError on apply

**Symptom:** Applying configuration throws `ConfigurationError`.

**Cause:** Passing resolved configuration (for example output from a running session) into `mergeBrowserLifecycleConfig()`.

**Fix:** Use input-shaped configuration objects. Validate in the [Configuration Playground](http://127.0.0.1:4273/configuration).

## Events never fire

**Symptom:** Subscriptions exist but no events arrive.

**Checks:**

1. Confirm the session is `running`
2. Confirm the module is enabled in configuration
3. Confirm the browser capability exists
4. Inspect delivery in the [Event Explorer](http://127.0.0.1:4273/events)

## Memory leaks after route changes

**Symptom:** Listener counts grow over time.

**Fix:** Unsubscribe and call `dispose()` in framework cleanup hooks.

## Cross-tab leader flaps

**Symptom:** Tabs rapidly switch between primary and secondary.

**Checks:**

1. Open the [Cross Tab Playground](http://127.0.0.1:4273/cross-tab)
2. Ensure only one session per tab
3. Avoid custom leader logic competing with the module

## Plugin hook failures

**Symptom:** Plugin stops responding.

**Fix:** Listen for `plugin:error` and inspect `getPluginHookLog()`.

## Still stuck?

- [FAQ](/faq/)
- [Debugging Best Practices](/best-practices/debugging)
- [GitHub Issues](https://github.com/JayOnCode/joc/issues)
