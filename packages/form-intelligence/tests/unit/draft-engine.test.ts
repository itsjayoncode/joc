// @vitest-environment jsdom

import "fake-indexeddb/auto";

import { describe, expect, it, vi } from "vitest";

import {
  applyDraftRestore,
  clearDraft,
  createIndexedDbDraftStorage,
  loadDraft,
  loadDraftAsync,
  mergeDraftValues,
  sanitizeDraftRecord,
  saveDraft,
  saveDraftAsync,
  wrapDraftEnvelope,
} from "../../src/draft/index.js";
import { createForm, DraftStorageError } from "../../src/index.js";
import { DraftManager } from "../../src/workflow/drafts.js";

describe("draft pollution-safe merge", () => {
  it("strips dangerous keys from draft payloads", () => {
    const polluted = JSON.parse('{"email":"a@b.com","__proto__":{"polluted":true}}') as Record<
      string,
      unknown
    >;
    const safe = sanitizeDraftRecord(polluted);
    expect(safe).toEqual({ email: "a@b.com" });
    expect(Object.prototype).not.toHaveProperty("polluted");
  });

  it("overlay merge ignores pollution keys", () => {
    const merged = mergeDraftValues({ email: "", name: "Default" }, {
      email: "a@b.com",
      __proto__: { x: 1 },
    } as Record<string, unknown>);
    expect(merged).toEqual({ email: "a@b.com", name: "Default" });
  });
});

describe("draft envelope + migrate", () => {
  it("wraps and restores versioned envelopes", () => {
    const envelope = wrapDraftEnvelope(
      { email: "a@b.com" },
      { versioning: true, schemaVersion: "2", formId: "form-1" },
    );
    expect(envelope).toMatchObject({
      version: 1,
      schemaVersion: "2",
      values: { email: "a@b.com" },
    });

    const applied = applyDraftRestore({
      defaults: { email: "", name: "X" },
      raw: envelope as Record<string, unknown>,
      envelope: { versioning: true, schemaVersion: "2" },
    });
    expect(applied.restored).toBe(true);
    expect(applied.values).toEqual({ email: "a@b.com", name: "X" });
  });

  it("runs migrateDraft before apply", () => {
    const envelope = wrapDraftEnvelope(
      { email: "old@x.com" },
      { versioning: true, schemaVersion: "1" },
    ) as Record<string, unknown>;

    const applied = applyDraftRestore({
      defaults: { email: "" },
      raw: envelope,
      envelope: {
        versioning: true,
        schemaVersion: "2",
        migrateDraft: (current) => ({
          ...current,
          schemaVersion: "2",
          values: { email: "migrated@x.com" },
        }),
      },
    });

    expect(applied.values.email).toBe("migrated@x.com");
  });
});

describe("promptOnRestore decline", () => {
  it("skips init restore when prompt declines", () => {
    saveDraft("prompt-decline-draft", { email: "saved@x.com" });
    const form = createForm({
      initialValues: { email: "" },
      workflow: {
        draft: {
          enabled: true,
          storageKey: "prompt-decline-draft",
          promptOnRestore: true,
          onRestorePrompt: () => false,
        },
      },
    });

    expect(form.values("email")).toBe("");
    form.destroy();
    clearDraft("prompt-decline-draft");
  });

  it("skips restoreDraft when prompt declines", async () => {
    const form = createForm({
      initialValues: { email: "" },
      workflow: {
        draft: {
          enabled: true,
          storageKey: "prompt-restore-draft",
          onRestorePrompt: () => false,
        },
      },
    });

    form.setValue("email", "live@x.com");
    form.saveDraft();
    form.reset();

    await expect(form.restoreDraft({ prompt: true })).resolves.toBe(false);
    expect(form.values("email")).toBe("");
    form.destroy();
    clearDraft("prompt-restore-draft");
  });
});

describe("restoreDraft after mount", () => {
  it("restores saved values on demand", async () => {
    const form = createForm({
      initialValues: { email: "", name: "Jay" },
      workflow: {
        draft: { enabled: true, storageKey: "restore-after-mount" },
      },
    });

    form.setValue("email", "saved@x.com");
    form.saveDraft();
    form.reset();
    expect(form.values("email")).toBe("");

    await expect(form.restoreDraft()).resolves.toBe(true);
    expect(form.values()).toEqual({ email: "saved@x.com", name: "Jay" });
    form.destroy();
    clearDraft("restore-after-mount");
  });

  it("ignores late restore when dirty unless force", async () => {
    const form = createForm({
      initialValues: { email: "" },
      workflow: {
        draft: { enabled: true, storageKey: "restore-dirty" },
      },
    });

    form.setValue("email", "draft@x.com");
    form.saveDraft();
    form.reset();
    form.setValue("email", "user-typing@x.com");

    await expect(form.restoreDraft()).resolves.toBe(false);
    expect(form.values("email")).toBe("user-typing@x.com");

    await expect(form.restoreDraft({ force: true })).resolves.toBe(true);
    expect(form.values("email")).toBe("draft@x.com");
    form.destroy();
    clearDraft("restore-dirty");
  });

  it("supports replace merge mode", async () => {
    const form = createForm({
      initialValues: { email: "", name: "Default" },
      workflow: {
        draft: { enabled: true, storageKey: "restore-replace" },
      },
    });

    saveDraft("restore-replace", { email: "only@x.com" });
    form.reset();

    await expect(form.restoreDraft({ merge: "replace" })).resolves.toBe(true);
    expect(form.values()).toEqual({ email: "only@x.com" });
    form.destroy();
    clearDraft("restore-replace");
  });

  it("clears draft after successful submit", async () => {
    const form = createForm({
      initialValues: { email: "a@b.com" },
      workflow: {
        draft: { enabled: true, storageKey: "clear-on-submit" },
      },
      onSubmit: vi.fn(),
    });

    form.saveDraft();
    expect(loadDraft("clear-on-submit")).toEqual({ email: "a@b.com" });
    await form.submit();
    expect(loadDraft("clear-on-submit")).toBeNull();
    form.destroy();
  });
});

describe("IndexedDB draft helpers", () => {
  it("round-trips async helpers used with restoreDraft adapters", async () => {
    const storage = createIndexedDbDraftStorage({ dbName: "fi-draft-phase11" });
    await saveDraftAsync("idb-key", { note: "async" }, storage);
    await expect(loadDraftAsync("idb-key", storage)).resolves.toEqual({ note: "async" });

    const form = createForm({
      initialValues: { note: "" },
      workflow: {
        draft: {
          enabled: true,
          storageKey: "idb-key",
          adapter: {
            load: () => ({ note: "async" }),
            save: (key, values) => {
              void storage.save(key, values);
            },
            clear: (key) => {
              void storage.clear(key);
            },
          },
        },
      },
    });

    expect(form.values("note")).toBe("async");
    form.destroy();
    await storage.clear("idb-key");
  });
});

describe("draft quota errors", () => {
  it("surfaces DraftStorageError on quota exceeded", () => {
    const manager = new DraftManager(
      {
        enabled: true,
        storageKey: "quota-draft",
        adapter: {
          load: () => null,
          save: () => {
            const error = new Error("quota");
            error.name = "QuotaExceededError";
            throw error;
          },
          clear: () => undefined,
        },
      },
      "quota-draft",
    );

    expect(() => {
      manager.save({ email: "a@b.com" });
    }).toThrow(DraftStorageError);
  });
});
