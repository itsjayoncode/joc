# Electron Example

Renderer-process integration for Browser Lifecycle.

## Guidance

- Run Browser Lifecycle in the renderer only
- Tie cleanup to window lifecycle events
- Do not initialize in the main process

## Files

- `renderer/session.ts`
