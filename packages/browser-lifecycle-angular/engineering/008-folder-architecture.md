# Browser Lifecycle Angular — Folder Architecture

`@jayoncode/browser-lifecycle-angular` is a thin Angular adapter over `@jayoncode/browser-lifecycle`.

- src/provide.ts — DI providers and inject helpers
- src/browser-lifecycle-handle.ts — Angular handle wrapper
- src/tokens.ts — injection tokens
- src/resolve-binding.ts — shared ownership/dispose rules

Dependency direction: `@jayoncode/browser-lifecycle` → adapter → `index.ts`.
