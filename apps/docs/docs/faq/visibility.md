# Visibility FAQ

## Does `page:hidden` mean the user closed the app?

No. It usually means the document is hidden, such as when switching tabs or minimizing the window.

## Example

```ts
lifecycle.on("page:hidden", () => console.log("hidden"));
```

## Playground

[Visibility Playground](http://127.0.0.1:4273/visibility)

## Module docs

[Visibility Module](/packages/browser-lifecycle/modules/visibility)
