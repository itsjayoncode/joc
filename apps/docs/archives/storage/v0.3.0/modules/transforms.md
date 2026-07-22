---
title: Transforms
description: Storage documentation for Transforms.
---

# Transforms

**Status:** Stable (0.3)  
**Import:** `@jayoncode/storage/transforms`

**Previous:** [Quota](/packages/storage/modules/quota) · **Next:** [Composition](/packages/storage/modules/composition)

Package-local payload codecs for sync Storage. Compose into the existing pluggable `serialize` / `deserialize` options — **not** a JOC-wide plugin host.

```ts
import {
  createStorage,
  createMemoryAdapter,
  defaultSerialize,
  defaultDeserialize,
} from "@jayoncode/storage";
import { withPayloadTransforms } from "@jayoncode/storage/transforms";

const { serialize, deserialize } = withPayloadTransforms(
  { serialize: defaultSerialize, deserialize: defaultDeserialize },
  {
    // App-owned sync string → string hooks (examples only)
    compress: (plain) => plain,
    decompress: (wire) => wire,
    encrypt: (plain) => plain,
    decrypt: (wire) => wire,
  },
);

const storage = createStorage({
  namespace: "app",
  adapter: createMemoryAdapter(),
  serialize,
  deserialize,
});
```

## Pipeline

| Direction | Order                                      |
| --------- | ------------------------------------------ |
| Write     | `serialize` → `compress?` → `encrypt?`     |
| Read      | `decrypt?` → `decompress?` → `deserialize` |

## Rules

| Rule      | Detail                                                                                                               |
| --------- | -------------------------------------------------------------------------------------------------------------------- |
| Opt-in    | Omit hooks → plaintext (same as core defaults)                                                                       |
| Pairs     | `compress`⇔`decompress` and `encrypt`⇔`decrypt` must both be set or both omitted                                     |
| Sync only | Hooks are sync `string → string` (async Storage transforms deferred)                                                 |
| Keys      | App-owned — Storage does not ship algorithms or a key vault                                                          |
| Trust     | XSS / same-origin script can still reach key material in memory — see [Security](/packages/storage/modules/security) |

## Lab

Optional **demo base64 codec** is a reversible wire format for teaching — **not** encryption.

See also: [Core](/packages/storage/modules/core) · [Quota](/packages/storage/modules/quota) · [Security](/packages/storage/modules/security)
