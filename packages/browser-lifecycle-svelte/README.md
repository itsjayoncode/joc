# Browser Lifecycle Svelte

Svelte adapter for [`@jayoncode/browser-lifecycle`](../browser-lifecycle/README.md).

Thin wrappers only — no browser observation logic. Context helpers + readable snapshot store.

## Install

```bash
npm install @jayoncode/browser-lifecycle @jayoncode/browser-lifecycle-svelte
```

## Usage

```svelte
<script>
  import { createBrowserLifecycleContext } from "@jayoncode/browser-lifecycle-svelte";

  const { snapshot, lifecycle } = createBrowserLifecycleContext();
</script>

<p>{$snapshot.visibility}</p>
```

Or adopt an existing session: `createBrowserLifecycleContext({ lifecycle })`.
