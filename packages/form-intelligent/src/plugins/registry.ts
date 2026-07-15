import type { FormInstance, FormPlugin } from "../types/index.js";

export class PluginRegistry<TValues extends Record<string, unknown>> {
  private readonly cleanups = new Map<string, () => void>();

  public register(form: FormInstance<TValues>, plugin: FormPlugin<TValues>): void {
    if (this.cleanups.has(plugin.name)) {
      this.cleanups.get(plugin.name)?.();
    }

    const cleanup = plugin.setup(form);
    if (typeof cleanup === "function") {
      this.cleanups.set(plugin.name, cleanup);
    }
  }

  public destroy(): void {
    for (const cleanup of this.cleanups.values()) {
      cleanup();
    }

    this.cleanups.clear();
  }
}
