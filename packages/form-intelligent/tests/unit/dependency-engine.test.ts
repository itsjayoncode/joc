import { describe, expect, it, vi } from "vitest";

// @vitest-environment jsdom

import {
  buildFieldDependencyGraph,
  collectDependentFieldPaths,
  detectDependencyCycles,
} from "../../src/dependency/index.js";
import { ConfigurationError, createForm, dependencies, DependencyEngine } from "../../src/index.js";

describe("dependencies() helper", () => {
  it("normalizes parent paths to arrays", () => {
    expect(dependencies({ province: "country", city: ["province", "country"] })).toEqual({
      province: ["country"],
      city: ["province", "country"],
    });
  });
});

describe("DependencyEngine cycles", () => {
  it("throws ConfigurationError for explicit cycles", () => {
    const engine = new DependencyEngine();
    expect(() => {
      engine.registerMap({
        a: ["b"],
        b: ["a"],
      });
    }).toThrow(ConfigurationError);
  });

  it("warns for inferred dependsOn cycles without throwing", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const engine = new DependencyEngine();
    const fields = new Map([
      ["a", { dependsOn: ["b"] as const }],
      ["b", { dependsOn: ["a"] as const }],
    ]);
    expect(() => {
      engine.syncInferredFromFields(fields);
    }).not.toThrow();
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });

  it("detectDependencyCycles returns cycle paths", () => {
    const cycles = detectDependencyCycles([
      { from: "a", to: "b", actions: ["clear"] },
      { from: "b", to: "a", actions: ["clear"] },
    ]);
    expect(cycles.length).toBeGreaterThan(0);
    expect(cycles[0]?.join("→")).toMatch(/a.*b.*a/);
  });
});

describe("cascade invalidation A→B→C", () => {
  it("clears children in topo order on parent change", () => {
    const form = createForm({
      initialValues: { country: "PH", province: "Laguna", city: "Calamba" },
      dependencies: {
        province: ["country"],
        city: ["province"],
      },
    });

    form.setValue("country", "US");
    expect(form.values("province")).toBe("");
    expect(form.values("city")).toBe("");
    form.destroy();
  });

  it("fan-out clears all direct dependents", () => {
    const form = createForm({
      initialValues: { country: "PH", province: "X", city: "Y" },
      dependencies: {
        province: ["country"],
        city: ["country"],
      },
    });

    form.setValue("country", "US");
    expect(form.values("province")).toBe("");
    expect(form.values("city")).toBe("");
    form.destroy();
  });

  it("preserve skips clear", () => {
    const form = createForm({
      initialValues: { country: "PH", province: "Laguna" },
    });
    form.dependencies().link("country").to("province").effect("preserve", "revalidate");

    form.setValue("country", "US");
    expect(form.values("province")).toBe("Laguna");
    form.destroy();
  });

  it("form.dependencies(map) registers and inspects", () => {
    const form = createForm({
      initialValues: { country: "", province: "" },
    });
    form.dependencies({ province: "country" });
    const graph = form.dependencies().inspect();
    expect(graph.dependentsOf("country")).toEqual(["province"]);
    expect(graph.parentsOf("province")).toEqual(["country"]);
    expect(graph.topoOrder(["country"])).toEqual(["country", "province"]);
    form.destroy();
  });

  it("createForm rejects cyclic dependencies config", () => {
    expect(() =>
      createForm({
        initialValues: { a: "", b: "" },
        dependencies: { a: ["b"], b: ["a"] },
      }),
    ).toThrow(ConfigurationError);
  });
});

describe("SHIPPED dependsOn helpers", () => {
  it("buildFieldDependencyGraph and collectDependentFieldPaths", () => {
    const fields = new Map([
      ["province", { dependsOn: ["country"] }],
      ["city", { dependsOn: ["province"] }],
    ]);
    const graph = buildFieldDependencyGraph(fields);
    expect(graph.get("country")).toEqual(["province"]);
    expect(graph.get("province")).toEqual(["city"]);
    expect(collectDependentFieldPaths("country", fields)).toEqual(["province"]);
  });

  it("dependsOn still drives revalidate without auto-clear", () => {
    const form = createForm({
      initialValues: { country: "PH", province: "Laguna" },
      validateOn: "onBlur",
    });
    form.field("province", { dependsOn: ["country"] });
    form.setValue("country", "US");
    expect(form.values("province")).toBe("Laguna");
    form.destroy();
  });
});
