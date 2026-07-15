import type { Path, PathSegment, ValueKind } from "../types/index.js";

export function getTag(value: unknown): string {
  return Object.prototype.toString.call(value);
}

export function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (value === null || typeof value !== "object") {
    return false;
  }

  const prototype: object | null = Object.getPrototypeOf(value) as object | null;
  return prototype === Object.prototype || prototype === null;
}

export function isMap(value: unknown): value is Map<unknown, unknown> {
  return value instanceof Map;
}

export function isSet(value: unknown): value is Set<unknown> {
  return value instanceof Set;
}

export function isDate(value: unknown): value is Date {
  return value instanceof Date;
}

export function isRegExp(value: unknown): value is RegExp {
  return value instanceof RegExp;
}

export function isTypedArray(value: unknown): value is ArrayBufferView {
  return ArrayBuffer.isView(value) && !(value instanceof DataView);
}

export function isFunction(value: unknown): value is (...args: unknown[]) => unknown {
  return typeof value === "function";
}

export function isPrimitive(value: unknown): boolean {
  return (
    value === null ||
    value === undefined ||
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean" ||
    typeof value === "bigint" ||
    typeof value === "symbol"
  );
}

export function getValueKind(value: unknown): ValueKind {
  if (isPrimitive(value)) {
    return "primitive";
  }

  if (Array.isArray(value)) {
    return "array";
  }

  if (isDate(value)) {
    return "date";
  }

  if (isRegExp(value)) {
    return "regexp";
  }

  if (isMap(value)) {
    return "map";
  }

  if (isSet(value)) {
    return "set";
  }

  if (isTypedArray(value)) {
    return "typed-array";
  }

  if (isFunction(value)) {
    return "function";
  }

  if (isPlainObject(value)) {
    return "object";
  }

  return "object";
}

export function joinPath(segments: readonly PathSegment[]): string {
  if (segments.length === 0) {
    return "";
  }

  return segments
    .map((segment, index) => {
      if (typeof segment === "number") {
        return `[${String(segment)}]`;
      }

      if (index === 0) {
        return segment;
      }

      return `.${segment}`;
    })
    .join("")
    .replace(/\.\[/g, "[");
}

export function cloneValue<T>(value: T): T {
  if (typeof structuredClone === "function") {
    return structuredClone(value);
  }

  return JSON.parse(JSON.stringify(value)) as T;
}

export function valuesEqualPrimitives(a: unknown, b: unknown): boolean {
  if (Object.is(a, b)) {
    return true;
  }

  if (typeof a === "number" && typeof b === "number" && Number.isNaN(a) && Number.isNaN(b)) {
    return true;
  }

  return false;
}

export function toPathSegments(path: Path): PathSegment[] {
  return [...path];
}
