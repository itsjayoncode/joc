# Tutorial — your first storage instance

Ten minutes: install, save a value, read it back, then optionally use a TTL policy.

**Previous:** [Overview](/packages/storage/overview) · **Next:** [Core concepts](/packages/storage/modules/concepts)

::: info Playground
Prefer clicking over coding first? Open the [Storage Lab](/playground/storage/) and use **Set** / **Get** — same ideas as below.
:::

**Prerequisites:** a browser or Node app that can import ESM / TypeScript.

### Who is this for?

| Path            | After this tutorial                                                                                          |
| --------------- | ------------------------------------------------------------------------------------------------------------ |
| **Beginner**    | Read [Concepts](/packages/storage/modules/concepts), then copy a [Recipe](/packages/storage/modules/recipes) |
| **Experienced** | Skim steps 2–3, jump to [Core](/packages/storage/modules/core) for options / migrate                         |

---

## Step 1 — Install

```bash
npm install @jayoncode/storage
```

(`pnpm add` / `yarn add` work the same — see [Overview → Install](/packages/storage/overview#install).)

**Outcome:** You can import from `@jayoncode/storage`.

---

## Step 2 — Create a store (memory)

Memory is perfect for learning — nothing touches the real browser yet.

```ts
import { createStorage, createMemoryAdapter } from "@jayoncode/storage";

const storage = createStorage({
  namespace: "demo",
  adapter: createMemoryAdapter(),
});
```

**Outcome:** A sync API bound to the `demo` namespace.

::: tip Going to production later
Swap `createMemoryAdapter()` for `createLocalStorageAdapter()` (survive reload) or `createSessionStorageAdapter()` (tab only). Details: [Core → Adapters](/packages/storage/modules/core#adapters).
:::

---

## Step 3 — Save and load

```ts
storage.set("greeting", "hello");

storage.get("greeting"); // "hello"
storage.has("greeting"); // true
storage.remove("greeting");
storage.get("greeting"); // null
```

**Outcome:** Round-trip works. Missing keys return `null` (not a thrown error).

### Optional: peek at metadata

```ts
storage.set("greeting", "hello");
storage.peek("greeting");
// { v: 1, schemaVersion: "1", savedAt: …, value: "hello", expiresAt?: … }
```

Beginners can ignore `peek` until they care about expiry or schema version.

---

## Step 4 — Add expiry (optional)

**Option A — one-off TTL on the write**

```ts
storage.set("flash", "soon gone", { ttl: { minutes: 5 } });
```

**Option B — named policy (reusable)**

```ts
const storage = createStorage({
  namespace: "demo",
  adapter: createMemoryAdapter(),
  policies: {
    cache: { ttl: { minutes: 15 } },
  },
});

storage.set("feed", { items: [] }, { policy: "cache" });
```

**Outcome:** Values can expire. After expiry, `get` returns `null` (Storage deletes the stale entry when you read it).

Watch the countdown in the Lab’s [TTL page](/playground/storage/ttl).

---

## Step 5 — Clean up keys

```ts
storage.remove("feed"); // one key
// storage.clear();    // entire namespace (needs adapter.keys — built-ins have it)
```

**Outcome:** You know how to delete data on purpose.

---

## Checkpoint — you now know

- [x] Create a namespaced store
- [x] `set` / `get` / `remove`
- [x] Soft `null` when missing
- [x] Optional TTL / policies

## What’s next

| Goal                              | Page                                                        |
| --------------------------------- | ----------------------------------------------------------- |
| Understand envelopes & adapters   | [Core concepts](/packages/storage/modules/concepts)         |
| Copy prefs / cache patterns       | [Recipes](/packages/storage/modules/recipes)                |
| Full option tables                | [Core](/packages/storage/modules/core)                      |
| Quota / typed errors              | [Errors](/packages/storage/modules/errors)                  |
| Sweep / backup / watch (advanced) | [Maintenance](/packages/storage/modules/maintenance) onward |
