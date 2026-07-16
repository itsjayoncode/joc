import { describe, expect, it, vi } from "vitest";

// @vitest-environment jsdom

import { createForm } from "../../src/index.js";
import {
  AutosaveScheduler,
  buildFieldDependencyGraph,
  buildWorkflowProgress,
  clearDraft,
  DraftManager,
  evaluateConditionalUi,
  loadDraft,
  saveDraft,
  when,
  WizardNavigator,
} from "../../src/workflow/index.js";

describe("conditional rules", () => {
  it("evaluates show rules", () => {
    const result = evaluateConditionalUi({
      rules: [when("customerType").equals("Business").show("companyName").toRule()],
      values: { customerType: "Business", companyName: "" },
      fieldPaths: ["customerType", "companyName"],
      setValue: () => undefined,
    });

    expect(result.fieldUi.companyName?.visible).toBe(true);
  });

  it("evaluates disableSubmit", () => {
    const result = evaluateConditionalUi({
      rules: [when("loanAmount").greaterThan(500_000).disableSubmit().toRule()],
      values: { loanAmount: 600_000 },
      fieldPaths: ["loanAmount"],
      setValue: () => undefined,
    });

    expect(result.formUi.submitDisabled).toBe(true);
  });
});

describe("draft helpers", () => {
  it("round-trips draft storage", () => {
    saveDraft("workflow-test-draft", { name: "Jay" });
    expect(loadDraft("workflow-test-draft")).toEqual({ name: "Jay" });
    clearDraft("workflow-test-draft");
    expect(loadDraft("workflow-test-draft")).toBeNull();
  });

  it("restores draft through DraftManager", () => {
    const manager = new DraftManager(
      { enabled: true, storageKey: "workflow-draft-manager" },
      "workflow-draft-manager",
    );

    manager.save({ name: "Restored" });
    const result = manager.resolveInitialValues({ name: "" });
    expect(result.restored).toBe(true);
    expect(result.values).toEqual({ name: "Restored" });
    manager.clear();
  });
});

describe("autosave scheduler", () => {
  it("debounces save calls", async () => {
    const onSave = vi.fn();
    const scheduler = new AutosaveScheduler<{ note: string }>();
    scheduler.configure({ enabled: true, debounceMs: 100, onSave }, () => ({ note: "hello" }), {
      onStart: vi.fn(),
      onSuccess: vi.fn(),
      onError: vi.fn(),
    });

    scheduler.schedule();
    scheduler.schedule();
    expect(onSave).not.toHaveBeenCalled();

    await new Promise((resolve) => setTimeout(resolve, 150));
    expect(onSave).toHaveBeenCalledTimes(1);
    expect(onSave).toHaveBeenCalledWith({ note: "hello" });
    scheduler.destroy();
  });

  it("cancels pending debounced save", async () => {
    const onSave = vi.fn();
    const scheduler = new AutosaveScheduler<{ note: string }>();
    scheduler.configure({ enabled: true, debounceMs: 100, onSave }, () => ({ note: "hello" }), {
      onStart: vi.fn(),
      onSuccess: vi.fn(),
      onError: vi.fn(),
    });

    scheduler.schedule();
    scheduler.cancel();
    await new Promise((resolve) => setTimeout(resolve, 150));
    expect(onSave).not.toHaveBeenCalled();
    scheduler.destroy();
  });
});

describe("wizard navigation", () => {
  it("advances when current step is valid", async () => {
    let currentStep = 0;
    const validate = vi.fn().mockResolvedValue(true);
    const navigator = new WizardNavigator({
      getWizard: () => ({
        initialStep: 0,
        steps: [{ fields: ["email"] }, { fields: ["password"] }],
      }),
      getCurrentStep: () => currentStep,
      setStep: (step) => {
        currentStep = step;
      },
      validate,
    });

    await expect(navigator.next()).resolves.toBe(true);
    expect(currentStep).toBe(1);
    expect(validate).toHaveBeenCalledWith({
      paths: ["email"],
      mode: "onSubmit",
    });
  });

  it("tracks wizard progress", () => {
    const progress = buildWorkflowProgress({
      currentStep: 1,
      wizard: {
        initialStep: 0,
        steps: [{ fields: ["a"] }, { fields: ["b"] }, { fields: ["c"] }],
      },
      isAutosaving: false,
      lastAutosaveAt: null,
    });

    expect(progress.currentStep).toBe(1);
    expect(progress.totalSteps).toBe(3);
    expect(progress.progress).toBe(67);
    expect(progress.canGoPrev).toBe(true);
    expect(progress.canGoNext).toBe(true);
  });

  it("navigates wizard steps through createForm", async () => {
    const form = createForm({
      initialValues: { email: "a@b.com", password: "" },
      workflow: {
        wizard: {
          initialStep: 0,
          steps: [{ fields: ["email"] }, { fields: ["password"] }],
        },
      },
    });

    await expect(form.workflow.next()).resolves.toBe(true);
    expect(form.state.workflow.currentStep).toBe(1);
    form.destroy();
  });
});

describe("field dependency graph", () => {
  it("maps dependsOn relationships", () => {
    const fields = new Map([
      ["province", { dependsOn: ["country"] }],
      ["city", { dependsOn: ["province"] }],
    ]);

    const graph = buildFieldDependencyGraph(fields);
    expect(graph.get("country")).toEqual(["province"]);
    expect(graph.get("province")).toEqual(["city"]);
  });
});
