// @vitest-environment jsdom

import { describe, expect, it, vi } from "vitest";

import { clearDraft, loadDraft } from "../../src/draft/index.js";
import { createForm, required } from "../../src/index.js";
import { WizardNavigator } from "../../src/workflow/wizard.js";

describe("wizard goTo validation modes", () => {
  it("defaults goTo to validating the entire form", async () => {
    const form = createForm({
      initialValues: { a: "", b: "" },
      validators: {
        a: [required],
        b: [required],
      },
      workflow: {
        wizard: {
          steps: [
            { id: "one", fields: ["a"] },
            { id: "two", fields: ["b"] },
          ],
        },
      },
    });

    form.setValue("a", "ok");
    await expect(form.workflow.goTo(1)).resolves.toBe(false);
    expect(form.state.workflow.currentStep).toBe(0);

    form.setValue("b", "ok");
    await expect(form.workflow.goTo(1)).resolves.toBe(true);
    expect(form.state.workflow.currentStep).toBe(1);
    form.destroy();
  });

  it("supports step-scoped goTo validation", async () => {
    const form = createForm({
      initialValues: { a: "ok", b: "" },
      validators: {
        a: [required],
        b: [required],
      },
      workflow: {
        wizard: {
          goToValidation: "step",
          steps: [
            { id: "one", fields: ["a"] },
            { id: "two", fields: ["b"] },
          ],
        },
      },
    });

    await expect(form.workflow.goTo("two")).resolves.toBe(true);
    expect(form.state.workflow.currentStep).toBe(1);
    form.destroy();
  });

  it("supports none validation override on goTo", async () => {
    const form = createForm({
      initialValues: { a: "", b: "" },
      validators: { a: [required], b: [required] },
      workflow: {
        wizard: {
          steps: [
            { id: "one", fields: ["a"] },
            { id: "two", fields: ["b"] },
          ],
        },
      },
    });

    await expect(form.workflow.goTo(1, { validate: "none" })).resolves.toBe(true);
    expect(form.state.workflow.currentStep).toBe(1);
    form.destroy();
  });
});

describe("wizard conditional branching MVP", () => {
  it("skips steps when when() is false", async () => {
    const form = createForm({
      initialValues: { kind: "personal", company: "", name: "Jay" },
      workflow: {
        wizard: {
          steps: [
            { id: "profile", fields: ["kind", "name"] },
            {
              id: "business",
              fields: ["company"],
              when: (values) => values.kind === "business",
            },
            { id: "review", fields: [] },
          ],
        },
      },
    });

    expect(form.workflow.visibleSteps()).toEqual(["profile", "review"]);
    await expect(form.workflow.next()).resolves.toBe(true);
    expect(form.state.workflow.currentStep).toBe(2);
    expect(form.state.workflow.totalSteps).toBe(2);
    form.destroy();
  });

  it("follows explicit next edges", async () => {
    const form = createForm({
      initialValues: { path: "fast" },
      workflow: {
        wizard: {
          steps: [
            { id: "start", fields: ["path"], next: "end" },
            { id: "middle", fields: [] },
            { id: "end", fields: [] },
          ],
        },
      },
    });

    await expect(form.workflow.next()).resolves.toBe(true);
    expect(form.workflow.visibleSteps()).toContain("end");
    expect(form.state.workflow.currentStep).toBe(2);
    form.destroy();
  });

  it("honors canLeave / canEnter guards", async () => {
    const canLeave = vi.fn(() => false);
    const form = createForm({
      initialValues: { x: "1" },
      workflow: {
        wizard: {
          steps: [
            { id: "a", fields: ["x"], canLeave },
            { id: "b", fields: [] },
          ],
        },
      },
    });

    await expect(form.workflow.next()).resolves.toBe(false);
    expect(canLeave).toHaveBeenCalled();
    expect(form.state.workflow.currentStep).toBe(0);
    form.destroy();
  });

  it("exposes step graph", () => {
    const form = createForm({
      initialValues: {},
      workflow: {
        wizard: {
          steps: [{ id: "a", next: "c" }, { id: "b" }, { id: "c" }],
        },
      },
    });

    expect(form.workflow.getStepGraph().nodes.map((node) => node.id)).toEqual(["a", "b", "c"]);
    expect(form.workflow.getStepGraph().nodes[0]?.nextIds).toEqual(["c"]);
    form.destroy();
  });
});

describe("wizard step draft persistence", () => {
  it("round-trips step via saveDraft envelope", async () => {
    clearDraft("wizard-step-draft-2");
    const form = createForm({
      initialValues: { a: "1", b: "2" },
      workflow: {
        draft: { enabled: true, storageKey: "wizard-step-draft-2" },
        wizard: {
          persistStepInDraft: true,
          steps: [
            { id: "one", fields: ["a"] },
            { id: "two", fields: ["b"] },
          ],
        },
      },
    });

    await form.workflow.goTo(1, { validate: "none" });
    expect(form.state.workflow.currentStep).toBe(1);
    form.saveDraft();
    const stored = loadDraft("wizard-step-draft-2");
    expect(stored).toMatchObject({
      version: 1,
      workflow: { currentStep: 1 },
      values: { a: "1", b: "2" },
    });
    form.destroy();

    const restored = createForm({
      initialValues: { a: "", b: "" },
      workflow: {
        draft: { enabled: true, storageKey: "wizard-step-draft-2" },
        wizard: {
          persistStepInDraft: true,
          steps: [
            { id: "one", fields: ["a"] },
            { id: "two", fields: ["b"] },
          ],
        },
      },
    });

    expect(restored.state.workflow.currentStep).toBe(1);
    expect(restored.values()).toEqual({ a: "1", b: "2" });
    restored.destroy();
    clearDraft("wizard-step-draft-2");
  });
});

describe("wizard navigator unit", () => {
  it("blocks goTo into invisible steps", async () => {
    let currentStep = 0;
    const navigator = new WizardNavigator({
      getWizard: () => ({
        steps: [
          { id: "a", fields: [] },
          { id: "b", fields: [], when: () => false },
        ],
      }),
      getCurrentStep: () => currentStep,
      setStep: (step) => {
        currentStep = step;
      },
      getValues: () => ({}),
      validate: async () => true,
    });

    await expect(navigator.goTo("b", { validate: "none" })).resolves.toBe(false);
    expect(currentStep).toBe(0);
  });
});
