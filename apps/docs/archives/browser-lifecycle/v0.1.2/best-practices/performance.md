# Performance

## Recommended

- Disable unused modules in configuration
- Avoid high-frequency work inside event listeners
- Use `getRuntimeDiagnostics()` during development

## Not recommended

Subscribing to the full event feed in production unless you need diagnostics.

## Playground

Benchmark observer overhead in the [Performance Playground](/playground/browser-lifecycle/performance).
