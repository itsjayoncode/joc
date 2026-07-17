# Browser Lifecycle — Typed, framework-agnostic browser session lifecycle for modern web apps.

[![npm version](https://img.shields.io/npm/v/@jayoncode/browser-lifecycle.svg)](https://www.npmjs.com/package/@jayoncode/browser-lifecycle)
[![license](https://img.shields.io/npm/l/@jayoncode/browser-lifecycle.svg)](https://github.com/itsjayoncode/joc/blob/master/packages/browser-lifecycle/package.json)
[![docs](https://img.shields.io/badge/docs-jayoncode.github.io-2563eb)](https://itsjayoncode.github.io/joc/packages/browser-lifecycle/)

Published as [`@jayoncode/browser-lifecycle`](https://www.npmjs.com/package/@jayoncode/browser-lifecycle) on npm.

Stop wiring `visibilitychange`, `focus`, `online`, and idle timers by hand. One composable TypeScript API covers page visibility, window focus, connectivity, idle, page lifecycle, and cross-tab coordination — with SSR-safe feature detection and opt-in intelligence. Works with React, Vue, Angular, Svelte, Next.js, and vanilla JavaScript.

## Install

```bash
npm install @jayoncode/browser-lifecycle
```

```bash
pnpm add @jayoncode/browser-lifecycle
```

```bash
yarn add @jayoncode/browser-lifecycle
```

## The problem it solves

Most apps slowly accumulate listeners like this:

```ts
document.addEventListener("visibilitychange", ...);
window.addEventListener("focus", ...);
window.addEventListener("blur", ...);
window.addEventListener("online", ...);
window.addEventListener("offline", ...);
// + custom idle timer + cleanup bugs on every route change
```

`@jayoncode/browser-lifecycle` replaces that sprawl with one session object.

## Quick start — stop wasting work in a background tab

```ts
import { createBrowserLifecycle } from "@jayoncode/browser-lifecycle";

const lifecycle = createBrowserLifecycle({
  autoStart: true,
  idleTimeout: 60_000,
});

lifecycle.on("page:hidden", () => {
  pausePolling();
  pauseMedia();
});

lifecycle.on("page:visible", () => {
  resumePolling();
});

lifecycle.on("session:idle", () => {
  lockSensitiveScreen();
});

lifecycle.on("connection:reconnect", () => {
  flushOfflineQueue();
});

// Read a typed snapshot any time
const snapshot = lifecycle.getSnapshot();

// Clean up when your app unmounts
lifecycle.dispose();
```

## More problem → solution snippets

### Flush work when the network comes back

```ts
import { createBrowserLifecycle, createResilienceApi } from "@jayoncode/browser-lifecycle";

const lifecycle = createBrowserLifecycle({ autoStart: true });
const resilience = createResilienceApi(lifecycle);

resilience.onReconnect(() => {
  flushOfflineQueue();
});

resilience.onWake(() => {
  refreshStaleData();
});
```

### Wait until the tab is visible before heavy work

```ts
import { createBrowserLifecycle, createWaitApi } from "@jayoncode/browser-lifecycle";

const lifecycle = createBrowserLifecycle({ autoStart: true });
const wait = createWaitApi(lifecycle);

await wait.untilVisible({ timeoutMs: 10_000 });
startExpensiveHydration();
```

### Measure attention without building your own telemetry

```ts
import { createBrowserLifecycle, createMetricsApi } from "@jayoncode/browser-lifecycle";

const lifecycle = createBrowserLifecycle({ autoStart: true, idleTimeout: 30_000 });
const metrics = createMetricsApi(lifecycle);

console.log(metrics.attention().score); // 0–100
console.log(metrics.snapshot().durations);
```

## Optional intelligence & DX (pay only when you import)

| Helper                | What it solves                      |
| --------------------- | ----------------------------------- |
| `createActivityApi`   | Idle/active facade over the session |
| `createPresenceApi`   | Page-local away/active reasons      |
| `createTimelineApi`   | Bounded event history               |
| `createMetricsApi`    | Durations, counts, attention score  |
| `createReportsApi`    | On-demand session summaries         |
| `createWaitApi`       | Promise helpers (`untilVisible`, …) |
| `createConditionsApi` | Tiny event DSL (`when.hidden(...)`) |
| `createResilienceApi` | Reconnect / wake / restore helpers  |

## Framework adapters

Thin wrappers live in separate packages (dispose on unmount; client-only start):

- `@jayoncode/browser-lifecycle-react`
- `@jayoncode/browser-lifecycle-vue`
- `@jayoncode/browser-lifecycle-svelte`
- `@jayoncode/browser-lifecycle-solid`
- `@jayoncode/browser-lifecycle-angular`

## Why use it

| Capability       | What you get                                    |
| ---------------- | ----------------------------------------------- |
| **Session core** | Start, stop, pause, and inspect lifecycle state |
| **Visibility**   | `page:visible` / `page:hidden`                  |
| **Focus**        | `window:focus` / `window:blur`                  |
| **Connectivity** | `connection:online` / `offline` / `reconnect`   |
| **Idle**         | Activity-based `session:idle`                   |
| **Cross-tab**    | Leader election and tab messaging               |
| **Plugins**      | Register hooks and inspect diagnostics          |
| **SSR-safe**     | Capability helpers that do not throw in Node    |

## Documentation

- [Package overview](https://itsjayoncode.github.io/joc/packages/browser-lifecycle/)
- [Quick start guide](https://itsjayoncode.github.io/joc/packages/browser-lifecycle/guides/quick-start)
- [Configuration](https://itsjayoncode.github.io/joc/packages/browser-lifecycle/guides/configuration)
- [Interactive playground](https://itsjayoncode.github.io/joc/playground/browser-lifecycle/)

## Requirements

- **Node.js** 20+ (for tooling)
- **Browsers**: modern evergreen browsers; see [browser support](https://itsjayoncode.github.io/joc/packages/browser-lifecycle/guides/browser-support)

## Repository

**https://github.com/itsjayoncode/joc** · Package path: `packages/browser-lifecycle`

## License

MIT © [JayOnCode](https://github.com/itsjayoncode)
