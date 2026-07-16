import { describe, expect, it } from "vitest";

import {
  archiveBasePath,
  archiveDirectoryName,
  shouldArchiveForBumpType,
} from "../scripts/doc-versioning-policy.js";

describe("documentation versioning", () => {
  it("maps archive paths under package routes", () => {
    expect(archiveDirectoryName("0.1.2")).toBe("v0.1.2");
    expect(archiveBasePath("browser-lifecycle", "0.1.2")).toBe(
      "/packages/browser-lifecycle/v0.1.2",
    );
    expect(archiveBasePath("form-intelligent", "1.0.0")).toBe("/packages/form-intelligent/v1.0.0");
    expect(archiveBasePath("object-diff", "0.2.0")).toBe("/packages/object-diff/v0.2.0");
  });

  it("archives pre-1.0 docs on minor and major bumps", () => {
    expect(shouldArchiveForBumpType("0.1.2", "patch", "minor")).toBe(false);
    expect(shouldArchiveForBumpType("0.1.2", "minor", "minor")).toBe(true);
    expect(shouldArchiveForBumpType("0.1.2", "major", "minor")).toBe(true);
  });

  it("archives post-1.0 docs on major bumps when policy is minor", () => {
    expect(shouldArchiveForBumpType("1.2.0", "patch", "minor")).toBe(false);
    expect(shouldArchiveForBumpType("1.2.0", "minor", "minor")).toBe(false);
    expect(shouldArchiveForBumpType("1.2.0", "major", "minor")).toBe(true);
  });

  it("supports major-only archive policy", () => {
    expect(shouldArchiveForBumpType("0.8.0", "minor", "major")).toBe(false);
    expect(shouldArchiveForBumpType("0.8.0", "major", "major")).toBe(true);
  });
});
