# Event Infrastructure Examples

These examples cover the generic typed event infrastructure introduced in Phase `2.2.1`.

## Basic Subscription

```ts
import { TypedEventEmitter } from "@jayoncode/browser-lifecycle";

interface DemoEvents {
  "page:hidden": { readonly value: "hidden" };
}

const emitter = new TypedEventEmitter<DemoEvents>();

emitter.on("page:hidden", (payload, metadata) => {
  console.log(payload.value, metadata.timestamp);
});

emitter.emit("page:hidden", { value: "hidden" }, { source: "example" });
```

## One-Time Listener

```ts
import { TypedEventEmitter } from "@jayoncode/browser-lifecycle";

interface DemoEvents {
  "session:started": { readonly value: "started" };
}

const emitter = new TypedEventEmitter<DemoEvents>();

emitter.once("session:started", (payload) => {
  console.log(payload.value);
});
```

## Removing Listeners

```ts
import { TypedEventEmitter } from "@jayoncode/browser-lifecycle";

interface DemoEvents {
  "window:focus": { readonly focused: boolean };
}

const emitter = new TypedEventEmitter<DemoEvents>();
const listener = (payload: DemoEvents["window:focus"]) => {
  console.log(payload.focused);
};

emitter.on("window:focus", listener);
emitter.off("window:focus", listener);
```

## Multiple Listeners

```ts
import { TypedEventEmitter } from "@jayoncode/browser-lifecycle";

interface DemoEvents {
  "session:idle": { readonly idle: true };
}

const emitter = new TypedEventEmitter<DemoEvents>();

emitter.on("session:idle", () => {
  console.log("first");
});
emitter.on("session:idle", () => {
  console.log("second");
});
```

## Emitter Destruction

```ts
import { TypedEventEmitter } from "@jayoncode/browser-lifecycle";

interface DemoEvents {
  "connection:online": { readonly online: true };
}

const emitter = new TypedEventEmitter<DemoEvents>();

emitter.destroy();
```
