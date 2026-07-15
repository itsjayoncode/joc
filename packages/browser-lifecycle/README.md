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

## Why use it

| Capability       | What you get                                            |
| ---------------- | ------------------------------------------------------- |
| **Session core** | Start, stop, pause, and inspect lifecycle state         |
| **Visibility**   | `page:visible` / `page:hidden` from document visibility |
| **Focus**        | `window:focus` / `window:blur` normalization            |
| **Connectivity** | Advisory online/offline signals                         |
| **Idle**         | Activity-based idle detection                           |
| **Cross-tab**    | Leader election and tab messaging                       |
| **Plugins**      | Register hooks and inspect runtime diagnostics          |
| **SSR-safe**     | Capability helpers that work without throwing in Node   |

## Documentation

- [Package overview](https://itsjayoncode.github.io/joc/packages/browser-lifecycle/)
- [Quick start guide](https://itsjayoncode.github.io/joc/packages/browser-lifecycle/guides/quick-start)
- [Configuration](https://itsjayoncode.github.io/joc/packages/browser-lifecycle/guides/configuration)
- [Interactive playground](https://itsjayoncode.github.io/joc/packages/browser-lifecycle/playground/playground)

## Requirements

- **Node.js** 20+ (for tooling)
- **Browsers**: modern evergreen browsers; see [browser support](https://itsjayoncode.github.io/joc/packages/browser-lifecycle/guides/browser-support)

## Repository

Source, issues, and contributions:

**https://github.com/itsjayoncode/joc**

Package path: `packages/browser-lifecycle`

## License

MIT © [JayOnCode](https://github.com/itsjayoncode)
