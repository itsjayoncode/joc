import { describe, expect, it } from "vitest";

import { escapeHtml, highlightCode, inferCodeLanguage } from "./code-highlight.js";

describe("code-highlight", () => {
  it("escapes html before highlighting", () => {
    expect(escapeHtml("<script>")).toBe("&lt;script&gt;");
  });

  it("highlights json keys and strings", () => {
    const result = highlightCode('{"phase": "running"}', "json");
    expect(result).toContain('class="hl-key"');
    expect(result).toContain('class="hl-string"');
  });

  it("highlights adversarial json strings without hanging", () => {
    const adversarial = `{"${".".repeat(500)}": "${".".repeat(500)}"}`;
    const startedAt = Date.now();
    const result = highlightCode(adversarial, "json");
    const elapsedMs = Date.now() - startedAt;

    expect(elapsedMs).toBeLessThan(500);
    expect(result).toContain('class="hl-key"');
    expect(result).toContain('class="hl-string"');
  });

  it("highlights typescript keywords", () => {
    const result = highlightCode("const lifecycle = createBrowserLifecycle();", "typescript");
    expect(result).toContain('class="hl-keyword"');
  });

  it("infers json payloads", () => {
    expect(inferCodeLanguage('{"enabled": true}')).toBe("json");
  });

  it("infers typescript snippets", () => {
    expect(
      inferCodeLanguage("import { createBrowserLifecycle } from '@jayoncode/form-intelligent';"),
    ).toBe("typescript");
  });
});
