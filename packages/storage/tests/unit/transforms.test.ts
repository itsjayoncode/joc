import { describe, expect, it } from "vitest";

import {
  ConfigurationError,
  createMemoryAdapter,
  createStorage,
  defaultDeserialize,
  defaultSerialize,
  SerializationError,
} from "../../src/index.js";
import { withPayloadTransforms } from "../../src/transforms/index.js";

describe("withPayloadTransforms", () => {
  it("round-trips compress + encrypt hooks", () => {
    const { serialize, deserialize } = withPayloadTransforms(
      { serialize: defaultSerialize, deserialize: defaultDeserialize },
      {
        compress: (plain) => `c:${plain}`,
        decompress: (wire) => wire.slice(2),
        encrypt: (plain) => `e:${plain}`,
        decrypt: (wire) => wire.slice(2),
      },
    );

    const storage = createStorage({
      namespace: "xf",
      adapter: createMemoryAdapter(),
      serialize,
      deserialize,
    });

    storage.set("k", { hello: "world" });
    expect(storage.get("k")).toEqual({ hello: "world" });
  });

  it("requires compress/decompress pairs", () => {
    expect(() =>
      withPayloadTransforms(
        { serialize: defaultSerialize, deserialize: defaultDeserialize },
        { compress: (s) => s },
      ),
    ).toThrow(ConfigurationError);
  });

  it("surfaces decrypt failures as SerializationError on get", () => {
    const { serialize, deserialize } = withPayloadTransforms(
      { serialize: defaultSerialize, deserialize: defaultDeserialize },
      {
        encrypt: (plain) => plain,
        decrypt: () => {
          throw new Error("bad key");
        },
      },
    );

    const storage = createStorage({
      namespace: "xf",
      adapter: createMemoryAdapter(),
      serialize,
      deserialize,
    });

    storage.set("k", 1);
    expect(() => storage.get("k")).toThrow(SerializationError);
  });

  it("plain when no transforms", () => {
    const pair = withPayloadTransforms({
      serialize: defaultSerialize,
      deserialize: defaultDeserialize,
    });
    const storage = createStorage({
      namespace: "xf",
      adapter: createMemoryAdapter(),
      serialize: pair.serialize,
      deserialize: pair.deserialize,
    });
    storage.set("k", "ok");
    expect(storage.get("k")).toBe("ok");
  });
});
