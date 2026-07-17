import { describe, expect, it } from "vitest";

import {
  createBrowserLifecycle,
  createMetricsApi,
  createSessionHealthApi,
  createSessionPredictApi,
} from "@jayoncode/browser-lifecycle";

describe("createSessionHealthApi", () => {
  it("derives health from the snapshot", () => {
    const lifecycle = createBrowserLifecycle({ autoStart: false });
    const health = createSessionHealthApi(lifecycle);
    const view = health.health();
    expect(view).toMatchObject({
      active: expect.any(Boolean),
      degraded: expect.any(Boolean),
      focused: expect.any(Boolean),
      healthy: expect.any(Boolean),
      idle: expect.any(Boolean),
      online: expect.any(Boolean),
      recovering: expect.any(Boolean),
      visible: expect.any(Boolean),
    });
    health.dispose();
    lifecycle.dispose();
  });
});

describe("createSessionPredictApi", () => {
  it("returns a heuristic prediction from metrics + snapshot", () => {
    const lifecycle = createBrowserLifecycle({ autoStart: false });
    const metrics = createMetricsApi(lifecycle);
    const predict = createSessionPredictApi({ lifecycle, metrics });
    const view = predict.predict();
    expect(view.attentionScore).toBeGreaterThanOrEqual(0);
    expect(["low", "medium", "high"]).toContain(view.engagement);
    expect(typeof view.likelyIdle).toBe("boolean");
    expect(typeof view.likelySleep).toBe("boolean");
    predict.dispose();
    metrics.dispose();
    lifecycle.dispose();
  });
});
