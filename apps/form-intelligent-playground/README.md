# Form Intelligent Playground

The Form Intelligent Playground is the official engineering shell for `@jayoncode/form-intelligent` inside the JOC monorepo.

It is the shared environment for:

- development and manual QA
- integration testing against workspace packages
- interactive documentation
- product showcase scenarios

## Explorers

| Route          | Focus                                                     |
| -------------- | --------------------------------------------------------- |
| `/`            | Interactive developer sandbox                             |
| `/dashboard`   | Overview, package versions, explorer map                  |
| `/validation`  | Validators, timing, async checks                          |
| `/submission`  | Submit flow, loading state, guards                        |
| `/workflow`    | Autosave, drafts, wizard steps                            |
| `/state`       | Values tree, field flags, diffs                           |
| `/formatters`  | Phone, currency, slug formatters                          |
| `/plugins`     | Plugin hooks and event log                                |
| `/devtools`    | Inspector, config JSON, export/import, verbose validation |
| `/performance` | Validation, autosave, submit microbenchmarks              |
| `/adapters`    | HTML, React, and planned bridges                          |
| `/examples`    | Copy-paste snippets                                       |
| `/settings`    | Theme and layout preferences                              |
| `/about`       | Product positioning                                       |

## Commands

```bash
pnpm form-intelligent-playground:dev
pnpm form-intelligent-playground:build
pnpm form-intelligent-playground:preview
pnpm form-intelligent-playground:test
```

Dev server: [http://127.0.0.1:4277](http://127.0.0.1:4277)

## Package integration

Import `@jayoncode/form-intelligent` and `@jayoncode/form-intelligent-react` **only** through `src/lib/form-intelligent.ts`. Route pages and components use that boundary — not direct package imports (except types).

```ts
// src/lib/form-intelligent.ts — single integration seam
export { createForm, required, email, useForm } from "...";
export function createSampleForm() {
  /* playground defaults */
}
```

This mirrors the Browser Lifecycle playground pattern (`src/lib/browser-lifecycle.ts`).

## Version metadata

Package versions shown in the shell (header, dashboard, footer) come from `vite.config.ts`:

1. Read `package.json` versions from `packages/form-intelligent`, `packages/form-intelligent-react`, and this app.
2. Inject compile-time constants via Vite `define`:
   - `__FORM_INTELLIGENT_VERSION__`
   - `__FORM_INTELLIGENT_REACT_VERSION__`
   - `__PLAYGROUND_VERSION__`
3. Consume them in `src/config/app-metadata.ts` through `getPlaygroundMetadata()`.
4. Declare the globals in `src/vite-env.d.ts` for TypeScript.

After renaming packages or changing monorepo paths, restart the dev server so `vite.config.ts` reloads. If `readPackageVersion` cannot find a `package.json`, the dev server fails to start — fix the path before retrying.

## Documentation

- [docs/playground.md](./docs/playground.md) — user-facing playground guide
- [engineering/000-playground-foundation.md](./engineering/000-playground-foundation.md) — shell architecture

Bundled into the docs site at `/packages/form-intelligent/playground/` when you run `pnpm docs:sync`.
