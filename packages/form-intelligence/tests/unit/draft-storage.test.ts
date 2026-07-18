// @vitest-environment jsdom

import "fake-indexeddb/auto";

import { describe, expect, it } from "vitest";

import {
  clearDraft,
  clearDraftAsync,
  createIndexedDbDraftStorage,
  loadDraft,
  saveDraft,
} from "../../src/engines/draft/index.js";
import { createForm } from "../../src/index.js";

describe("draft storage backends", () => {
  it("round-trips localStorage drafts by default", () => {
    saveDraft("workflow-test-draft", { name: "Jay" });
    expect(loadDraft("workflow-test-draft")).toEqual({ name: "Jay" });
    clearDraft("workflow-test-draft");
    expect(loadDraft("workflow-test-draft")).toBeNull();
  });

  it("round-trips sessionStorage drafts", () => {
    saveDraft("session-draft", { email: "user@example.com" }, { storage: "sessionStorage" });
    expect(loadDraft("session-draft", { storage: "sessionStorage" })).toEqual({
      email: "user@example.com",
    });
    clearDraft("session-draft", { storage: "sessionStorage" });
    expect(loadDraft("session-draft", { storage: "sessionStorage" })).toBeNull();
  });

  it("restores createForm values from sessionStorage", () => {
    saveDraft("create-form-session-draft", { name: "Restored" }, { storage: "sessionStorage" });

    const form = createForm({
      initialValues: { name: "" },
      workflow: {
        draft: {
          enabled: true,
          storageKey: "create-form-session-draft",
          storage: "sessionStorage",
        },
      },
    });

    expect(form.values("name")).toBe("Restored");
    form.destroy();
    clearDraft("create-form-session-draft", { storage: "sessionStorage" });
  });

  it("round-trips indexedDB drafts asynchronously", async () => {
    const storage = createIndexedDbDraftStorage({ dbName: "fi-draft-test" });

    await storage.save("profile", { name: "Jay", role: "admin" });
    await expect(storage.load("profile")).resolves.toEqual({ name: "Jay", role: "admin" });
    await storage.clear("profile");
    await expect(storage.load("profile")).resolves.toBeNull();
  });

  it("supports preload before createForm for indexedDB", async () => {
    const storage = createIndexedDbDraftStorage({ dbName: "fi-draft-preload-test" });
    await storage.save("preload-draft", { notes: "saved offline" });

    const restored = await storage.load("preload-draft");
    const form = createForm({
      initialValues: { notes: "" },
      workflow: {
        draft: {
          enabled: true,
          storageKey: "preload-draft",
          adapter: {
            load: (_key) => restored,
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

    expect(form.values("notes")).toBe("saved offline");
    form.saveDraft();
    await expect(storage.load("preload-draft")).resolves.toEqual({ notes: "saved offline" });
    await clearDraftAsync("preload-draft", storage);
    form.destroy();
  });
});
