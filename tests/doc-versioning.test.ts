import { describe, expect, it } from "vitest";

import {
  archiveBasePath,
  archiveDirectoryName,
  shouldArchiveForBumpType,
} from "../scripts/lib/doc-versioning.mjs";

describe("documentation versioning", () => {
  it("maps archive paths under the browser-lifecycle package route", () => {
    expect(archiveDirectoryName("0.1.2")).toBe("v0.1.2");
    expect(archiveBasePath("0.1.2")).toBe("/packages/browser-lifecycle/v0.1.2");
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
