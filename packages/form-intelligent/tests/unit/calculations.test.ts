import { describe, expect, it, vi } from "vitest";

import { createForm } from "../../src/index.js";

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
});
