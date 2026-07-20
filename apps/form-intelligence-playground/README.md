# Form Intelligence Playground

The Form Intelligence Playground is the official engineering shell for `@jayoncode/form-intelligence` inside the JOC monorepo.

It is the shared environment for:

- development and manual QA
- integration testing against workspace packages
- interactive documentation
- product showcase scenarios

## Explorers

| Route               | Focus                                                     |
| ------------------- | --------------------------------------------------------- |
| `/`                 | Interactive developer sandbox                             |
| `/dashboard`        | Overview, package versions, explorer map                  |
| `/validation`       | Validators, timing, async checks                          |
| `/html-constraints` | DOM-backed HTML constraints (`form.ref`, Phase 1)         |
| `/submission`       | Submit flow, loading state, guards                        |
| `/captcha`          | Security Stage CAPTCHA (loading / pending / outcomes)     |
| `/ui`               | UI policies, showError, status, canSubmit                 |
| `/workflow`         | Autosave, drafts, wizard steps                            |
| `/state`            | Values tree, field flags, diffs                           |
| `/formatters`       | Phone, currency, slug formatters                          |
| `/plugins`          | Plugin hooks and event log                                |
| `/devtools`         | Inspector, config JSON, export/import, verbose validation |
| `/performance`      | Validation, autosave, submit microbenchmarks              |
| `/adapters`         | HTML, React, and planned bridges                          |
| `/examples`         | Copy-paste snippets                                       |
| `/settings`         | Theme and layout preferences                              |
| `/about`            | Product positioning                                       |

## Commands

```bash
pnpm form-intelligence-playground:dev
pnpm form-intelligence-playground:build
pnpm form-intelligence-playground:preview
pnpm form-intelligence-playground:test
```

Dev server: [http://127.0.0.1:4277](http://127.0.0.1:4277)

## Package integration

Import `@jayoncode/form-intelligence` and `@jayoncode/form-intelligence-react` **only** through `src/lib/form-intelligence.ts`. Route pages and components use that boundary — not direct package imports (except types).

```ts
// src/lib/form-intelligence.ts — single integration seam
export { createForm, required, email, useForm } from "...";
export function createSampleForm() {
  /* playground defaults */
}
```

This mirrors the Browser Lifecycle playground pattern (`src/lib/browser-lifecycle.ts`).

## Version metadata

Package versions shown in the shell (header, dashboard, footer) come from `vite.config.ts`:

1. Read `package.json` versions from `packages/form-intelligence`, `packages/form-intelligence-react`, and this app.
2. Inject via Vite `define` / `import.meta.env`:
   - `VITE_FORM_INTELLIGENT_VERSION`
   - `VITE_FORM_INTELLIGENT_REACT_VERSION`
   - `VITE_PLAYGROUND_VERSION`
3. Consume them in `src/config/app-metadata.ts` through `getPlaygroundMetadata()`.
4. Declare the env keys in `src/vite-env.d.ts` for TypeScript.

After renaming packages or changing monorepo paths, restart the dev server so `vite.config.ts` reloads. If `readPackageVersion` cannot find a `package.json`, the dev server fails to start — fix the path before retrying.

### Version control when changing the playground

**Policy (humans + agents):** when a request changes the Form Intelligence playground (pages, sandbox, inspectors, benches, docs under this app), **analyze and bump versions in the same change set** so the shell reflects the update.

| What changed                                                           | Version action                                                                                                                                                                             |
| ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Playground UI, explorers, sandbox, playground docs/engineering         | Bump `apps/form-intelligence-playground/package.json` (`patch` for small fixes, `minor` for user-visible features)                                                                         |
| `@jayoncode/form-intelligence` / `-react` (or other consumed packages) | Ensure a **changeset** exists for those packages; the shell shows their `package.json` version — it updates when that package version is bumped (usually at release / `changeset version`) |
| Docs site sync only                                                    | No playground version bump required                                                                                                                                                        |

Always restart `pnpm form-intelligence-playground:dev` after a version bump so Vite re-reads `package.json`.

Do **not** leave playground feature work on an unchanged playground `version` when the change is meant to be visible in the product shell.

## Documentation

- [docs/playground.md](./docs/playground.md) — user-facing playground guide
- [engineering/000-playground-foundation.md](./engineering/000-playground-foundation.md) — shell architecture

Bundled into the docs site at `/packages/form-intelligence/playground/` when you run `pnpm docs:sync`.
