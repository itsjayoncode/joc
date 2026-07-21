# Best practices

**Status:** Stable (guidance)

**Previous:** [Recipes](/packages/storage/modules/recipes) · **Next:** [FAQ](/packages/storage/modules/faq)

## Namespaces

One concern per namespace. Never put `:` in namespace or key.

## TTL & policies

Prefer named policies for recurring TTLs. Resolution: per-write `ttl` → policy → instance default → none. Use `cleanup()` when you need quota back without reading every key.

## Migrations

Bump `schemaVersion` when the value shape changes; ship `migrate` before readers expect the new version. `has` / `peek` do not migrate — call `get`.

## Adapters

| Need              | Adapter                         |
| ----------------- | ------------------------------- |
| Tests / ephemeral | `createMemoryAdapter()`         |
| Survive reload    | `createLocalStorageAdapter()`   |
| Tab scoped        | `createSessionStorageAdapter()` |

Never auto-select. On SSR, avoid web adapters until the client, or use memory.

## Capabilities

Import Experimental subpaths only when needed. `transaction` is same-tab batching, not multi-tab ACID. `observe` is in-process only.

## When not to use Storage

Reactive app state, Form Intelligence drafts, large queryable datasets, or secrets that must survive XSS.

See also: [Recipes](/packages/storage/modules/recipes) · [faq.md](./faq.md) · [Security](/packages/storage/modules/security)
