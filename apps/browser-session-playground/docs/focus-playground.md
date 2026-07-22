# Focus Playground

## Purpose

The Focus Playground demonstrates the Browser Lifecycle Focus module inside the Browser Lifecycle Playground.

It teaches developers:

- what window focus and blur mean
- how Browser Lifecycle normalizes attention state
- how focus differs from visibility

## Route

- `/focus`

## Architecture

```text
FocusPage
  -> useFocusPlayground()
    -> createFocusPlaygroundSession() in lib/browser-lifecycle.ts
      -> @jayoncode/browser-lifecycle
    -> window:focus / window:blur listeners
    -> snapshot reads for attention fields
```

UI components never attach browser listeners directly. All Browser Lifecycle access stays behind `src/lib/browser-lifecycle.ts`.

## Page Sections

### Focus Status

Shows normalized attention state, previous state, last change timestamp, duration since the last transition, and session phase.

### Browser API Information

Documents the browser APIs mapped into Browser Lifecycle:

- `window` focus events
- `window` blur events
- `document.hasFocus()`

Also explains the difference between focus and visibility.

### Live Event Stream

Streams `window:focus` and `window:blur` events with payload summaries and session state. Supports pause and resume.

### Blur Event History

Records `window:blur` events only, newest first, capped at 100 entries. Supports search, clear, pause, resume, and copy.

### Developer Examples

Copy-ready examples that use `createBrowserLifecycle()` for:

- pausing keyboard shortcuts
- pausing game controls
- locking secure actions

## Manual QA

1. Open `/focus` and confirm the status reads Focused.
2. Switch to another application or browser tab.
3. Return and confirm blur and focus transitions appear in the live stream and blur history.

## Related Docs

- [Playground foundation](./playground.md)
- [Visibility playground](./visibility-playground.md)
- Package docs: `packages/browser-lifecycle/docs/visibility.md` (focus docs follow the same module pattern)
