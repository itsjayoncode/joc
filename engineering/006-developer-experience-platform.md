# 006 Developer Experience Platform

## Why This Document Exists

This document explains the purpose of the documentation site, interactive playground, and example infrastructure introduced in Phase 1.4.

## Platform Goals

- Make JOC understandable to a new contributor within minutes.
- Provide a stable information architecture before package implementation begins.
- Create a local workbench for future manual package validation and demos.
- Keep the documentation and playground lightweight enough to maintain over time.

## Documentation Application

`apps/docs` uses VitePress to provide:

- a product-level homepage
- getting-started content
- contributor and architecture guides
- package documentation templates
- roadmap and changelog entry points

The documentation is designed to scale with the ecosystem rather than being rewritten for each new package.

## Playground Application

`apps/playground` uses Vite and React to provide a simple local workbench for:

- manual testing
- API exploration
- future example hosting
- workspace package import validation

It is intentionally not a design system showcase or public-facing product.

## Example Infrastructure

The `examples/` directory now contains structured placeholders for future examples. This gives the repository a clear place for applied package documentation without forcing implementation into this phase.

## Integration with Repository Quality

The root scripts now support:

- docs build commands
- playground build commands
- app typechecking alongside package typechecking

This keeps the developer experience layer part of the repository contract instead of treating it as optional.
