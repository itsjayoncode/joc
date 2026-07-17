# Browser Lifecycle Svelte — Folder Architecture

`@jayoncode/browser-lifecycle-svelte` is a thin Svelte adapter over `@jayoncode/browser-lifecycle`.

- src/context.ts — context helpers
- src/resolve-binding.ts — shared ownership/dispose rules

Dependency direction: `@jayoncode/browser-lifecycle` → adapter → `index.ts`.
