# Browser Lifecycle Framework Examples

Official reference implementations for integrating `@jayoncode/browser-lifecycle` across common web stacks.

| Example            | Path                | Highlights                           |
| ------------------ | ------------------- | ------------------------------------ |
| Vanilla TypeScript | `examples/vanilla`  | Direct session ownership and cleanup |
| React              | `examples/react`    | Provider + hooks                     |
| Vue 3              | `examples/vue`      | Composables                          |
| Angular            | `examples/angular`  | Injectable service + `DestroyRef`    |
| Svelte             | `examples/svelte`   | Store-backed session                 |
| Next.js            | `examples/nextjs`   | Client-only App Router component     |
| Electron           | `examples/electron` | Renderer process lifecycle           |
| PWA                | `examples/pwa`      | Offline and reconnect patterns       |

Construction documents may refer to `createBrowserSession()` and `@jayoncode/browser-session`. The canonical package and factory are `@jayoncode/browser-lifecycle` and `createBrowserLifecycle()`.

See also:

- `docs/examples.md`
- `examples/` in the monorepo root
