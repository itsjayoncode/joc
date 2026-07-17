# Browser Lifecycle — Typed, framework-agnostic browser session lifecycle for modern web apps.

[![npm version](https://img.shields.io/npm/v/@jayoncode/browser-lifecycle.svg)](https://www.npmjs.com/package/@jayoncode/browser-lifecycle)
[![license](https://img.shields.io/npm/l/@jayoncode/browser-lifecycle.svg)](https://github.com/itsjayoncode/joc/blob/master/packages/browser-lifecycle/package.json)
[![docs](https://img.shields.io/badge/docs-jayoncode.github.io-2563eb)](https://itsjayoncode.github.io/joc/packages/browser-lifecycle/)

Published as [`@jayoncode/browser-lifecycle`](https://www.npmjs.com/package/@jayoncode/browser-lifecycle) on npm.

Track page visibility, window focus, online/offline connectivity, user idle state, page lifecycle, and cross-tab coordination through one composable TypeScript API — with SSR-safe feature detection and a plugin system. Works with React, Vue, Angular, Svelte, Next.js, and vanilla JavaScript.

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

## Quick start

```ts
import { createBrowserLifecycle } from "@jayoncode/browser-lifecycle";

const lifecycle = createBrowserLifecycle({
  autoStart: true,
  debug: false,
});

lifecycle.on("page:visible", () => {
  console.log("Tab is visible again");
});

lifecycle.on("session:idle", () => {
  console.log("User went idle");
});

// Read a typed snapshot any time
const snapshot = lifecycle.getSnapshot();

// Clean up when your app unmounts
lifecycle.dispose();
```

### Optional: Activity facade (experimental)

Derive-only helper over snapshot/events — **no extra DOM listeners**. Costs nothing until you call it. Meaningful status requires `idleTimeout`.

```ts
import { createActivityApi, createBrowserLifecycle } from "@jayoncode/browser-lifecycle";

const lifecycle = createBrowserLifecycle({ idleTimeout: 30_000 });
const activity = createActivityApi(lifecycle);

if (activity.isIdle()) {
  // pause non-critical work
}

activity.dispose(); // unsubscribe tracking; does not dispose lifecycle
lifecycle.dispose();
```

### Optional: Presence facade (experimental)

Page-local availability only (**not** multi-user presence). Pure snapshot projection — **no subscriptions**.

```ts
import { createPresenceApi, createBrowserLifecycle } from "@jayoncode/browser-lifecycle";

const lifecycle = createBrowserLifecycle();
const presence = createPresenceApi(lifecycle);

if (presence.isAway()) {
  // e.g. pause realtime work
  console.log(presence.state().reasons); // ["hidden"] | ["blurred"] | …
}

lifecycle.dispose();
```

### Optional: Timeline (experimental)

Bounded event history — **opt-in only**. Requires `maxEvents`. Drop-oldest overflow.

```ts
import { createBrowserLifecycle, createTimelineApi } from "@jayoncode/browser-lifecycle";

const lifecycle = createBrowserLifecycle();
const timeline = createTimelineApi(lifecycle, { maxEvents: 100 });

console.log(timeline.events());
timeline.dispose(); // unsubscribe + clear buffer
lifecycle.dispose();
```

### Optional: Metrics (experimental)

Live counters/durations from public events — **does not require Timeline**.

```ts
import { createBrowserLifecycle, createMetricsApi } from "@jayoncode/browser-lifecycle";

const lifecycle = createBrowserLifecycle({ idleTimeout: 30_000 });
const metrics = createMetricsApi(lifecycle);

console.log(metrics.snapshot());
// durations, counts, attentionScore, …
console.log(metrics.attention().score); // 0–100
console.log(metrics.stats());

metrics.dispose();
lifecycle.dispose();
```

### Optional: Reports (experimental)

On-demand summary from Metrics (Timeline evidence optional). No subscriptions of its own.

```ts
import {
  createBrowserLifecycle,
  createMetricsApi,
  createReportsApi,
} from "@jayoncode/browser-lifecycle";

const lifecycle = createBrowserLifecycle({ idleTimeout: 30_000 });
const metrics = createMetricsApi(lifecycle);
const reports = createReportsApi({ metrics });

console.log(reports.sessionSummary().highlights);
```

### Optional: Wait helpers (experimental)

Promise helpers over public events — **no polling**. Resolves immediately if already satisfied.

```ts
import { createBrowserLifecycle, createWaitApi } from "@jayoncode/browser-lifecycle";

const lifecycle = createBrowserLifecycle();
const wait = createWaitApi(lifecycle);

await wait.untilVisible({ timeoutMs: 5_000 });
wait.dispose();
lifecycle.dispose();
```

### Optional: Conditions (experimental)

Thin event DSL — handler errors are isolated from the session.

```ts
import { createBrowserLifecycle, createConditionsApi } from "@jayoncode/browser-lifecycle";

const lifecycle = createBrowserLifecycle();
const when = createConditionsApi(lifecycle);

const handle = when.hidden(() => {
  // pause non-critical work
});
handle.unsubscribe();
when.dispose();
lifecycle.dispose();
```

### Optional: Resilience (experimental)

Named helpers over reconnect / wake / restore catalog events — no persistence, no extra browser APIs.

```ts
import { createBrowserLifecycle, createResilienceApi } from "@jayoncode/browser-lifecycle";

const lifecycle = createBrowserLifecycle();
const resilience = createResilienceApi(lifecycle);

const off = resilience.onReconnect(() => {
  // flush queued work
});
off();
resilience.dispose();
lifecycle.dispose();
```

### Framework adapters (experimental)

Thin wrappers live in separate packages (public API only; dispose on unmount; client-only start):

- `@jayoncode/browser-lifecycle-react`
- `@jayoncode/browser-lifecycle-vue`
- `@jayoncode/browser-lifecycle-svelte`
- `@jayoncode/browser-lifecycle-solid`
- `@jayoncode/browser-lifecycle-angular`

## Why use it

| Capability       | What you get                                            |
| ---------------- | ------------------------------------------------------- |
| **Session core** | Start, stop, pause, and inspect lifecycle state         |
| **Visibility**   | `page:visible` / `page:hidden` from document visibility |
| **Focus**        | `window:focus` / `window:blur` normalization            |
| **Connectivity** | Advisory online/offline signals                         |
| **Idle**         | Activity-based idle detection                           |
| **Activity API** | Optional derive-only facade (`createActivityApi`)       |
| **Presence API** | Optional page-local presence (`createPresenceApi`)      |
| **Timeline**     | Optional bounded event history (`createTimelineApi`)    |
| **Metrics**      | Optional durations/counts/attention (`createMetricsApi`) |
| **Reports**      | Optional on-demand summaries (`createReportsApi`)       |
| **Health**       | Optional session health (`createSessionHealthApi`)      |
| **Predict**      | Optional engagement heuristics (`createSessionPredictApi`) |
| **Wait**         | Optional promise helpers (`createWaitApi`)              |
| **Conditions**   | Optional event DSL (`createConditionsApi`)              |
| **Resilience**   | Optional reconnect/wake/restore (`createResilienceApi`) |
| **Adapters**     | Optional framework packages (`browser-lifecycle-react`, …) |
| **Cross-tab**    | Leader election and tab messaging                       |
| **Plugins**      | Register hooks and inspect runtime diagnostics          |
| **SSR-safe**     | Capability helpers that work without throwing in Node   |

## Documentation

- [Package overview](https://itsjayoncode.github.io/joc/packages/browser-lifecycle/)
- [Quick start guide](https://itsjayoncode.github.io/joc/packages/browser-lifecycle/guides/quick-start)
- [Configuration](https://itsjayoncode.github.io/joc/packages/browser-lifecycle/guides/configuration)
- [Interactive playground](https://itsjayoncode.github.io/joc/playground/browser-lifecycle/)

## Requirements

- **Node.js** 20+ (for tooling)
- **Browsers**: modern evergreen browsers; see [browser support](https://itsjayoncode.github.io/joc/packages/browser-lifecycle/guides/browser-support)

## Repository

Source, issues, and contributions:

**https://github.com/itsjayoncode/joc**

Package path: `packages/browser-lifecycle`

## License

MIT © [JayOnCode](https://github.com/itsjayoncode)
