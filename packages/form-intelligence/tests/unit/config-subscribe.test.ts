import { describe, expect, it, vi } from "vitest";

import { createForm } from "../../src/index.js";

describe("createForm({ subscribe })", () => {
  it("registers a single config listener and fires once after create", () => {
    const listener = vi.fn();
    const form = createForm({
      initialValues: { email: "" },
      validateOn: "onSubmit",
      subscribe: listener,
    });

    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledWith(form);

    form.setValue("email", "a@b.co");
    expect(listener).toHaveBeenCalledTimes(2);
    expect(listener).toHaveBeenLastCalledWith(form);

    form.destroy();
  });

  it("registers multiple listeners in array order", () => {
    const order: string[] = [];
    const form = createForm({
      initialValues: { email: "" },
      validateOn: "onSubmit",
      subscribe: [
        () => {
          order.push("a");
        },
        () => {
          order.push("b");
        },
      ],
    });

    expect(order).toEqual(["a", "b"]);

    form.setValue("email", "a@b.co");
    expect(order).toEqual(["a", "b", "a", "b"]);

    form.destroy();
  });

  it("stops notifying config listeners after destroy", () => {
    const listener = vi.fn();
    const form = createForm({
      initialValues: { email: "" },
      validateOn: "onSubmit",
      subscribe: listener,
    });

    listener.mockClear();
    form.destroy();
    form.setValue("email", "a@b.co");

    expect(listener).not.toHaveBeenCalled();
  });

  it("coexists with form.subscribe() listeners", () => {
    const configListener = vi.fn();
    const form = createForm({
      initialValues: { email: "" },
      validateOn: "onSubmit",
      subscribe: configListener,
    });

    const runtimeListener = vi.fn();
    form.subscribe(runtimeListener);
    configListener.mockClear();

    form.setValue("email", "a@b.co");
    expect(configListener).toHaveBeenCalledTimes(1);
    expect(runtimeListener).toHaveBeenCalledTimes(1);

    form.destroy();
  });

  it("exposes readable state on the initial fire", () => {
    const seen: string[] = [];
    const form = createForm({
      initialValues: { email: "seed@example.com" },
      validateOn: "onSubmit",
      subscribe: (instance) => {
        seen.push(String(instance.state.values.email));
      },
    });

    expect(seen).toEqual(["seed@example.com"]);
    form.setValue("email", "next@example.com");
    expect(seen).toEqual(["seed@example.com", "next@example.com"]);

    form.destroy();
  });

  it("treats an empty subscribe array as a no-op", () => {
    const form = createForm({
      initialValues: { email: "" },
      validateOn: "onSubmit",
      subscribe: [],
    });

    const listener = vi.fn();
    form.subscribe(listener);
    form.setValue("email", "a@b.co");
    expect(listener).toHaveBeenCalledTimes(1);

    form.destroy();
  });

  it("keeps config listeners when a runtime subscribe is unsubscribed", () => {
    const configListener = vi.fn();
    const form = createForm({
      initialValues: { email: "" },
      validateOn: "onSubmit",
      subscribe: configListener,
    });

    const runtimeListener = vi.fn();
    const unsubscribe = form.subscribe(runtimeListener);
    configListener.mockClear();
    unsubscribe();

    form.setValue("email", "a@b.co");
    expect(configListener).toHaveBeenCalledTimes(1);
    expect(runtimeListener).not.toHaveBeenCalled();

    form.destroy();
  });

  it("runs after plugins registered at create time", () => {
    const order: string[] = [];
    const form = createForm({
      initialValues: { email: "" },
      validateOn: "onSubmit",
      plugins: [
        {
          name: "probe",
          setup() {
            order.push("plugin");
          },
        },
      ],
      subscribe: () => {
        order.push("subscribe");
      },
    });

    expect(order).toEqual(["plugin", "subscribe"]);
    form.destroy();
  });
});
