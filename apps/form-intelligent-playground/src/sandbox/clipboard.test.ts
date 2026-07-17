import { describe, expect, it, vi } from "vitest";

import {
  copyTextToClipboard,
  decodeSandboxShareHash,
  encodeSandboxShareHash,
} from "./clipboard.js";
import { DEFAULT_SANDBOX_CONFIG } from "./types.js";

describe("sandbox clipboard helpers", () => {
  it("round-trips share hash payloads", () => {
    const hash = encodeSandboxShareHash({
      ...DEFAULT_SANDBOX_CONFIG,
      templateId: "register",
      asyncUsername: true,
    });
    const decoded = decodeSandboxShareHash(`#${hash}`);
    expect(decoded).toMatchObject({
      templateId: "register",
      asyncUsername: true,
    });
  });

  it("returns null for invalid share hashes", () => {
    expect(decodeSandboxShareHash("#nope")).toBeNull();
    expect(decodeSandboxShareHash("#sandbox=!!!")).toBeNull();
  });

  it("copies text via clipboard API when available", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal("navigator", { clipboard: { writeText } });

    await expect(copyTextToClipboard("hello")).resolves.toBe(true);
    expect(writeText).toHaveBeenCalledWith("hello");

    vi.unstubAllGlobals();
  });
});
