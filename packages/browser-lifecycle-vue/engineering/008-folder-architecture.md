# Browser Lifecycle Vue — Folder Architecture

`@jayoncode/browser-lifecycle-vue` is a thin Vue adapter over `@jayoncode/browser-lifecycle`.

- src/composables.ts — provide/inject composables
- src/resolve-binding.ts — shared ownership/dispose rules

Dependency direction: `@jayoncode/browser-lifecycle` → adapter → `index.ts`.
