import { describe, expect, it, vi } from "vitest";

import { asyncValidator, createForm } from "../../src/index.js";
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

  it("keeps getSnapshot referential identity until patched", () => {
    const store = new FormStateStore({
      values: { email: "" },
      defaultValues: { email: "" },
    });

    const a = store.getSnapshot();
    const b = store.getSnapshot();
    expect(a).toBe(b);

    store.patchCore({ isSubmitting: true });
    expect(store.getSnapshot()).not.toBe(a);
  });
});

describe("form getSnapshot identity", () => {
  it("returns the same FormState reference between notifies", () => {
    const form = createForm({
      initialValues: { email: "" },
      validateOn: "onSubmit",
    });

    const first = form.getSnapshot();
    const second = form.getSnapshot();
    expect(first).toBe(second);
    expect(form.state).toBe(first);

    const listener = vi.fn();
    form.subscribe(listener);
    form.setValue("email", "a@b.co");
    expect(listener).toHaveBeenCalled();
    expect(form.getSnapshot()).not.toBe(first);
    expect(form.getSnapshot()).toBe(form.state);

    form.destroy();
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

describe("field meta completeness", () => {
  it("exposes label/description/hidden and isValidating on fieldMeta", async () => {
    let resolveCheck!: (ok: boolean) => void;
    const pending = new Promise<boolean>((resolve) => {
      resolveCheck = resolve;
    });

    const form = createForm({
      initialValues: { username: "" },
      validateOn: "onSubmit",
      validators: {
        username: [
          asyncValidator(async () => {
            const ok = await pending;
            return ok || "taken";
          }),
        ],
      },
    });

    form.field("username", {
      label: "Username",
      description: "Public handle",
      hidden: false,
    });

    const validatePromise = form.validate({ paths: ["username"], mode: "onBlur" });
    await Promise.resolve();
    expect(form.getFieldMeta("username").isValidating).toBe(true);
    expect(form.getSnapshot().fieldMeta.username?.isValidating).toBe(true);
    expect(form.getSnapshot().fieldMeta.username?.label).toBe("Username");
    expect(form.getSnapshot().fieldMeta.username?.description).toBe("Public handle");

    resolveCheck(true);
    await validatePromise;
    expect(form.getFieldMeta("username").isValidating).toBe(false);
    form.destroy();
  });
});

describe("createCheckpoint / restoreCheckpoint", () => {
  it("round-trips values and optional meta without clashing with getSnapshot", () => {
    const form = createForm({
      initialValues: { email: "", note: "" },
      validateOn: "onSubmit",
    });

    form.setValue("email", "user@example.com");
    form.setError("email", "fix");
    const live = form.getSnapshot();

    const checkpoint = form.createCheckpoint({
      include: ["values", "errors", "touched", "dirty", "visited", "workflow"],
    });
    expect(checkpoint.kind).toBe("checkpoint");
    expect(checkpoint.version).toBe(1);
    expect(checkpoint.values.email).toBe("user@example.com");
    expect(checkpoint.errors?.email).toBe("fix");

    form.setValue("email", "other@example.com");
    form.clearErrors("email");
    expect(form.getSnapshot()).not.toBe(live);

    form.restoreCheckpoint(checkpoint);
    expect(form.values("email")).toBe("user@example.com");
    expect(form.errors("email")).toBe("fix");
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
