# Engineering Note — Documentation Integration

Phase 5.3.13 wires `@jayoncode/form-intelligence` guides and the Form Intelligence Playground into the JOC VitePress site.

## Pipeline

| Step                  | Script / path                                                                                                                   |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| Sync modules          | `packages/form-intelligence/docs/*` → `apps/docs/docs/packages/form-intelligence/modules/` via `scripts/sync-documentation.mjs` |
| Sync index            | `packages/form-intelligence/docs/index.md` → `apps/docs/docs/packages/form-intelligence/index.md`                               |
| Sync playground guide | `apps/form-intelligence-playground/docs/` → `apps/docs/docs/packages/form-intelligence/playground/`                             |
| Version meta          | `.vitepress/form-intelligence-meta.ts`                                                                                          |
| Sidebar               | `.vitepress/form-intelligence-sidebar.ts`                                                                                       |
| Bundle SPA            | `scripts/bundle-playground-into-docs.mjs` → `dist/playground/form-intelligence/`                                                |

## Production URLs

- Docs: `https://itsjayoncode.github.io/joc/packages/form-intelligence/`
- Playground: `https://itsjayoncode.github.io/joc/playground/form-intelligence/`
- Hub: `https://itsjayoncode.github.io/joc/playground/`

## CI

`docs:build` / deploy workflows set:

```bash
VITE_FORM_INTELLIGENCE_PLAYGROUND_BASE=/joc/playground/form-intelligence/
```

The playground Vite `base` is driven by `VITE_PLAYGROUND_BASE` (injected by the bundle script from the env above).
