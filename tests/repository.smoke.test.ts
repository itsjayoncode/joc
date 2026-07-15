import { describe, expect, it } from "vitest";

import * as browserLifecycleModule from "@jayoncode/browser-lifecycle";
import * as sharedModule from "@jayoncode/shared";

describe("repository bootstrap", () => {
  it("resolves the initial typed workspace packages", () => {
    expect(browserLifecycleModule).toBeTypeOf("object");
    expect(sharedModule).toBeTypeOf("object");
  });
});
