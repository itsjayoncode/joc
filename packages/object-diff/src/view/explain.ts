import type { DiffRecord, DiffResult, DiffType } from "../types/index.js";

export type ExplainConfidence = "high" | "medium" | "low";

/**
 * Structured explanation for a single change — UI / audit friendly.
 */
export interface DiffExplanation {
  readonly path: string;
  readonly type: DiffType;
  /** Machine-oriented cause string (stable-ish English, not an enum). */
  readonly reason: string;
  readonly confidence: ExplainConfidence;
  /** One-line human headline (no value dump). */
  readonly summary: string;
  readonly from?: string;
  readonly previous?: unknown;
  readonly current?: unknown;
}

export interface ExplainOptions {
  /**
   * `structured` (default) returns `DiffExplanation[]`.
   * `human` returns a multi-line review string.
   */
  readonly format?: "structured" | "human";
  /**
   * When the underlying `diff()` used identity matching, pass the property name
   * (e.g. `"id"`) so move explanations can say so explicitly.
   */
  readonly identityKey?: string;
}

function formatValue(value: unknown): string {
  if (value === undefined) {
    return "undefined";
  }

  if (typeof value === "string") {
    return value;
  }

  try {
    return JSON.stringify(value);
  } catch {
    return typeof value === "object" && value !== null
      ? Object.prototype.toString.call(value)
      : typeof value;
  }
}

function isArrayIndexPath(path: string): boolean {
  return /\[\d+\]/.test(path);
}

function extractIndex(path: string): string | undefined {
  const match = /\[(\d+)\]$/.exec(path);
  return match?.[1];
}

function parentLabel(path: string): string {
  const withoutIndex = path.replace(/\[\d+\]$/, "");
  if (withoutIndex === "" || withoutIndex === path) {
    return "item";
  }
  const segments = withoutIndex.split(".");
  return segments[segments.length - 1] ?? "item";
}

function explainMoved(change: DiffRecord, identityKey: string | undefined): DiffExplanation {
  const from = change.from ?? "?";
  const arrayMove = isArrayIndexPath(from) || isArrayIndexPath(change.path);

  let reason: string;
  let summary: string;

  if (arrayMove && identityKey) {
    reason = `Matched using identityKey '${identityKey}'`;
    summary = `${parentLabel(change.path)} item moved`;
  } else if (arrayMove) {
    reason = "Equal array item relocated (detectMoves)";
    summary = `${parentLabel(change.path)} item moved`;
  } else if (identityKey) {
    reason = `Equal value relocated between keys (identityKey '${identityKey}')`;
    summary = `\`${from}\` moved to \`${change.path}\``;
  } else {
    reason = "Equal value relocated between keys (detectMoves)";
    summary = `\`${from}\` moved to \`${change.path}\``;
  }

  return {
    path: change.path,
    type: "moved",
    reason,
    confidence: "high",
    summary,
    from,
    ...(change.previous !== undefined ? { previous: change.previous } : {}),
    ...(change.current !== undefined ? { current: change.current } : {}),
  };
}

function explainChange(change: DiffRecord, identityKey: string | undefined): DiffExplanation {
  switch (change.type) {
    case "moved":
      return explainMoved(change, identityKey);
    case "added":
      return {
        path: change.path,
        type: "added",
        reason: "Path present only on the right (after) value",
        confidence: "high",
        summary: `\`${change.path}\` added`,
        ...(change.current !== undefined ? { current: change.current } : {}),
      };
    case "removed":
      return {
        path: change.path,
        type: "removed",
        reason: "Path present only on the left (before) value",
        confidence: "high",
        summary: `\`${change.path}\` removed`,
        ...(change.previous !== undefined ? { previous: change.previous } : {}),
      };
    case "changed": {
      const leftKind = change.previous === null ? "null" : typeof change.previous;
      const rightKind = change.current === null ? "null" : typeof change.current;
      const primitive =
        (leftKind !== "object" && leftKind !== "function") ||
        (rightKind !== "object" && rightKind !== "function");

      return {
        path: change.path,
        type: "changed",
        reason: primitive ? "Primitive value changed" : "Value changed at this path",
        confidence: "high",
        summary: `\`${change.path}\` updated`,
        ...(change.previous !== undefined ? { previous: change.previous } : {}),
        ...(change.current !== undefined ? { current: change.current } : {}),
      };
    }
    case "unchanged":
      return {
        path: change.path,
        type: "unchanged",
        reason: "Values compare equal at this path",
        confidence: "high",
        summary: `\`${change.path}\` unchanged`,
        ...(change.previous !== undefined ? { previous: change.previous } : {}),
        ...(change.current !== undefined ? { current: change.current } : {}),
      };
    default: {
      const _exhaustive: never = change.type;
      void _exhaustive;
      return {
        path: change.path,
        type: "changed",
        reason: "Unknown change type",
        confidence: "low",
        summary: `\`${change.path}\` unknown`,
      };
    }
  }
}

function formatHumanBlock(entry: DiffExplanation): string {
  const lines = [`✓ ${entry.summary.replaceAll("`", "")}`];

  if (entry.type === "moved" && entry.from) {
    const fromIndex = extractIndex(entry.from);
    const toIndex = extractIndex(entry.path);
    if (fromIndex !== undefined && toIndex !== undefined) {
      lines.push(`  index ${fromIndex} → ${toIndex}`);
    } else {
      lines.push(`  ${entry.from} → ${entry.path}`);
    }
    if (entry.reason.toLowerCase().includes("identitykey")) {
      const match = /identityKey '([^']+)'/.exec(entry.reason);
      const identityName = match?.[1];
      lines.push(
        identityName !== undefined ? `  matched using ${identityName}` : `  ${entry.reason}`,
      );
    }
  } else if (entry.type === "changed") {
    lines.push(`  ${formatValue(entry.previous)} → ${formatValue(entry.current)}`);
  } else if (entry.type === "added") {
    lines.push(`  ${formatValue(entry.current)}`);
  } else if (entry.type === "removed") {
    lines.push(`  ${formatValue(entry.previous)}`);
  }

  return lines.join("\n");
}

/**
 * Build structured explanations for every change in a DiffResult.
 */
export function explainDiff(
  result: DiffResult,
  options?: Omit<ExplainOptions, "format">,
): DiffExplanation[] {
  const identityKey = options?.identityKey;
  return result.changes.map((change) => explainChange(change, identityKey));
}

/**
 * Human multi-line review text for a DiffResult (DiffView `explain({ format: "human" })`).
 */
export function formatExplainHuman(
  result: DiffResult,
  options?: Omit<ExplainOptions, "format">,
): string {
  const entries = explainDiff(result, options);
  if (entries.length === 0) {
    return "No changes";
  }
  return entries.map(formatHumanBlock).join("\n\n");
}
