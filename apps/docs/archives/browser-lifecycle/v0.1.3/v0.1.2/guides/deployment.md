# Deployment

Browser Lifecycle ships as a tree-shakeable ESM package with no side effects.

## Build output

Applications should bundle Browser Lifecycle with their existing toolchain (Vite, Webpack, esbuild, Rollup). No special loader is required.

## Runtime checklist

- Initialize one session per browser tab or embedded surface
- Dispose sessions when routes or components unmount
- Gate initialization behind `isBrowser()` in SSR apps
- Disable unused modules to reduce observer overhead

## Observability

Use `getRuntimeDiagnostics()` and the [Developer Tools Playground](http://127.0.0.1:4273/developer-tools) during development to inspect listener counts and event throughput.

## Versioning

Pin `@jayoncode/browser-lifecycle` to a specific version in production. Review [Migration](/packages/browser-lifecycle/migration/) before upgrading across minor versions once the package is published.

## Related documentation

- [Best Practices](/packages/browser-lifecycle/best-practices/)
- [Performance Playground](http://127.0.0.1:4273/performance)
