# Browser Lifecycle Solid — Folder Architecture

`@jayoncode/browser-lifecycle-solid` is a thin Solid adapter over `@jayoncode/browser-lifecycle`.

- src/provider.ts — Provider and hooks
- src/resolve-binding.ts — shared ownership/dispose rules

Dependency direction: `@jayoncode/browser-lifecycle` → adapter → `index.ts`.
