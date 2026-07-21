import { bench, describe } from "vitest";

import { createMemoryAdapter, createStorage } from "@jayoncode/storage";

describe("storage microbench (memory)", () => {
  const storage = createStorage({
    namespace: "bench",
    adapter: createMemoryAdapter(),
    ttl: { minutes: 30 },
  });
  const payload = { n: 1, label: "bench", nested: { ok: true } };

  storage.set("warm", payload);

  bench("set overwrite", () => {
    storage.set("warm", payload);
  });

  bench("get hit", () => {
    storage.get("warm");
  });

  bench("peek hit", () => {
    storage.peek("warm");
  });
});
