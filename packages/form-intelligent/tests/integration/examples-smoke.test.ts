// @vitest-environment jsdom

import { describe, expect, it, vi } from "vitest";

import { runBasicValidationExample } from "../../examples/basic-validation.js";
import { runVanillaHtmlExample } from "../../examples/vanilla-html.js";
import { runWizardWorkflowExample } from "../../examples/wizard-workflow.js";

describe("examples smoke", () => {
  it("runs basic-validation example", async () => {
    const log = vi.spyOn(console, "log").mockImplementation(() => undefined);
    await runBasicValidationExample();
    expect(log).toHaveBeenCalled();
    log.mockRestore();
  });

  it("runs wizard-workflow example", async () => {
    const log = vi.spyOn(console, "log").mockImplementation(() => undefined);
    await runWizardWorkflowExample();
    expect(log).toHaveBeenCalled();
    log.mockRestore();
  });

  it("runs vanilla-html example against the DOM", () => {
    const log = vi.spyOn(console, "log").mockImplementation(() => undefined);
    const form = runVanillaHtmlExample();
    expect(document.querySelector("#login")).toBeTruthy();
    expect(form.id).toBeTruthy();
    form.destroy();
    log.mockRestore();
  });
});
