# Installation

Install `@jayoncode/browser-lifecycle` from npm when the package is published, or link it from the monorepo during development.

## npm

```bash
npm install @jayoncode/browser-lifecycle
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

Browser Lifecycle uses feature detection and degrades gracefully when platform APIs are unavailable. See [Browser Support](/guides/browser-lifecycle/browser-support) for module-level requirements.

## Next steps

- [Quick Start](/guides/browser-lifecycle/quick-start)
- [Usage Guide](/guides/browser-lifecycle/usage)
- [API Reference](/api/browser-lifecycle/)
