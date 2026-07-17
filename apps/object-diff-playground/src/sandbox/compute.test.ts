import { describe, expect, it } from "vitest";

import { computeLab } from "./compute.js";
import { getLabTemplate, templateToJson } from "./templates.js";
import { DEFAULT_LAB_CONFIG } from "./types.js";

describe("computeLab", () => {
  it("diffs the default user-profile template", () => {
    const template = getLabTemplate("user-profile");
    const json = templateToJson(template);
    const result = computeLab({
      ...DEFAULT_LAB_CONFIG,
      snapshotA: json.snapshotA,
      snapshotB: json.snapshotB,
      merge: { ...DEFAULT_LAB_CONFIG.merge, baseJson: json.baseJson },
    });

    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }
    expect(result.result.metadata.changeCount).toBeGreaterThan(0);
    expect(result.patchOps.length).toBeGreaterThan(0);
    expect(result.formatted.length).toBeGreaterThan(0);
  });

  it("returns parse errors for broken JSON", () => {
    const result = computeLab({
      ...DEFAULT_LAB_CONFIG,
      snapshotA: "{",
      snapshotB: "{}",
    });
    expect(result.ok).toBe(false);
    if (result.ok) {
      return;
    }
    expect(result.stage).toBe("parse");
  });

  it("runs merge when enabled", () => {
    const result = computeLab({
      ...DEFAULT_LAB_CONFIG,
      snapshotA: JSON.stringify({ name: "A", score: 2 }),
      snapshotB: JSON.stringify({ name: "B", score: 1 }),
      merge: {
        enabled: true,
        strategy: "manual",
        baseJson: JSON.stringify({ name: "Base", score: 1 }),
      },
    });
    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }
    expect(result.mergeResult).not.toBeNull();
    expect(result.mergeResult?.conflicts.length).toBeGreaterThan(0);
  });
});
