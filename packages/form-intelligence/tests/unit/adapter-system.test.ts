import { describe, expect, it, vi } from "vitest";

import {
  isFrameworkAdapter,
  isPersistenceAdapter,
  isSchemaAdapter,
  isSubmitTransportAdapter,
  type FrameworkAdapter,
  type PersistenceAdapter,
  type SchemaAdapter,
  type SubmitTransportAdapter,
} from "../../src/adapters/index.js";
import { createForm } from "../../src/index.js";

describe("adapter system interfaces", () => {
  it("detects schema adapters", () => {
    const adapter: SchemaAdapter = {
      name: "mock-schema",
      validate: async () => ({}),
    };

    expect(isSchemaAdapter(adapter)).toBe(true);
    expect(isSchemaAdapter({ email: "email" })).toBe(false);
  });

  it("validates through a mock schema adapter", async () => {
    const form = createForm({
      initialValues: { email: "" },
      schema: {
        name: "mock-required-email",
        async validate(values) {
          return values.email ? {} : { email: "Email is required" };
        },
      } satisfies SchemaAdapter<{ email: string }>,
    });

    expect(await form.validate()).toBe(false);
    expect(form.errors("email")).toBe("Email is required");

    form.setValue("email", "user@example.com");
    expect(await form.validate()).toBe(true);
    form.destroy();
  });

  it("round-trips values through a mock persistence adapter", async () => {
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

    expect(isPersistenceAdapter(adapter)).toBe(true);

    adapter.save("draft:1", { name: "Jay" });
    expect(await adapter.load("draft:1")).toEqual({ name: "Jay" });
    adapter.clear("draft:1");
    expect(await adapter.load("draft:1")).toBeNull();
  });

  it("uses persistence adapter for draft restore", () => {
    const store = new Map<string, Record<string, unknown>>([
      ["adapter-draft", { note: "restored" }],
    ]);

    const form = createForm({
      initialValues: { note: "" },
      workflow: {
        draft: {
          enabled: true,
          storageKey: "adapter-draft",
          adapter: {
            load(key) {
              return store.get(key) ?? null;
            },
            save(key, values) {
              store.set(key, { ...values });
            },
            clear(key) {
              store.delete(key);
            },
          },
        },
      },
    });

    expect(form.get("note")).toBe("restored");
    form.destroy();
  });

  it("connects a mock framework adapter", () => {
    const disconnect = vi.fn();
    const adapter: FrameworkAdapter = {
      name: "mock-framework",
      connect(form) {
        expect(form.id).toBeTruthy();
        return disconnect;
      },
    };

    expect(isFrameworkAdapter(adapter)).toBe(true);

    const form = createForm({ initialValues: { x: "" } });
    const cleanup = adapter.connect(form);
    cleanup?.();
    expect(disconnect).toHaveBeenCalledTimes(1);
    form.destroy();
  });

  it("submits through a mock transport adapter", async () => {
    const transport: SubmitTransportAdapter<{ email: string }, { ok: true }> = {
      name: "mock-fetch",
      async submit(values, meta) {
        expect(values.email).toBe("a@b.com");
        expect(meta?.signal).toBeInstanceOf(AbortSignal);
        return { ok: true };
      },
    };

    expect(isSubmitTransportAdapter(transport)).toBe(true);

    const form = createForm({
      initialValues: { email: "a@b.com" },
      onSubmit: (values, meta) => transport.submit(values, meta),
    });

    await expect(form.submit()).resolves.toBe(true);
    form.destroy();
  });
});
