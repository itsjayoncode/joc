import { describe, expect, it } from "vitest";

import * as browserLifecycleModule from "@jayoncode/browser-lifecycle";
import * as formIntelligentModule from "@jayoncode/form-intelligence";
import * as objectDiffModule from "@jayoncode/object-diff";

describe("repository bootstrap", () => {
  it("resolves the live typed workspace packages", () => {
    expect(browserLifecycleModule).toBeTypeOf("object");
    expect(formIntelligentModule).toBeTypeOf("object");
    expect(objectDiffModule).toBeTypeOf("object");
  });
});
