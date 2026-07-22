---
title: Recipes
description: Storage documentation for Recipes.
---

# Recipes

**Status:** Stable (guidance)  
**Package:** `@jayoncode/storage`

**Previous:** [Composition](/packages/storage/modules/composition) · **Next:** [Best practices](/packages/storage/modules/best-practices)

Copy-paste patterns. Prefer these over inventing helpers Storage intentionally rejects (e.g. a collections API).

::: tip How to use this page

| Level            | Do this                                                                                                                          |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| **Beginner**     | Copy **Preferences** or **Short-lived cache**, change `namespace`, ship                                                          |
| **Intermediate** | Use **List under one key** / **SSR-safe** patterns                                                                               |
| **Advanced**     | Combine with [Maintenance](/packages/storage/modules/maintenance) / [Snapshots](/packages/storage/modules/snapshots) in app code |
| :::              |

## Preferences (long TTL)

```ts
import { createStorage, createLocalStorageAdapter } from "@jayoncode/storage";

const prefs = createStorage({
  namespace: "app-prefs",
  adapter: createLocalStorageAdapter(),
  policies: {
    preferences: { ttl: { days: 365 } },
  },
});

prefs.set("theme", "dark", { policy: "preferences" });
```

## Short-lived cache

```ts
const cache = createStorage({
  namespace: "app-cache",
  adapter: createLocalStorageAdapter(),
  policies: {
    cache: { ttl: { minutes: 15 } },
  },
});

cache.set("feed", data, { policy: "cache" });
```

## List under one key (no collections API)

Store an array value; mutate in the app. Storage stays a persistence layer.

```ts
type Todo = { id: string; title: string };

const storage = createStorage<Todo[]>({
  namespace: "app",
  adapter: createLocalStorageAdapter(),
});

function addTodo(todo: Todo): void {
  const list = storage.get("todos") ?? [];
  storage.set("todos", [...list, todo]);
}
```

## Multi-key update with rollback

```ts
import { transaction } from "@jayoncode/storage/transactions";

transaction(storage, () => {
  storage.set("profile", profile);
  storage.set("profile:meta", { savedAt: Date.now() });
});
```

## Sweep expired entries

```ts
import { cleanup } from "@jayoncode/storage/maintenance";

cleanup(storage, { removeInvalid: true });
```

## Form drafts

Form Intelligence owns draft UX. Storage may hold opaque blobs later — do not rebuild draft UX here.

See also: [Overview](/packages/storage/overview) · [Core](/packages/storage/modules/core) · [Transactions](/packages/storage/modules/transactions)
