// @vitest-environment jsdom

import { describe, expect, it } from "vitest";

import {
  accept,
  createForm,
  maxFiles,
  maxSize,
  minFiles,
  minSize,
  parseByteSize,
  required,
} from "../../src/index.js";

describe("ADR-FILE-001 Phase B — file validators and payload", () => {
  it("parses human byte sizes", () => {
    expect(parseByteSize(1024)).toBe(1024);
    expect(parseByteSize("5MB")).toBe(5_000_000);
    expect(parseByteSize("1 KiB")).toBe(1024);
  });

  it("validates accept, size, and file count", async () => {
    const png = new File(["x"], "a.png", { type: "image/png" });
    const txt = new File(["x"], "a.txt", { type: "text/plain" });
    const big = new File([new Uint8Array(2_000)], "big.png", { type: "image/png" });

    const form = createForm({
      initialValues: { avatar: [] as File[] },
      schema: { avatar: "file" },
      validators: {
        avatar: [required, accept("image/*"), maxSize(1000), maxFiles(1)],
      },
      onSubmit: () => undefined,
    });

    expect(await form.validate()).toBe(false);

    form.setValue("avatar", [txt]);
    expect(await form.validate()).toBe(false);
    expect(String(form.errors("avatar"))).toMatch(/not allowed/i);

    form.setValue("avatar", [big]);
    expect(await form.validate()).toBe(false);
    expect(String(form.errors("avatar"))).toMatch(/too large/i);

    form.setValue("avatar", [png, png]);
    expect(await form.validate()).toBe(false);
    expect(String(form.errors("avatar"))).toMatch(/at most/i);

    form.setValue("avatar", [png]);
    expect(await form.validate()).toBe(true);

    form.destroy();
  });

  it("supports minSize and minFiles", async () => {
    const tiny = new File(["x"], "a.bin", { type: "application/octet-stream" });
    const form = createForm({
      initialValues: { docs: [] as File[] },
      schema: { docs: "file" },
      validators: {
        docs: [minFiles(2), minSize(10)],
      },
      onSubmit: () => undefined,
    });

    form.setValue("docs", [tiny]);
    expect(await form.validate()).toBe(false);

    const larger = new File([new Uint8Array(20)], "b.bin", { type: "application/octet-stream" });
    form.setValue("docs", [larger, larger]);
    expect(await form.validate()).toBe(true);

    form.destroy();
  });

  it("builds FormData and payload()", () => {
    const file = new File(["hello"], "a.txt", { type: "text/plain" });
    const form = createForm({
      initialValues: { title: "Hi", avatar: [] as File[] },
      schema: { title: "text", avatar: "file" },
      onSubmit: () => undefined,
    });

    expect(form.payload().kind).toBe("json");

    form.setValue("avatar", [file]);
    const payload = form.payload();
    expect(payload.kind).toBe("multipart");
    if (payload.kind !== "multipart") {
      throw new Error("expected multipart");
    }
    expect(payload.formData.get("title")).toBe("Hi");
    expect(payload.formData.get("avatar")).toBeInstanceOf(File);

    const fd = form.toFormData();
    expect(fd.get("avatar")).toBeInstanceOf(File);

    form.destroy();
  });

  it("returns file-shaped bind() without value", () => {
    const form = createForm({
      initialValues: { avatar: [] as File[] },
      schema: { avatar: "file" },
      onSubmit: () => undefined,
    });

    const binding = form.field("avatar").bind();
    expect(binding.kind).toBe("file");
    if (binding.kind !== "file") {
      throw new Error("expected file binding");
    }
    expect(binding.files).toEqual([]);
    expect("value" in binding).toBe(false);

    const file = new File(["x"], "a.txt");
    binding.onChange([file]);
    expect(form.get("avatar")).toEqual([file]);

    const titleForm = createForm({
      initialValues: { title: "" },
      onSubmit: () => undefined,
    });
    const text = titleForm.field("title").bind();
    expect(text.kind === undefined || text.kind === "value").toBe(true);
    titleForm.destroy();

    form.destroy();
  });
});
