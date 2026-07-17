// @vitest-environment jsdom

import { afterEach, describe, expect, it, vi } from "vitest";

import {
  asyncValidator,
  createForm,
  getAsyncValidatorOptions,
  isAsyncValidator,
} from "../../src/index.js";
import { clearDuplicateGate } from "../../src/validation/async/duplicate-gate.js";
import { clearSharedValidationCaches } from "../../src/validation/async/memory-cache.js";
import { parseTtl } from "../../src/validation/async/parse-ttl.js";

afterEach(() => {
  clearSharedValidationCaches();
  clearDuplicateGate();
});

describe("asyncValidator options overload (Phase 4B)", () => {
  it("keeps unary asyncValidator(fn) compatible", () => {
    const v = asyncValidator(async () => true);
    expect(isAsyncValidator(v)).toBe(true);
    expect(getAsyncValidatorOptions(v)).toBeUndefined();
  });

  it("attaches __asyncOptions for options-object overload", () => {
    const v = asyncValidator({
      validate: async () => true,
      debounce: 400,
      cache: "5m",
    });
    expect(isAsyncValidator(v)).toBe(true);
    expect(getAsyncValidatorOptions(v)?.debounce).toBe(400);
    expect(getAsyncValidatorOptions(v)?.cache).toBe("5m");
  });

  it("parses TtlInput strings", () => {
    expect(parseTtl(1500)).toBe(1500);
    expect(parseTtl("500ms")).toBe(500);
    expect(parseTtl("2s")).toBe(2000);
    expect(parseTtl("10m")).toBe(600_000);
    expect(parseTtl("1h")).toBe(3_600_000);
  });

  it("caches successful validation results", async () => {
    const validate = vi.fn(async () => "taken" as const);
    const form = createForm({
      initialValues: { username: "jay" },
      validateOn: "onBlur",
      validators: {
        username: [
          asyncValidator({
            validate,
            cache: "1m",
            debounce: 0,
          }),
        ],
      },
    });

    await form.validate({ paths: ["username"] });
    await form.validate({ paths: ["username"] });

    expect(validate).toHaveBeenCalledTimes(1);
    expect(form.errors("username")).toBe("taken");
    form.destroy();
  });

  it("retries failed attempts then succeeds", async () => {
    let attempts = 0;
    const form = createForm({
      initialValues: { username: "jay" },
      validateOn: "onBlur",
      validators: {
        username: [
          asyncValidator({
            validate: async () => {
              attempts += 1;
              if (attempts < 3) {
                throw new Error("transient");
              }
              return true;
            },
            retry: { maxAttempts: 3, delayMs: 1 },
            debounce: 0,
          }),
        ],
      },
    });

    await form.validate({ paths: ["username"] });
    expect(attempts).toBe(3);
    expect(form.errors("username")).toBeUndefined();
    form.destroy();
  });

  it("returns timeout error when validate exceeds timeout", async () => {
    const form = createForm({
      initialValues: { username: "jay" },
      validateOn: "onBlur",
      validators: {
        username: [
          asyncValidator({
            validate: async (_value, { signal }) => {
              await new Promise<void>((resolve, reject) => {
                const timer = setTimeout(resolve, 200);
                signal.addEventListener(
                  "abort",
                  () => {
                    clearTimeout(timer);
                    reject(new DOMException("Aborted", "AbortError"));
                  },
                  { once: true },
                );
              });
              return true;
            },
            timeout: 30,
            debounce: 0,
          }),
        ],
      },
    });

    await form.validate({ paths: ["username"] });
    expect(form.errors("username")).toMatch(/timed out/i);
    form.destroy();
  });

  it("coalesces duplicate in-flight requests", async () => {
    let resolveGate: (() => void) | undefined;
    const gate = new Promise<void>((resolve) => {
      resolveGate = resolve;
    });
    const validate = vi.fn(async () => {
      await gate;
      return "dup" as const;
    });

    const form = createForm({
      initialValues: { username: "same" },
      validateOn: "onBlur",
      validators: {
        username: [
          asyncValidator({
            validate,
            preventDuplicates: true,
            abortPrevious: false,
            debounce: 0,
          }),
        ],
      },
    });

    const a = form.validate({ paths: ["username"] });
    const b = form.validate({ paths: ["username"] });
    resolveGate?.();
    await Promise.all([a, b]);

    expect(validate).toHaveBeenCalledTimes(1);
    expect(form.errors("username")).toBe("dup");
    form.destroy();
  });

  it("honors custom debounce from options on onChange", async () => {
    const validate = vi.fn(async () => true);
    const form = createForm({
      initialValues: { email: "" },
      validateOn: "onChange",
      validators: {
        email: [
          asyncValidator({
            validate,
            debounce: 80,
          }),
        ],
      },
    });

    form.setValue("email", "a");
    form.setValue("email", "ab");
    await new Promise((resolve) => setTimeout(resolve, 40));
    expect(validate).toHaveBeenCalledTimes(0);
    await new Promise((resolve) => setTimeout(resolve, 80));
    expect(validate).toHaveBeenCalledTimes(1);
    form.destroy();
  });

  it("session cache stores hashed keys, not raw field values", async () => {
    sessionStorage.clear();
    const form = createForm({
      initialValues: { username: "secret-user" },
      validateOn: "onBlur",
      validators: {
        username: [
          asyncValidator({
            validate: async () => "taken",
            cache: { ttl: "1m", storage: "session" },
            debounce: 0,
            sharedCache: "session-hash-test",
          }),
        ],
      },
    });

    await form.validate({ paths: ["username"] });

    const stored = JSON.stringify(
      Object.fromEntries(
        Array.from({ length: sessionStorage.length }, (_, index) => {
          const key = sessionStorage.key(index) ?? "";
          return [key, sessionStorage.getItem(key)];
        }),
      ),
    );
    expect(stored).not.toContain("secret-user");
    expect(stored).toMatch(/fi:async-cache:session-hash-test:[0-9a-f]{16}/);
    form.destroy();
    sessionStorage.clear();
  });

  it("does not write password paths to sessionStorage", async () => {
    sessionStorage.clear();
    const form = createForm({
      initialValues: { password: "hunter2-secret" },
      validateOn: "onBlur",
      validators: {
        password: [
          asyncValidator({
            validate: async () => true,
            cache: { ttl: "1m", storage: "session" },
            debounce: 0,
            sharedCache: "session-password-test",
          }),
        ],
      },
    });

    await form.validate({ paths: ["password"] });

    for (let index = 0; index < sessionStorage.length; index += 1) {
      const key = sessionStorage.key(index) ?? "";
      const value = sessionStorage.getItem(key) ?? "";
      expect(key).not.toContain("hunter2");
      expect(value).not.toContain("hunter2");
    }
    expect(
      Array.from({ length: sessionStorage.length }, (_, i) => sessionStorage.key(i)).every(
        (key) => !key?.includes("session-password-test"),
      ),
    ).toBe(true);
    form.destroy();
    sessionStorage.clear();
  });
});
