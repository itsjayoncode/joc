# Engineering Note — Documentation Integration

Phase 5.3.13 wires `@jayoncode/form-intelligent` guides and the Form Intelligent Playground into the JOC VitePress site.

## Pipeline

| Step                  | Script / path                                                                                                                 |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Sync modules          | `packages/form-intelligent/docs/*` → `apps/docs/docs/packages/form-intelligent/modules/` via `scripts/sync-documentation.mjs` |
| Sync index            | `packages/form-intelligent/docs/index.md` → `apps/docs/docs/packages/form-intelligent/index.md`                               |
| Sync playground guide | `apps/form-intelligent-playground/docs/` → `apps/docs/docs/packages/form-intelligent/playground/`                             |
| Version meta          | `.vitepress/form-intelligent-meta.ts`                                                                                         |
| Sidebar               | `.vitepress/form-intelligent-sidebar.ts`                                                                                      |
| Bundle SPA            | `scripts/bundle-playground-into-docs.mjs` → `dist/playground/form-intelligent/`                                               |

## Production URLs

- Docs: `https://itsjayoncode.github.io/joc/packages/form-intelligent/`
- Playground: `https://itsjayoncode.github.io/joc/playground/form-intelligent/`
- Hub: `https://itsjayoncode.github.io/joc/playground/`

## CI

`docs:build` / deploy workflows set:

```bash
VITE_FORM_INTELLIGENT_PLAYGROUND_BASE=/joc/playground/form-intelligent/
```

The playground Vite `base` is driven by `VITE_PLAYGROUND_BASE` (injected by the bundle script from the env above).
