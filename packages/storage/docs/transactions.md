# Transactions

**Status:** Stable  
**Import:** `@jayoncode/storage/transactions`

**Previous:** [Diagnostics](/packages/storage/modules/diagnostics) · **Next:** [Composition](/packages/storage/modules/composition)

Same-tab batched writes with rollback on throw. Overlay journal commits only if the callback returns; throws discard staged writes. **Not** multi-tab ACID.

```ts
import { createStorage, createMemoryAdapter } from "@jayoncode/storage";
import { transaction } from "@jayoncode/storage/transactions";

const storage = createStorage({
  namespace: "app",
  adapter: createMemoryAdapter(),
});

transaction(storage, () => {
  storage.set("a", 1);
  storage.set("b", 2);
});

try {
  transaction(storage, () => {
    storage.set("a", 99);
    throw new Error("abort");
  });
} catch {
  // "a" unchanged
}

storage.get("a"); // 1
```

## Notes

- Nested `transaction` on the same instance throws `ConfigurationError`
- Read-your-writes work inside the callback
- Sync only — matches core adapters (ADR 0003)
- Not on the default export (ADR 0006)

See also: [Core](/packages/storage/modules/core) · [Errors](/packages/storage/modules/errors)
