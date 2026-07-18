import { describe, expect, it, vi } from "vitest";

import { createForm } from "../../src/index.js";

describe("config normalization", () => {
  it("parses autoSave.every shorthand", async () => {
    const onSave = vi.fn();
    const form = createForm({
      initialValues: { note: "" },
      autoSave: { every: "200ms", onSave },
    });

    form.setValue("note", "autosaved");
    await new Promise((resolve) => setTimeout(resolve, 350));
    expect(onSave).toHaveBeenCalledWith({ note: "autosaved" });
    form.destroy();
  });

  it("expands wizard true shorthand", () => {
    const form = createForm({
      initialValues: { a: "" },
      wizard: true,
    });

    expect(form.state.workflow.totalSteps).toBe(3);
    form.destroy();
  });
});
