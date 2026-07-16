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

[Visibility Playground](http://127.0.0.1:4273/visibility)

## Pattern

[Visibility Pause](/packages/browser-lifecycle/patterns/visibility-pause)
