# Installation

<BrowserLifecycleVersion mode="install" />

Install `@jayoncode/browser-lifecycle` from npm when the package is published, or link it from the monorepo during development.

## npm

Pin the current release when you need a specific version:

```bash
npm install @jayoncode/browser-lifecycle
```

Or install the latest explicitly:

```bash
npm install @jayoncode/browser-lifecycle@latest
```

```bash
pnpm add @jayoncode/browser-lifecycle
```

```bash
yarn add @jayoncode/browser-lifecycle
```

## Monorepo development

From the JOC repository:

```bash
pnpm install
pnpm build:packages
```

Import from the workspace package:

```ts
import { createBrowserLifecycle } from "@jayoncode/browser-lifecycle";
```

## Browser support

Browser Lifecycle uses feature detection and degrades gracefully when platform APIs are unavailable. See [Browser Support](/packages/browser-lifecycle/guides/browser-support) for module-level requirements.

## Next steps

- [Quick Start](/packages/browser-lifecycle/guides/quick-start)
- [Usage Guide](/packages/browser-lifecycle/guides/usage)
- [API Reference](/packages/browser-lifecycle/api/)
