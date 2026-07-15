# Performance

## Recommended

- Disable unused modules in configuration
- Avoid high-frequency work inside event listeners
- Use `getRuntimeDiagnostics()` during development

## Not recommended

Subscribing to the full event feed in production unless you need diagnostics.

## Playground

Benchmark observer overhead in the [Performance Playground](http://127.0.0.1:4273/performance).
