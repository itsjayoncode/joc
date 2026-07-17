# Visibility Handling

## Recommended

Pause timers, media, and polling when the page is hidden:

```ts
lifecycle.on("page:hidden", () => pauseWork());
lifecycle.on("page:visible", () => resumeWork());
```

## Not recommended

Assuming `page:hidden` always means the user left the application.

## Playground

[Visibility Playground](/playground/browser-lifecycle/visibility)

## Pattern

[Visibility Pause](/packages/browser-lifecycle/patterns/visibility-pause)
