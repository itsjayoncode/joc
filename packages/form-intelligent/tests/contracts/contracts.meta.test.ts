import { describe, it } from "vitest";

import {
  runFrameworkSubscribeContract,
  runPersistenceAdapterContract,
  runSchemaAdapterContract,
} from "./index.js";

import type { PersistenceAdapter, SchemaAdapter } from "../../src/adapters/index.js";

describe("contract harness meta", () => {
  it("runs SchemaAdapter contract against a fixture adapter", async () => {
    const adapter: SchemaAdapter<{ email: string }> = {
      name: "fixture-schema",
      validate(values) {
        return values.email.includes("@") ? {} : { email: "Invalid email" };
      },
    };

    await runSchemaAdapterContract({
      name: "fixture-schema",
      adapter,
      validValues: { email: "a@b.com" },
      invalidValues: { email: "bad" },
      expectedInvalidPath: "email",
    });
  });

  it("runs PersistenceAdapter contract against memory fixture", async () => {
    const store = new Map<string, Record<string, unknown>>();
    const adapter: PersistenceAdapter = {
      name: "memory",
      load(key) {
        return store.get(key) ?? null;
      },
      save(key, values) {
        store.set(key, { ...values });
      },
      clear(key) {
        store.delete(key);
      },
    };

    await runPersistenceAdapterContract(adapter);
  });

  it("runs Framework subscribe/getSnapshot contract", () => {
    runFrameworkSubscribeContract();
  });
});
