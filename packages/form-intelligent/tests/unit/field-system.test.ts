import { describe, expect, it } from "vitest";

import {
  listFieldPaths,
  remapIndexedFieldRecord,
  removeArrayItem,
} from "../../src/fields/index.js";
import { createForm } from "../../src/index.js";
import { listAllPaths } from "../../src/validation/index.js";

describe("field path listing", () => {
  it("lists nested object and array item paths", () => {
    const paths = listFieldPaths({
      user: {
        address: { city: "Manila" },
      },
      items: [{ name: "a" }, { name: "b" }],
    });

    expect(paths).toEqual(
      expect.arrayContaining([
        "user",
        "user.address",
        "user.address.city",
        "items",
        "items.0",
        "items.0.name",
        "items.1",
        "items.1.name",
      ]),
    );
  });

  it("keeps listAllPaths aligned with listFieldPaths", () => {
    const values = {
      tags: ["one", "two"],
      profile: { nickname: "jay" },
    };

    expect(listAllPaths(values)).toEqual(listFieldPaths(values));
  });
});

describe("array field helpers", () => {
  it("remaps indexed field records after removal", () => {
    const next = remapIndexedFieldRecord(
      {
        "items.0.name": "Required",
        "items.1.name": "Too short",
        "items.2.name": "Invalid",
        untouched: "stay",
      },
      "items",
      { type: "remove", index: 1 },
    );

    expect(next).toEqual({
      "items.0.name": "Required",
      "items.1.name": "Invalid",
      untouched: "stay",
    });
  });

  it("removes array items by index", () => {
    expect(removeArrayItem(["a", "b", "c"], 1)).toEqual(["a", "c"]);
  });
});

describe("form array fields", () => {
  it("pushes and removes dynamic array items", () => {
    const form = createForm({
      initialValues: { items: [{ name: "first" }] },
    });

    const secondPath = form.pushField("items", { name: "second" });
    expect(secondPath).toBe("items.1");
    expect(form.values("items")).toEqual([{ name: "first" }, { name: "second" }]);

    form.setError("items.1.name", "Required");
    form.removeField("items", 0);
    expect(form.values("items")).toEqual([{ name: "second" }]);
    expect(form.errors("items.0.name")).toBe("Required");
    form.destroy();
  });

  it("inserts array items and shifts indexed state", () => {
    const form = createForm({
      initialValues: { items: [{ name: "b" }] },
    });

    form.setError("items.0.name", "keep");
    const insertedPath = form.insertField("items", 0, { name: "a" });
    expect(insertedPath).toBe("items.0");
    expect(form.values("items")).toEqual([{ name: "a" }, { name: "b" }]);
    expect(form.errors("items.1.name")).toBe("keep");
    form.destroy();
  });
});

describe("nested field paths", () => {
  it("reads and writes deeply nested values", () => {
    const form = createForm({
      initialValues: {
        user: {
          address: { city: "" },
        },
      },
    });

    form.setValue("user.address.city", "Manila");
    expect(form.values("user.address.city")).toBe("Manila");

    const handle = form.field("user.address.city", { label: "City" });
    expect(handle.value).toBe("Manila");
    expect(form.getFieldMeta("user.address.city").label).toBe("City");
    form.destroy();
  });
});

describe("field dependency revalidation", () => {
  it("revalidates dependent fields when a source field changes", async () => {
    const form = createForm({
      initialValues: { password: "", confirm: "" },
      validateOn: "onChange",
      validators: {
        confirm: (value, context) =>
          value !== context.form.get("password") ? "Must match password" : undefined,
      },
    });

    form.field("confirm", { dependsOn: ["password"] });
    form.setValue("password", "secret");
    form.setValue("confirm", "secret");
    await form.validate({ paths: ["password", "confirm"], mode: "onSubmit" });
    expect(form.errors("confirm")).toBeUndefined();

    form.setValue("password", "changed");
    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(form.errors("confirm")).toBe("Must match password");
    form.destroy();
  });
});

describe("field registry", () => {
  it("tracks registered paths via FieldRegistry", async () => {
    const { FieldRegistry } = await import("../../src/fields/index.js");
    const registry = new FieldRegistry();
    registry.register("email");
    registry.register("email");
    expect(registry.list()).toEqual(["email"]);
    expect(registry.has("email")).toBe(true);
  });
});
