# Public API Design

## Core

- `diff(a, b, options?)` — structured change list
- `compare(a, b, options?)` — deep equality
- `hasChanges(a, b, options?)` — boolean early exit
- `added`, `removed`, `updated`, `unchanged` — filtered views

## Patch

- `patch(diff, options?)` — generate JSON Patch operations
- `applyPatch(target, patch, options?)` — apply immutably
- `revertPatch(target, patch, options?)` — reverse operations

## Serialize

- `serialize(diff, format, options?)` — json, pretty, markdown, table
