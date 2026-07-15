# React Example

React + TypeScript reference using a provider and hooks.

## Install

```bash
pnpm add @jayoncode/browser-lifecycle react react-dom
```

## Files

- `src/browser-lifecycle-provider.tsx`
- `src/hooks/use-browser-lifecycle.ts`
- `src/hooks/use-visibility.ts`

## Patterns

- One session per provider tree
- StrictMode-safe cleanup with `useEffect` return handlers
- Hook wrappers for module-specific events
