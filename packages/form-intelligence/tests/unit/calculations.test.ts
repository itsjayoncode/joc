import { describe, expect, it, vi } from "vitest";

// @vitest-environment jsdom

import { ConfigurationError, createForm } from "../../src/index.js";

describe("form.calculate", () => {
  it("recomputes derived fields when dependencies change", async () => {
    const form = createForm({
      initialValues: { price: 10, quantity: 2, total: 0 },
    });

    form.calculate("total", ({ values }) => Number(values.price) * Number(values.quantity));
    await vi.waitFor(() => {
      expect(form.get("total")).toBe(20);
    });

    form.setValue("quantity", 5);
    await vi.waitFor(() => {
      expect(form.get("total")).toBe(50);
    });
    form.destroy();
  });

  it("supports fluent from().compute()", () => {
    const form = createForm({
      initialValues: { price: 3, quantity: 4, total: 0 },
    });

    form
      .calculate("total")
      .from("price", "quantity")
      .compute(({ values, get }) => Number(get("price")) * Number(values.quantity));

    expect(form.get("total")).toBe(12);
    form.setValue("price", 5);
    expect(form.get("total")).toBe(20);
    form.destroy();
  });

  it("respects markDirty on derived writes", () => {
    const form = createForm({
      initialValues: { a: 1, b: 0 },
    });

    form
      .calculate("b")
      .from("a")
      .markDirty()
      .compute(({ get }) => Number(get("a")) * 2);
    expect(form.get("b")).toBe(2);
    expect(form.getFieldState("b").dirty).toBe(true);
    form.destroy();
  });

  it("lazy skips initial compute until a dep changes", () => {
    const form = createForm({
      initialValues: { a: 1, b: 99 },
    });

    form
      .calculate("b")
      .from("a")
      .lazy()
      .compute(({ get }) => Number(get("a")) + 1);
    expect(form.get("b")).toBe(99);
    form.setValue("a", 2);
    expect(form.get("b")).toBe(3);
    form.destroy();
  });

  it("memoized skips redundant compute", () => {
    const compute = vi.fn(({ get }: { get: (path: string) => unknown }) => Number(get("a")) * 2);
    const form = createForm({
      initialValues: { a: 1, b: 0 },
    });

    form.calculate("b").from("a").memoized().compute(compute);
    expect(compute).toHaveBeenCalledTimes(1);
    form.setValue("a", 1);
    expect(compute).toHaveBeenCalledTimes(1);
    form.setValue("a", 2);
    expect(compute).toHaveBeenCalledTimes(2);
    expect(form.get("b")).toBe(4);
    form.destroy();
  });

  it("throws ConfigurationError on calculation cycles", () => {
    const form = createForm({
      initialValues: { a: 1, b: 2 },
    });

    form
      .calculate("a")
      .from("b")
      .compute(({ get }) => Number(get("b")) + 1);
    expect(() => {
      form
        .calculate("b")
        .from("a")
        .compute(({ get }) => Number(get("a")) + 1);
    }).toThrow(ConfigurationError);
    form.destroy();
  });

  it("guards against unstable multi-pass loops", () => {
    const form = createForm({
      initialValues: { a: 0, b: 0 },
    });

    // Each write triggers the other forever via missing explicit cycle edges
    // (deps omitted → all keys are deps).
    form.calculate("a", ({ values }) => Number(values.b) + 1);
    expect(() => {
      form.calculate("b", ({ values }) => Number(values.a) + 1);
    }).toThrow(/Calculation loop|Calculation cycle/);
    form.destroy();
  });
});
