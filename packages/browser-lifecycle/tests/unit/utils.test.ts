import {
  assert,
  deepFreeze,
  isBrowser,
  isFunction,
  isObject,
  mergeObjects,
  noop,
} from "@jayoncode/browser-lifecycle";
import { describe, expect, it } from "vitest";

describe("utilities", () => {
  it("asserts truthy values and throws for falsy ones", () => {
    expect(() => {
      assert(true, "should not throw");
    }).not.toThrow();
    expect(() => {
      assert(false, "expected failure");
    }).toThrow("expected failure");
  });

  it("provides a noop helper", () => {
    expect(() => {
      noop();
    }).not.toThrow();
  });

  it("detects browser and function-like values", () => {
    expect(isBrowser()).toBe(false);
    expect(isFunction(() => "value")).toBe(true);
    expect(isFunction("value")).toBe(false);
  });

  it("detects object-like values", () => {
    expect(isObject({})).toBe(true);
    expect(isObject([])).toBe(true);
    expect(isObject(null)).toBe(false);
    expect(isObject("text")).toBe(false);
  });

  it("deep-freezes nested objects and arrays", () => {
    const frozen = deepFreeze({
      nested: {
        value: 1,
      },
      values: [1, 2, 3],
    });

    expect(Object.isFrozen(frozen)).toBe(true);
    expect(Object.isFrozen(frozen.nested)).toBe(true);
    expect(Object.isFrozen(frozen.values)).toBe(true);
    expect(frozen.nested.value).toBe(1);
  });

  it("handles cyclical object graphs while freezing", () => {
    const value: { self?: unknown } = {};
    value.self = value;

    const frozen = deepFreeze(value);

    expect(Object.isFrozen(frozen)).toBe(true);
    expect(frozen.self).toBe(frozen);
  });

  it("merges nested objects and replaces arrays", () => {
    const merged = mergeObjects(
      {
        flags: {
          debug: false,
          trace: false,
        },
        values: [1, 2],
      },
      {
        flags: {
          debug: true,
        },
        values: [3],
      },
    );

    expect(merged).toEqual({
      flags: {
        debug: true,
        trace: false,
      },
      values: [3],
    });
  });
});
