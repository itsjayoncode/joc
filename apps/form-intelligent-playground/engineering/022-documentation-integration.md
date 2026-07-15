# Documentation Integration

Phase 3.17 introduces the Form Intelligent documentation platform inside the existing VitePress site.

## Goals

- Generate API reference from TypeScript source
- Sync package and playground docs into the site
- Publish guides, tutorials, best practices, patterns, and FAQ
- Cross-link documentation with the Form Intelligent Playground and framework examples

## Architecture

```text
packages/form-intelligent/src
  -> TypeDoc -> apps/docs/docs/api/form-intelligent

packages/form-intelligent/docs
  -> sync script -> apps/docs/docs/packages/form-intelligent/modules

apps/form-intelligent-playground/docs
  -> sync script -> apps/docs/docs/playground

examples/*
  -> sync script -> apps/docs/docs/examples/index.md

apps/docs (VitePress)
  -> local search, dark mode, version nav, edit links
```

## Commands

```bash
pnpm docs:api
pnpm docs:sync
pnpm docs:prepare
pnpm docs:dev
pnpm docs:build
```

## Naming

Construction docs refer to **Form Intelligent** and `createBrowserSession()`. The canonical implementation is `@jayoncode/form-intelligent` and `createBrowserLifecycle()`.

## Playground URL

Local playground: `http://127.0.0.1:4277`

## Quality gates

- `tests/dx-platform.test.ts` validates required documentation pages
- `pnpm docs:build` regenerates API and synced content before site build

## Related construction task

`_constuction/phase 3/Phase 3.17 — Documentation Integration.md`
