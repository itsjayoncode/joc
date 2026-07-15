# 000 Playground Foundation

## Why This Document Exists

This document records the implementation shape of the Playground Foundation introduced in Phase `3.1`.

## Architecture Summary

The app is organized around four seams:

1. shell UI
2. route pages
3. application state and preferences
4. Object Diff integration

This lets future module pages plug into the shell without forcing architectural changes.

## Folder Responsibilities

- `src/app`: composition root
- `src/layouts`: app-wide shell layout
- `src/pages`: routed screens
- `src/components`: reusable UI building blocks
- `src/hooks`: focused React helpers
- `src/services`: persistence and environment helpers
- `src/providers`: state ownership for theme and shell UI
- `src/contexts`: React contexts for providers
- `src/routes`: route composition
- `src/styles`: tokens, global styles, and component modules
- `src/lib`: Object Diff integration boundary
- `src/constants`, `src/types`, `src/utils`, `src/icons`: shared support code

## Technology Decisions

### React Router

React Router gives the playground a stable nested routing model that can grow into future module pages without rewriting the shell.

### CSS Modules

CSS Modules were chosen over Tailwind because:

- the app needs minimal dependencies
- design tokens remain close to component ownership
- local scoping keeps future module styling predictable

### Context for UI State

Context is enough for the foundation because the state is local to shell behavior:

- theme
- sidebar density
- mobile sidebar state
- recent route activity

Redux would add overhead without solving a current problem.

## Future Expansion Path

The shell is ready to absorb:

- module route pages
- Object Diff inspectors
- configuration controls
- diagnostics panels
- event explorers
- developer tools

Future work should plug into the existing route and shell structure instead of adding parallel layout systems.
