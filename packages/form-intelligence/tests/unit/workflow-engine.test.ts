import { describe, expect, it, vi } from "vitest";

// @vitest-environment jsdom

import { createForm, WorkflowError } from "../../src/index.js";
import {
  AutosaveScheduler,
  buildFieldDependencyGraph,
  buildWorkflowProgress,
  clearDraft,
  DraftManager,
  evaluateConditionalUi,
  evaluateFormRules,
  loadDraft,
  RULE_EVALUATION_ORDER,
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

  it("applies rules in registration order (later wins)", () => {
    expect(RULE_EVALUATION_ORDER).toBe("registration");

    const result = evaluateFormRules({
      rules: [
        when("mode").equals("a").show("panel").toRule(),
        when("mode").equals("a").hide("panel").toRule(),
      ],
      values: { mode: "a", panel: "" },
      fieldPaths: ["mode", "panel"],
      setValue: () => undefined,
    });

    expect(result.fieldUi.panel?.visible).toBe(false);
  });

  it("wraps then() throws as WorkflowError", () => {
    expect(() =>
      evaluateFormRules({
        rules: [
          when("mode")
            .equals("x")
            .then(() => {
              throw new Error("boom");
            })
            .toRule(),
        ],
        values: { mode: "x" },
        fieldPaths: ["mode"],
        setValue: () => undefined,
      }),
    ).toThrow(WorkflowError);
  });
});

describe("async changes().populate", () => {
  it("ignores stale populate results under concurrent edits", async () => {
    let releaseSlow: (() => void) | undefined;
    const slowGate = new Promise<void>((resolve) => {
      releaseSlow = resolve;
    });

    const form = createForm({
      initialValues: { country: "", city: "" },
      rules: [
        when("country")
          .equals("PH")
          .changes(async () => {
            await slowGate;
            return [{ label: "Manila", value: "mnl" }];
          })
          .populate("city")
          .toRule(),
      ],
    });

    form.setValue("country", "PH");
    form.setValue("country", "US");
    releaseSlow?.();
    await new Promise((resolve) => setTimeout(resolve, 50));

    expect(form.state.fieldOptions.city).toBeUndefined();
    form.destroy();
  });

  it("applies latest populate after concurrent edits", async () => {
    const resolvers: Array<() => void> = [];
    const form = createForm({
      initialValues: { country: "", city: "" },
      rules: [
        when("country")
          .notEquals("")
          .changes(async (value) => {
            await new Promise<void>((resolve) => {
              resolvers.push(resolve);
            });
            return [{ label: String(value), value: String(value) }];
          })
          .populate("city")
          .toRule(),
      ],
    });

    // Warm the lazy workflow engine so both edits can be in-flight together.
    form.setValue("country", "warm");
    await vi.waitFor(() => {
      expect(resolvers.length).toBe(1);
    });
    resolvers[0]?.();
    await vi.waitFor(() => {
      expect(form.state.fieldOptions.city?.[0]?.value).toBe("warm");
    });
    resolvers.length = 0;

    form.setValue("country", "first");
    form.setValue("country", "second");
    await vi.waitFor(() => {
      expect(resolvers.length).toBe(2);
    });

    resolvers[0]?.();
    await new Promise((resolve) => setTimeout(resolve, 20));
    expect(form.state.fieldOptions.city?.[0]?.value).not.toBe("first");

    resolvers[1]?.();
    await vi.waitFor(() => {
      expect(form.state.fieldOptions.city?.[0]?.value).toBe("second");
    });
    form.destroy();
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

  it("destroy prevents pending and late success hooks", async () => {
    const onSave = vi.fn(async () => {
      await new Promise((resolve) => setTimeout(resolve, 50));
    });
    const onSuccess = vi.fn();
    const scheduler = new AutosaveScheduler<{ note: string }>();
    scheduler.configure({ enabled: true, debounceMs: 10, onSave }, () => ({ note: "x" }), {
      onStart: vi.fn(),
      onSuccess,
      onError: vi.fn(),
    });

    scheduler.schedule();
    await new Promise((resolve) => setTimeout(resolve, 20));
    scheduler.destroy();
    await new Promise((resolve) => setTimeout(resolve, 80));
    expect(onSuccess).not.toHaveBeenCalled();
  });

  it("createForm submit cancels pending autosave", async () => {
    const onSave = vi.fn();
    const form = createForm({
      initialValues: { note: "" },
      onSubmit: async () => undefined,
      workflow: {
        autosave: { enabled: true, debounceMs: 200, onSave },
      },
    });

    form.setValue("note", "draft");
    await form.submit();
    await new Promise((resolve) => setTimeout(resolve, 250));
    expect(onSave).not.toHaveBeenCalled();
    form.destroy();
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
      getValues: () => ({}),
      validate,
    });

    await expect(navigator.next()).resolves.toBe(true);
    expect(currentStep).toBe(1);
    expect(validate).toHaveBeenCalledWith({
      paths: ["email"],
      mode: "onSubmit",
    });
  });

  it("tracks wizard progress within 0–100", () => {
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
    expect(progress.progress).toBeGreaterThanOrEqual(0);
    expect(progress.progress).toBeLessThanOrEqual(100);
    expect(progress.canGoPrev).toBe(true);
    expect(progress.canGoNext).toBe(true);
  });

  it("clamps progress for out-of-range steps", () => {
    const high = buildWorkflowProgress({
      currentStep: 99,
      wizard: { initialStep: 0, steps: [{ fields: ["a"] }] },
      isAutosaving: false,
      lastAutosaveAt: null,
    });
    expect(high.progress).toBe(100);
    expect(high.currentStep).toBe(0);

    const low = buildWorkflowProgress({
      currentStep: -5,
      wizard: {
        initialStep: 0,
        steps: [{ fields: ["a"] }, { fields: ["b"] }],
      },
      isAutosaving: false,
      lastAutosaveAt: null,
    });
    expect(low.currentStep).toBe(0);
    expect(low.progress).toBeGreaterThanOrEqual(0);
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
