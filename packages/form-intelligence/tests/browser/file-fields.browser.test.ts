// @vitest-environment jsdom

import { describe, expect, it, vi } from "vitest";

import { createForm, required } from "../../src/index.js";

function mountUploadForm(): HTMLFormElement {
  document.body.innerHTML = `
    <form id="upload">
      <input name="title" type="text" />
      <input name="avatar" type="file" />
      <button type="submit">Upload</button>
    </form>
  `;
  return document.querySelector("#upload") as HTMLFormElement;
}

describe("ADR-FILE-001 Phase A — file fields", () => {
  it("reads input.files as canonical File[] and submits them", async () => {
    const formElement = mountUploadForm();
    const onSubmit = vi.fn();
    const file = new File(["hello"], "avatar.png", { type: "image/png" });

    const form = createForm({
      target: formElement,
      schema: {
        title: "text",
        avatar: "file",
      },
      onSubmit,
    });

    expect(form.get("avatar")).toEqual([]);

    const avatar = formElement.querySelector('input[name="avatar"]') as HTMLInputElement;
    Object.defineProperty(avatar, "files", {
      configurable: true,
      get: () => {
        const list = {
          0: file,
          length: 1,
          item: (index: number) => (index === 0 ? file : null),
          [Symbol.iterator]: function* () {
            yield file;
          },
        };
        return list as unknown as FileList;
      },
    });
    avatar.dispatchEvent(new Event("change", { bubbles: true }));

    expect(form.get("avatar")).toEqual([file]);

    const title = formElement.querySelector('input[name="title"]') as HTMLInputElement;
    title.value = "Profile";
    title.dispatchEvent(new Event("input", { bubbles: true }));

    formElement.requestSubmit();

    await vi.waitFor(() => {
      expect(onSubmit).toHaveBeenCalled();
    });

    const [values] = onSubmit.mock.calls[0] as [Record<string, unknown>];
    expect(values.title).toBe("Profile");
    expect(values.avatar).toEqual([file]);

    form.destroy();
  });

  it("never restores a file selection from state; clears only", () => {
    const formElement = mountUploadForm();
    const file = new File(["x"], "a.txt", { type: "text/plain" });
    const form = createForm({
      target: formElement,
      schema: { avatar: "file" },
      onSubmit: vi.fn(),
    });

    const avatar = formElement.querySelector('input[name="avatar"]') as HTMLInputElement;
    form.setValue("avatar", [file]);
    // State has files; DOM cannot be restored — value stays "".
    expect(avatar.value).toBe("");

    form.setValue("avatar", []);
    expect(avatar.value).toBe("");

    form.destroy();
  });

  it("treats empty File[] as failing required presence", async () => {
    const form = createForm({
      initialValues: { avatar: [] as File[] },
      validators: { avatar: [required] },
      onSubmit: vi.fn(),
    });
    form.markNonPersistent("avatar");

    const ok = await form.validate();
    expect(ok).toBe(false);
    expect(form.errors("avatar")).toBe("This field is required.");

    form.setValue("avatar", [new File(["x"], "a.txt")]);
    expect(await form.validate()).toBe(true);

    form.destroy();
  });

  it("omits file fields from drafts", () => {
    const storageKey = `fi-file-draft-${Math.random().toString(36).slice(2)}`;
    const file = new File(["x"], "a.txt");
    const form = createForm({
      initialValues: { title: "", avatar: [] as File[] },
      schema: { title: "text", avatar: "file" },
      workflow: {
        draft: { enabled: true, storageKey },
      },
      onSubmit: vi.fn(),
    });

    form.setValue("title", "Saved");
    form.setValue("avatar", [file]);
    form.saveDraft();

    const raw = window.localStorage.getItem(storageKey);
    expect(raw).toBeTruthy();
    expect(raw).not.toContain("a.txt");
    expect(JSON.parse(raw as string)).not.toHaveProperty("avatar");

    form.destroy();
    window.localStorage.removeItem(storageKey);
  });

  it("does not replay file values through undo", () => {
    const file = new File(["x"], "a.txt");
    const form = createForm({
      initialValues: { title: "", avatar: [] as File[] },
      schema: { title: "text", avatar: "file" },
      onSubmit: vi.fn(),
    });

    form.setValue("title", "one");
    form.setValue("avatar", [file]);
    form.setValue("title", "two");

    expect(form.undo()).toBe(true);
    expect(form.get("title")).toBe("one");
    expect(form.get("avatar")).toEqual([file]);

    form.destroy();
  });
});
