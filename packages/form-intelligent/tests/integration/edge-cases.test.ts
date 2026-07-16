import { describe, expect, it } from "vitest";

import { createForm, required } from "../../src/index.js";

describe("integration: edge cases", () => {
  it("handles an empty form with no fields", async () => {
    const form = createForm({
      initialValues: {},
      onSubmit: async () => undefined,
    });

    expect(form.values()).toEqual({});
    expect(await form.validate()).toBe(true);
    expect(await form.submit()).toBe(true);
    form.destroy();
  });

  it("supports nested array field mutations", () => {
    const form = createForm({
      initialValues: {
        contacts: [{ email: "a@b.com" }],
      },
    });

    const path = form.pushField("contacts", { email: "c@d.com" });
    expect(path).toBe("contacts.1");
    expect(form.get("contacts.1.email")).toBe("c@d.com");

    form.insertField("contacts", 0, { email: "first@x.com" });
    expect(form.get("contacts.0.email")).toBe("first@x.com");
    expect(form.get("contacts.1.email")).toBe("a@b.com");

    form.removeField("contacts", 1);
    expect((form.get("contacts") as unknown[]).length).toBe(2);
    form.destroy();
  });

  it("coalesces rapid typing under onChange validation", async () => {
    let runs = 0;
    const form = createForm({
      initialValues: { q: "" },
      validateOn: "onChange",
      validators: {
        q: [
          async () => {
            runs += 1;
            await new Promise((resolve) => setTimeout(resolve, 20));
            return true;
          },
        ],
      },
    });

    for (const char of ["a", "ab", "abc", "abcd", "abcde"]) {
      form.setValue("q", char);
    }

    await new Promise((resolve) => setTimeout(resolve, 450));
    expect(runs).toBeLessThanOrEqual(3);
    expect(form.get("q")).toBe("abcde");
    form.destroy();
  });

  it("validates deeply nested paths", async () => {
    const form = createForm({
      initialValues: {
        profile: { address: { city: "" } },
      },
      validators: {
        "profile.address.city": [required],
      },
    });

    expect(await form.validate()).toBe(false);
    form.setValue("profile.address.city", "Manila");
    expect(await form.validate()).toBe(true);
    form.destroy();
  });
});
