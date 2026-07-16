import { describe, expect, it, vi } from "vitest";

import { FormEventBus } from "../../src/core/events.js";
import { FormModuleHost } from "../../src/core/form-module-host.js";
import { createForm } from "../../src/index.js";
import { createHistoryModule, HistoryService } from "../../src/modules/history/module.js";
import { PluginRegistry } from "../../src/plugins/index.js";

describe("form module registry", () => {
  it("registers plugins via form.use after construction", () => {
    const setup = vi.fn(() => undefined);
    const form = createForm({ initialValues: { x: "" } });
    form.use({ name: "late-plugin", setup });
    expect(setup).toHaveBeenCalledWith(form, expect.objectContaining({ on: expect.any(Function) }));
    form.destroy();
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
