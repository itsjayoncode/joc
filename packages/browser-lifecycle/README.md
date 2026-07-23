# Browser Lifecycle — Typed, framework-agnostic browser session lifecycle for modern web apps.

**Observe browser state. Derive session intelligence. React with confidence.**

[`@jayoncode/browser-lifecycle`](https://www.npmjs.com/package/@jayoncode/browser-lifecycle) — typed, framework-agnostic browser session lifecycle for modern web apps.

[![npm version](https://img.shields.io/npm/v/@jayoncode/browser-lifecycle.svg)](https://www.npmjs.com/package/@jayoncode/browser-lifecycle)
[![license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/itsjayoncode/joc/blob/master/packages/browser-lifecycle/package.json)
[![docs](https://img.shields.io/badge/docs-jayoncode.github.io-2563eb)](https://itsjayoncode.github.io/joc/packages/browser-lifecycle/)
[![Become a Sponsor](https://img.shields.io/badge/Become%20a%20Sponsor-%23ea4aaa?style=flat&logo=githubsponsors&logoColor=white)](https://github.com/sponsors/jayoncoding)

One API for visibility, focus, connectivity, idle, page lifecycle, and cross-tab — with optional session intelligence and DX. Works with React, Vue, Angular, Svelte, Next.js, and vanilla JavaScript.

> **One session. One snapshot. One event stream.**  
> Everything else is derived.

## Observe → Understand → React

Most libraries stop at browser events. Browser Lifecycle continues:

```text
Browser APIs
    ↓
Normalized Session
    ↓
Session Intelligence (opt-in)
    ↓
Developer APIs (opt-in)
```

| Pillar         | What you get                                        |
| -------------- | --------------------------------------------------- |
| **Observe**    | Normalize browser lifecycle into one consistent API |
| **Understand** | Transform signals into meaningful session insights  |
| **React**      | Wait, conditions, resilience, plugins, playground   |

### Five capabilities

| Card                          | What it is                                                                                                                  |
| ----------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| **Unified Browser Lifecycle** | One typed session for visibility, focus, connectivity, idle, page lifecycle, and cross-tab — instead of scattered listeners |
| **Session Intelligence**      | Opt-in activity (active / idle) and **page-local** presence (available / away / unknown)                                    |
| **Timeline**                  | Bounded chronological history of session events                                                                             |
| **Session Insights**          | Opt-in metrics and on-demand reports — not an analytics SDK                                                                 |
| **Developer Experience**      | Wait, conditions, resilience, plugins, and an interactive playground                                                        |

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

## Quick start — Observe first

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

const snapshot = lifecycle.getSnapshot();

// Sync teardown — do not reuse the instance
lifecycle.dispose();
```

## Zero-cost until you ask

Core observation stays lightweight. Session intelligence and developer experience are completely opt-in — you only pay for what you use. Creating a session does **not** allocate Activity, Presence, Timeline, Metrics, or Reports.

```ts
const lifecycle = createBrowserLifecycle({ autoStart: true });
// lean core only

const timeline = createTimelineApi(lifecycle);
// cost starts here
```

## Understand & React (opt-in factories)

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

### Session insights — metrics without building your own counters

```ts
import {
  createBrowserLifecycle,
  createMetricsApi,
  createReportsApi,
  createTimelineApi,
} from "@jayoncode/browser-lifecycle";

const lifecycle = createBrowserLifecycle({ autoStart: true, idleTimeout: 30_000 });
const metrics = createMetricsApi(lifecycle);
const timeline = createTimelineApi(lifecycle);
const reports = createReportsApi({ metrics, timeline });

console.log(metrics.attention().score); // 0–100
console.log(reports.sessionSummary());
```

| Helper                | Layer                | What it solves                        |
| --------------------- | -------------------- | ------------------------------------- |
| `createActivityApi`   | Session Intelligence | Active / idle facade                  |
| `createPresenceApi`   | Session Intelligence | Page-local available / away / unknown |
| `createTimelineApi`   | Timeline             | Bounded event history                 |
| `createMetricsApi`    | Session Insights     | Durations, counts, attention score    |
| `createReportsApi`    | Session Insights     | On-demand session summaries           |
| `createWaitApi`       | Developer Experience | `untilVisible`, `untilOnline`, …      |
| `createConditionsApi` | Developer Experience | `when.hidden(...)`, …                 |
| `createResilienceApi` | Developer Experience | Reconnect / wake / restore            |

`createSessionHealthApi` and `createSessionPredictApi` are **experimental** helpers — documented in the intelligence guide, not homepage flagships.

## What this is not

- Not multi-user / Slack-like presence — presence is **page-local**
- Not an analytics or telemetry SDK — Session Insights stay in-process
- Connectivity is **advisory** (`navigator.onLine`), not reachability
- Not auth, routing, or storage

## Framework adapters

Thin wrappers live in separate packages (dispose on unmount; client-only start):

- `@jayoncode/browser-lifecycle-react`
- `@jayoncode/browser-lifecycle-vue`
- `@jayoncode/browser-lifecycle-svelte`
- `@jayoncode/browser-lifecycle-solid`
- `@jayoncode/browser-lifecycle-angular`

## Documentation

- [Package overview](https://itsjayoncode.github.io/joc/packages/browser-lifecycle/)
- [Quick start guide](https://itsjayoncode.github.io/joc/packages/browser-lifecycle/guides/quick-start)
- [Interactive playground](https://itsjayoncode.github.io/joc/playground/browser-lifecycle/)

## Requirements

- **Node.js** 20+ (for tooling)
- **Browsers**: modern evergreen browsers; see [browser support](https://itsjayoncode.github.io/joc/packages/browser-lifecycle/guides/browser-support)

## Repository

**https://github.com/itsjayoncode/joc** · Package path: `packages/browser-lifecycle`

## License

MIT © [JayOnCode](https://github.com/itsjayoncode)
