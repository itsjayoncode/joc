import { describe, expect, it, vi } from "vitest";

import { FormEventBus } from "../../src/core/events.js";
import { FormModuleHost } from "../../src/core/form-module-host.js";
import { createForm } from "../../src/index.js";
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
});
