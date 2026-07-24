import type { FieldPath } from "../types/index.js";

export function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (value === null || typeof value !== "object") {
    return false;
  }

  const prototype: object | null = Object.getPrototypeOf(value) as object | null;
  return prototype === Object.prototype || prototype === null;
}

export function cloneValue<T>(value: T): T {
  if (value === null || typeof value !== "object") {
    return value;
  }

  // Browser-owned opaque values — keep by reference (ADR-FILE-001).
  if (typeof File !== "undefined" && value instanceof File) {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map((entry) => cloneValue(entry)) as T;
  }

  if (isPlainObject(value)) {
    const output: Record<string, unknown> = {};
    for (const [key, entry] of Object.entries(value)) {
      output[key] = cloneValue(entry);
    }
    return output as T;
  }

  if (typeof structuredClone === "function") {
    try {
      return structuredClone(value);
    } catch {
      return value;
    }
  }

  try {
    return JSON.parse(JSON.stringify(value)) as T;
  } catch {
    return value;
  }
}

export function parsePath(path: FieldPath): string[] {
  return path
    .replace(/\[(\d+)\]/g, ".$1")
    .split(".")
    .filter(Boolean);
}

export function getIn(values: Record<string, unknown>, path: FieldPath): unknown {
  const segments = parsePath(path);
  let current: unknown = values;

  for (const segment of segments) {
    if (current === null || typeof current !== "object") {
      return undefined;
    }

    current = (current as Record<string, unknown>)[segment];
  }

  return current;
}

export function setIn(
  values: Record<string, unknown>,
  path: FieldPath,
  value: unknown,
): Record<string, unknown> {
  const segments = parsePath(path);
  if (segments.length === 0) {
    return values;
  }

  for (const segment of segments) {
    // Explicit checks (not a Set lookup) so static analysis sees the guard.
    if (segment === "__proto__" || segment === "constructor" || segment === "prototype") {
      return values;
    }
  }

  const next = cloneValue(values);
  let current: Record<string, unknown> = next;

  for (let index = 0; index < segments.length - 1; index += 1) {
    const segment = segments[index];
    if (segment === undefined) {
      return values;
    }

    const existing = current[segment];
    if (!isPlainObject(existing) && !Array.isArray(existing)) {
      const child = Object.create(null) as Record<string, unknown>;
      Object.defineProperty(current, segment, {
        value: child,
        writable: true,
        enumerable: true,
        configurable: true,
      });
    }

    current = current[segment] as Record<string, unknown>;
  }

  const last = segments[segments.length - 1];
  if (last === undefined) {
    return values;
  }

  Object.defineProperty(current, last, {
    value,
    writable: true,
    enumerable: true,
    configurable: true,
  });
  return next;
}

export function shallowEqualRecord(
  left: Readonly<Record<string, unknown>>,
  right: Readonly<Record<string, unknown>>,
): boolean {
  const leftKeys = Object.keys(left);
  const rightKeys = Object.keys(right);

  if (leftKeys.length !== rightKeys.length) {
    return false;
  }

  for (const key of leftKeys) {
    if (left[key] !== right[key]) {
      return false;
    }
  }

  return true;
}

export function createId(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

export function debounce<TArgs extends unknown[]>(
  fn: (...args: TArgs) => void,
  waitMs: number,
): (...args: TArgs) => void {
  let timer: ReturnType<typeof setTimeout> | undefined;

  return (...args: TArgs) => {
    if (timer !== undefined) {
      clearTimeout(timer);
    }

    timer = setTimeout(() => {
      fn(...args);
    }, waitMs);
  };
}
