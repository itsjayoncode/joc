import { describe, expect, it } from "vitest";

import {
  archiveBasePath,
  archiveDirectoryName,
  resolveDocArchiveFlags,
  shouldArchiveForBumpType,
} from "../scripts/doc-versioning-policy.js";

describe("documentation versioning", () => {
  it("maps archive paths under package routes", () => {
    expect(archiveDirectoryName("0.1.2")).toBe("v0.1.2");
    expect(archiveBasePath("browser-lifecycle", "0.1.2")).toBe(
      "/packages/browser-lifecycle/v0.1.2",
    );
    expect(archiveBasePath("form-intelligence", "1.0.0")).toBe(
      "/packages/form-intelligence/v1.0.0",
    );
    expect(archiveBasePath("object-diff", "0.2.0")).toBe("/packages/object-diff/v0.2.0");
  });

  it("defaults to archiving major and minor (not patch)", () => {
    expect(resolveDocArchiveFlags()).toEqual({ major: true, minor: true, patch: false });
    expect(shouldArchiveForBumpType("0.1.2", "patch")).toBe(false);
    expect(shouldArchiveForBumpType("0.1.2", "minor")).toBe(true);
    expect(shouldArchiveForBumpType("0.1.2", "major")).toBe(true);
    expect(shouldArchiveForBumpType("3.5.0", "patch")).toBe(false);
    expect(shouldArchiveForBumpType("3.5.0", "minor")).toBe(true);
    expect(shouldArchiveForBumpType("3.5.0", "major")).toBe(true);
  });

  it("accepts explicit archive flags", () => {
    const majorOnly = { major: true, minor: false, patch: false };
    expect(shouldArchiveForBumpType("1.2.0", "minor", majorOnly)).toBe(false);
    expect(shouldArchiveForBumpType("1.2.0", "major", majorOnly)).toBe(true);
    expect(shouldArchiveForBumpType("1.2.0", "patch", { ...majorOnly, patch: true })).toBe(true);
  });

  it("treats legacy archivePolicy strings as flags", () => {
    expect(resolveDocArchiveFlags("minor-major")).toEqual({
      major: true,
      minor: true,
      patch: false,
    });
    expect(resolveDocArchiveFlags("minor")).toEqual({ major: true, minor: true, patch: false });
    expect(resolveDocArchiveFlags("major")).toEqual({ major: true, minor: false, patch: false });
    expect(shouldArchiveForBumpType("1.2.0", "minor", "minor")).toBe(true);
    expect(shouldArchiveForBumpType("0.8.0", "minor", "major")).toBe(false);
    expect(shouldArchiveForBumpType("0.8.0", "major", "major")).toBe(true);
  });
});
