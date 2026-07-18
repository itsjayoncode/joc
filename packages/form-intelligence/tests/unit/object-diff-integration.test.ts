import { describe, expect, it, vi } from "vitest";

import { createForm } from "../../src/index.js";
import { createObjectDiffPlugin } from "../../src/plugins/index.js";

describe("object-diff integration", () => {
  it("diffFromDefaults reports changed values against initial state", async () => {
    const form = createForm({
      initialValues: { email: "", role: "member" },
    });

    form.setValue("email", "a@b.com");
    form.setValue("role", "admin");

    const diff = await form.diffFromDefaults();
    expect(diff.hasChanges).toBe(true);
    expect(
      diff.changes.some((change) => change.path === "email" && change.type === "changed"),
    ).toBe(true);
    expect(diff.changes.some((change) => change.path === "role" && change.type === "changed")).toBe(
      true,
    );

    form.destroy();
  });

  it("passes submit diff metadata when includeDiff is enabled", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    const form = createForm({
      initialValues: { email: "" },
      onSubmit,
    });

    form.setValue("email", "a@b.com");
    await form.submit({ includeDiff: true });

    expect(onSubmit).toHaveBeenCalledTimes(1);
    const [, meta] = onSubmit.mock.calls[0] as [
      { email: string },
      { changedFields: string[]; diff?: { hasChanges: boolean } },
    ];
    expect(meta.changedFields).toContain("email");
    expect(meta.diff?.hasChanges).toBe(true);
    form.destroy();
  });

  it("audits submit diffs through createObjectDiffPlugin", async () => {
    const onSubmitDiff = vi.fn();
    const form = createForm({
      initialValues: { email: "" },
      onSubmit: vi.fn(),
    });

    form.use(createObjectDiffPlugin({ onSubmitDiff }));
    form.setValue("email", "a@b.com");
    await form.submit();

    await vi.waitFor(() => {
      expect(onSubmitDiff).toHaveBeenCalledTimes(1);
    });

    const [diff, values] = onSubmitDiff.mock.calls[0] as [
      { hasChanges: boolean },
      { email: string },
    ];
    expect(diff.hasChanges).toBe(true);
    expect(values.email).toBe("a@b.com");
    form.destroy();
  });
});
