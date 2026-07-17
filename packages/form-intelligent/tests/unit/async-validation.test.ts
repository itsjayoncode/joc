// @vitest-environment jsdom

import { describe, expect, it, vi } from "vitest";

import { asyncValidator, createForm } from "../../src/index.js";

describe("async validation UX", () => {
  it("exposes per-field isValidating during async checks", async () => {
    const form = createForm({
      initialValues: { username: "" },
      validateOn: "onBlur",
      validators: {
        username: [
          async (value) => {
            await new Promise((resolve) => setTimeout(resolve, 50));
            return value === "taken" ? "Username already exists" : true;
          },
        ],
      },
    });

    form.setValue("username", "taken");
    const pending = form.validate({ paths: ["username"] });
    expect(form.state.fieldMeta.username?.isValidating).toBe(true);
    await pending;
    expect(form.state.fieldMeta.username?.isValidating).toBe(false);
    expect(form.errors("username")).toBe("Username already exists");
    form.destroy();
  });

  it("debounces onChange validation to a single latest run", async () => {
    const validator = vi.fn(async (value: unknown) => (value === "abc" ? true : "invalid"));
    const form = createForm({
      initialValues: { email: "" },
      validateOn: "onChange",
      validators: { email: [validator] },
    });

    form.setValue("email", "a");
    form.setValue("email", "ab");
    form.setValue("email", "abc");
    await new Promise((resolve) => setTimeout(resolve, 400));

    expect(validator).toHaveBeenCalledTimes(1);
    expect(validator).toHaveBeenCalledWith("abc", expect.anything());
    expect(form.errors("email")).toBeUndefined();
    form.destroy();
  });

  it("does not apply aborted validation errors", async () => {
    let releaseSlow: (() => void) | undefined;
    const slowGate = new Promise<void>((resolve) => {
      releaseSlow = resolve;
    });

    const form = createForm({
      initialValues: { username: "" },
      validateOn: "onBlur",
      validators: {
        username: [
          asyncValidator(async (value, ctx) => {
            if (value === "stale") {
              await slowGate;
              if (ctx.signal?.aborted) {
                throw new DOMException("Aborted", "AbortError");
              }
              return "stale error";
            }
            return value === "fresh" ? "fresh error" : true;
          }),
        ],
      },
    });

    form.setValue("username", "stale");
    const stale = form.validate({ paths: ["username"] });
    form.setValue("username", "fresh");
    const fresh = form.validate({ paths: ["username"] });

    releaseSlow?.();
    await Promise.all([stale, fresh]);

    expect(form.errors("username")).toBe("fresh error");
    expect(form.state.isValidating).toBe(false);
    expect(form.getFieldMeta("username").isValidating).toBe(false);
    form.destroy();
  });

  it("clears validating flags on destroy mid-flight", async () => {
    const form = createForm({
      initialValues: { username: "" },
      validateOn: "onBlur",
      validators: {
        username: [
          async () => {
            await new Promise((resolve) => setTimeout(resolve, 200));
            return "late";
          },
        ],
      },
    });

    const pending = form.validate({ paths: ["username"] });
    expect(form.getFieldMeta("username").isValidating).toBe(true);
    form.destroy();
    await pending;
    expect(form.getFieldMeta("username").isValidating).toBe(false);
  });

  it("superseded onChange schedules resolve without hanging", async () => {
    const form = createForm({
      initialValues: { email: "" },
      validateOn: "onChange",
      validators: {
        email: [async () => true],
      },
    });

    const first = form.validate({ paths: ["email"], mode: "onChange" });
    const second = form.validate({ paths: ["email"], mode: "onChange" });

    const firstResult = await Promise.race([
      first,
      new Promise<"timeout">((resolve) =>
        setTimeout(() => {
          resolve("timeout");
        }, 50),
      ),
    ]);
    expect(firstResult).toBe(false);

    await new Promise((resolve) => setTimeout(resolve, 400));
    await expect(second).resolves.toBe(true);
    form.destroy();
  });
});
