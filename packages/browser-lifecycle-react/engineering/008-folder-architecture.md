# Browser Lifecycle React — Folder Architecture

`@jayoncode/browser-lifecycle-react` is a thin React adapter over `@jayoncode/browser-lifecycle`.

- src/provider.tsx — Provider and hooks
- src/types.ts — public adapter types
- src/resolve-binding.ts — shared ownership/dispose rules

Dependency direction: `@jayoncode/browser-lifecycle` → adapter → `index.ts`.
