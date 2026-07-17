// @vitest-environment jsdom

import { mount } from "@vue/test-utils";
import { afterEach, describe, expect, it, vi } from "vitest";
import { defineComponent, h, nextTick } from "vue";

import { createBrowserLifecycle } from "@jayoncode/browser-lifecycle";
import {
  provideBrowserLifecycle,
  useBrowserLifecycle,
  useOwnedBrowserLifecycle,
} from "@jayoncode/browser-lifecycle-vue";

describe("browser-lifecycle-vue", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("owns a session, starts on mount, and disposes on unmount", async () => {
    let lifecycleRef: ReturnType<typeof createBrowserLifecycle> | undefined;

    const Child = defineComponent({
      setup() {
        const { lifecycle } = useBrowserLifecycle();
        lifecycleRef = lifecycle;
        return () => h("span", { "data-testid": "running" }, String(lifecycle.isRunning()));
      },
    });

    const Parent = defineComponent({
      setup() {
        provideBrowserLifecycle();
        return () => h(Child);
      },
    });

    const wrapper = mount(Parent);
    await nextTick();
    expect(lifecycleRef).toBeDefined();
    expect(lifecycleRef.isRunning()).toBe(true);

    const dispose = vi.spyOn(lifecycleRef, "dispose");
    wrapper.unmount();
    expect(dispose).toHaveBeenCalled();
  });

  it("does not dispose an adopted lifecycle", async () => {
    const lifecycle = createBrowserLifecycle({ autoStart: false });
    const dispose = vi.spyOn(lifecycle, "dispose");

    const Parent = defineComponent({
      setup() {
        provideBrowserLifecycle({ lifecycle });
        return () => h("span");
      },
    });

    const wrapper = mount(Parent);
    await nextTick();
    wrapper.unmount();
    expect(dispose).not.toHaveBeenCalled();
    lifecycle.dispose();
  });

  it("updates snapshot when visibility changes", async () => {
    Object.defineProperty(document, "visibilityState", {
      configurable: true,
      get: () => "visible",
    });

    const Child = defineComponent({
      setup() {
        const { snapshot } = useBrowserLifecycle();
        return () => h("span", { "data-testid": "visibility" }, snapshot.value.visibility);
      },
    });

    const Parent = defineComponent({
      setup() {
        provideBrowserLifecycle();
        return () => h(Child);
      },
    });

    const wrapper = mount(Parent);
    await nextTick();
    expect(wrapper.get("[data-testid=visibility]").text()).toBe("visible");

    Object.defineProperty(document, "visibilityState", {
      configurable: true,
      get: () => "hidden",
    });
    document.dispatchEvent(new Event("visibilitychange"));
    await nextTick();
    expect(wrapper.get("[data-testid=visibility]").text()).toBe("hidden");
    wrapper.unmount();
  });

  it("supports owned composable without provide", async () => {
    let owned: ReturnType<typeof createBrowserLifecycle> | undefined;

    const Comp = defineComponent({
      setup() {
        const { lifecycle } = useOwnedBrowserLifecycle();
        owned = lifecycle;
        return () => h("span", String(lifecycle.isRunning()));
      },
    });

    const wrapper = mount(Comp);
    await nextTick();
    expect(owned).toBeDefined();
    expect(owned.isRunning()).toBe(true);
    const dispose = vi.spyOn(owned, "dispose");
    wrapper.unmount();
    expect(dispose).toHaveBeenCalled();
  });
});
