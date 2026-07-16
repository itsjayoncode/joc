import { describe, expect, it, vi } from "vitest";

import { createForm } from "../../src/index.js";
import {
  FormStateStore,
  createCoreSnapshot,
  createValuesSnapshot,
  selectFieldState,
  selectIsChanged,
  selectIsDirty,
  selectValues,
} from "../../src/state/index.js";

describe("FormStateStore", () => {
  it("tracks dirty and changed flags independently", () => {
    const store = new FormStateStore({
      values: { email: "user@example.com", note: "" },
      defaultValues: { email: "", note: "" },
    });

    store.setValueAt("email", "user@example.com");
    store.updateValueMeta("email", "user@example.com");
    store.setValueAt("note", "hello");
    store.updateValueMeta("note", "hello");

    expect(store.isDirty()).toBe(true);
    expect(store.dirtyFields()).toEqual(expect.arrayContaining(["email", "note"]));
    expect(store.isChanged()).toBe(true);

    store.markSubmitted();
    expect(store.isChanged()).toBe(false);
    expect(store.isDirty()).toBe(true);
  });

  it("keeps immutable snapshots when cloning values", () => {
    const store = new FormStateStore({
      values: { count: 1 },
      defaultValues: { count: 0 },
    });

    const snapshot = createCoreSnapshot(store.getSnapshot());
    snapshot.values.count = 99;

    expect(store.getValue("count")).toBe(1);
    expect(createValuesSnapshot(store.getValues()).count).toBe(1);
  });

  it("notifies subscribers on meta updates", () => {
    const store = new FormStateStore({
      values: { name: "" },
      defaultValues: { name: "" },
    });
    const listener = vi.fn();
    store.subscribe(listener);
    store.patchMeta("name", { touched: true });
    expect(listener).toHaveBeenCalledTimes(1);
  });
});

describe("state selectors", () => {
  it("selects values, dirty, and field state from form snapshots", () => {
    const form = createForm({
      initialValues: { email: "" },
      validateOn: "onSubmit",
    });

    form.setValue("email", "user@example.com");
    const snapshot = form.getFormState();

    expect(selectValues(snapshot).email).toBe("user@example.com");
    expect(selectIsDirty(snapshot)).toBe(true);
    expect(selectFieldState("email")(snapshot)).toEqual({
      touched: false,
      dirty: true,
      visited: false,
      changed: true,
    });
    form.destroy();
  });
});

describe("changed since submit", () => {
  it("clears changed flags after successful submit", async () => {
    const form = createForm({
      initialValues: { email: "" },
      onSubmit: () => undefined,
    });

    form.setValue("email", "user@example.com");
    expect(selectIsChanged(form.getFormState())).toBe(true);

    await form.submit();
    expect(selectIsChanged(form.getFormState())).toBe(false);
    expect(form.changedSinceSubmitFields()).toEqual([]);

    form.setValue("email", "other@example.com");
    expect(form.changedSinceSubmitFields()).toContain("email");
    form.destroy();
  });
});
