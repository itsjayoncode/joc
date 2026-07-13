import type { DeepReadonly, PlainObject } from "../types/index.js";

/**
 * Asserts that a condition is truthy.
 */
export function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

/**
 * No-op helper for optional callback defaults.
 */
export function noop(): void {}

/**
 * Returns true when the current runtime looks like a browser environment.
 */
export function isBrowser(): boolean {
  const runtime = globalThis as Record<string, unknown>;

  return typeof runtime.window === "object" && typeof runtime.document === "object";
}

/**
 * Returns true when a value is callable.
 */
export function isFunction(value: unknown): value is (...args: readonly unknown[]) => unknown {
  return typeof value === "function";
}

/**
 * Returns true when a value is a non-null object.
 */
export function isObject(value: unknown): value is PlainObject {
  return typeof value === "object" && value !== null;
}

/**
 * Deeply freezes an object tree and returns a readonly view.
 */
export function deepFreeze<TValue>(value: TValue): DeepReadonly<TValue> {
  return deepFreezeInternal(value, new WeakSet()) as DeepReadonly<TValue>;
}

/**
 * Merges two plain objects recursively while replacing arrays and scalar values.
 */
export function mergeObjects<TBase extends PlainObject, TOverride extends PlainObject>(
  base: TBase,
  override: TOverride,
): TBase & TOverride {
  const result: PlainObject = { ...base };

  for (const [key, overrideValue] of Object.entries(override)) {
    const currentValue = result[key];

    if (isPlainObject(currentValue) && isPlainObject(overrideValue)) {
      result[key] = mergeObjects(currentValue, overrideValue);
      continue;
    }

    if (Array.isArray(overrideValue)) {
      result[key] = Array.from(overrideValue);
      continue;
    }

    result[key] = overrideValue;
  }

  return result as TBase & TOverride;
}

function deepFreezeInternal<TValue>(value: TValue, seen: WeakSet<object>): TValue {
  if (!isObject(value) && !Array.isArray(value)) {
    return value;
  }

  if (seen.has(value as object)) {
    return value;
  }

  seen.add(value as object);

  for (const nestedValue of Object.values(value)) {
    deepFreezeInternal(nestedValue, seen);
  }

  return Object.freeze(value);
}

function isPlainObject(value: unknown): value is PlainObject {
  return isObject(value) && !Array.isArray(value);
}
