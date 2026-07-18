import { describe, expect, it, vi } from "vitest";

import { FormEventBus } from "../../src/core/events.js";
import { FormModuleHost } from "../../src/core/form-module-host.js";
import {
  ConfigurationError,
  createForm,
  FORM_INTELLIGENT_VERSION,
  PLUGIN_PIPELINE_STAGES,
  satisfiesEnginesRange,
} from "../../src/index.js";
import { createHistoryModule, HistoryService } from "../../src/modules/history/module.js";
import { browserLifecyclePlugin, devtoolsPlugin, PluginRegistry } from "../../src/plugins/index.js";

describe("plugin system", () => {
  it("registers plugins via form.use after construction", () => {
    const setup = vi.fn(() => undefined);
    const form = createForm({ initialValues: { x: "" } });
    form.use({ name: "late-plugin", setup });
    expect(setup).toHaveBeenCalledWith(form, expect.objectContaining({ on: expect.any(Function) }));
    form.destroy();
  });

  it("registers plugins from createForm({ plugins }) in array order", () => {
    const order: string[] = [];
    const form = createForm({
      initialValues: { x: "" },
      plugins: [
        {
          name: "a",
          setup() {
            order.push("a");
          },
        },
        {
          name: "b",
          setup() {
            order.push("b");
          },
        },
      ],
    });

    expect(order).toEqual(["a", "b"]);
    expect(form.listPlugins().map((plugin) => plugin.name)).toEqual(["a", "b"]);
    form.destroy();
  });

  it("createForm plugins are equivalent to form.use for hooks", async () => {
    const calls: string[] = [];
    const onSubmit = vi.fn();
    const form = createForm({
      initialValues: { email: "a@b.com" },
      onSubmit,
      plugins: [
        {
          name: "guard",
          setup(_form, api) {
            api.on("beforeSubmit", () => {
              calls.push("before");
              return false;
            });
          },
        },
      ],
    });

    await expect(form.submit()).resolves.toBe(false);
    expect(calls).toEqual(["before"]);
    expect(onSubmit).not.toHaveBeenCalled();
    form.destroy();
  });

  it("runs hooks in registration order", async () => {
    const calls: string[] = [];
    const form = createForm({
      initialValues: { email: "a@b.com" },
      onSubmit: vi.fn(),
    });

    form.use({
      name: "first",
      order: 10,
      setup(_form, api) {
        api.on("beforeSubmit", () => {
          calls.push("first");
        });
      },
    });

    form.use({
      name: "second",
      order: 20,
      setup(_form, api) {
        api.on("beforeSubmit", () => {
          calls.push("second");
        });
      },
    });

    await form.submit();
    expect(calls).toEqual(["first", "second"]);
    form.destroy();
  });

  it("can cancel submit from beforeSubmit hook", async () => {
    const onSubmit = vi.fn();
    const form = createForm({
      initialValues: { email: "a@b.com" },
      onSubmit,
    });

    form.use({
      name: "guard",
      setup(_form, api) {
        api.on("beforeSubmit", () => false);
      },
    });

    await expect(form.submit()).resolves.toBe(false);
    expect(onSubmit).not.toHaveBeenCalled();
    form.destroy();
  });

  it("runs validate hooks around validation", async () => {
    const phases: string[] = [];
    const form = createForm({
      initialValues: { email: "" },
      validators: {
        email: [(value) => (value ? true : "Required")],
      },
    });

    form.use({
      name: "validate-hooks",
      setup(_form, api) {
        api.on("beforeValidate", () => {
          phases.push("before");
        });
        api.on("afterValidate", (context) => {
          phases.push(`after:${context.valid ? "valid" : "invalid"}`);
        });
      },
    });

    await form.validate();
    expect(phases).toEqual(["before", "after:invalid"]);
    form.destroy();
  });

  it("cleans up plugins on destroy", () => {
    const onDestroy = vi.fn();
    const form = createForm({ initialValues: { x: "" } });

    form.use({
      name: "cleanup-plugin",
      setup() {
        return { onDestroy };
      },
    });

    form.destroy();
    expect(onDestroy).toHaveBeenCalledTimes(1);
  });

  it("exposes built-in plugin factories", () => {
    expect(browserLifecyclePlugin).toBeTypeOf("function");
    expect(devtoolsPlugin).toBeTypeOf("function");
    expect(devtoolsPlugin().name).toBe("devtools");
  });

  it("supports explicit history module registration", () => {
    const service = new HistoryService<{ email: string }>();
    const pluginRegistry = new PluginRegistry<{ email: string }>();
    const host = new FormModuleHost(
      { id: "test" } as never,
      { initialValues: { email: "" } },
      new FormEventBus(),
      pluginRegistry,
    );
    host.register(createHistoryModule(service));
    host.start();
    service.record({ email: "a@b.com" });
    expect(service.undo({ email: "c@d.com" })).toEqual({ email: "a@b.com" });
    host.destroy();
  });

  it("isolates throwing beforeSubmit so the form is not bricked", async () => {
    const reports: Array<{ plugin?: string; hook?: string }> = [];
    const onSubmit = vi.fn();
    const form = createForm({
      initialValues: { email: "a@b.com" },
      onSubmit,
      onPluginError: (report) => {
        reports.push({ plugin: report.plugin, hook: report.hook });
      },
    });

    form.use({
      name: "boom",
      setup(_form, api) {
        api.on("beforeSubmit", () => {
          throw new Error("plugin boom");
        });
      },
    });

    await expect(form.submit()).resolves.toBe(false);
    expect(onSubmit).not.toHaveBeenCalled();
    expect(form.getSnapshot().submitPhase).not.toBe("submitting");
    expect(reports).toEqual([{ plugin: "boom", hook: "beforeSubmit" }]);

    // Form remains usable after isolation.
    form.setValue("email", "b@c.com");
    expect(form.values().email).toBe("b@c.com");
    form.destroy();
  });

  it("continues afterSubmit chain when one observer throws", async () => {
    const calls: string[] = [];
    const form = createForm({
      initialValues: { email: "a@b.com" },
      onSubmit: vi.fn(),
      onPluginError: vi.fn(),
    });

    form.use({
      name: "first",
      order: 10,
      setup(_form, api) {
        api.on("afterSubmit", () => {
          calls.push("first");
          throw new Error("first failed");
        });
      },
    });
    form.use({
      name: "second",
      order: 20,
      setup(_form, api) {
        api.on("afterSubmit", () => {
          calls.push("second");
        });
      },
    });

    await expect(form.submit()).resolves.toBe(true);
    expect(calls).toEqual(["first", "second"]);
    form.destroy();
  });

  it("isolates setup throws and skips registration", () => {
    const onPluginError = vi.fn();
    const form = createForm({
      initialValues: { x: "" },
      onPluginError,
    });

    form.use({
      name: "broken",
      setup() {
        throw new Error("setup failed");
      },
    });

    expect(onPluginError).toHaveBeenCalledWith(
      expect.objectContaining({ plugin: "broken", phase: "setup" }),
    );
    form.setValue("x", "ok");
    expect(form.values().x).toBe("ok");
    form.destroy();
  });

  it("rejects incompatible engines metadata", () => {
    const form = createForm({ initialValues: { x: "" } });
    expect(() => {
      form.use({
        name: "future",
        engines: ">=99.0.0",
        setup() {
          return undefined;
        },
      });
    }).toThrow(ConfigurationError);
    form.destroy();
  });

  it("documents PLUGIN_PIPELINE_STAGES order", () => {
    expect(PLUGIN_PIPELINE_STAGES).toEqual([
      "beforeValidate",
      "validate",
      "afterValidate",
      "beforeSubmit",
      "submit",
      "afterSubmit",
      "submitError",
    ]);
    expect(satisfiesEnginesRange(">=3.1.0")).toBe(true);
    expect(satisfiesEnginesRange("^3.1.0")).toBe(true);
    expect(FORM_INTELLIGENT_VERSION).toMatch(/^\d+\.\d+\.\d+/);
  });
});
