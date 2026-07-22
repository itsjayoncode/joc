import type { DiffOptions, PatchOptions } from "@jayoncode/object-diff";

import {
  applyPatch,
  createDiffView,
  diff,
  hasChanges,
  merge,
  patch,
  revertPatch,
  serialize,
  statistics,
  validatePatch,
} from "../lib/object-diff.js";

import type { LabConfig, LabTimings } from "./types.js";
import type {
  DiffExplanation,
  DiffResult,
  DiffStatistics,
  MergeResult,
  Patch,
} from "../lib/object-diff.js";

export interface LabComputeSuccess {
  readonly ok: true;
  readonly before: unknown;
  readonly after: unknown;
  readonly base: unknown;
  readonly result: DiffResult;
  readonly patchOps: Patch;
  readonly applied: unknown;
  readonly reverted: unknown;
  readonly mergeResult: MergeResult | null;
  readonly formatted: string;
  readonly explainHuman: string;
  readonly explanations: readonly DiffExplanation[];
  readonly dirty: boolean;
  readonly stats: DiffStatistics;
  readonly timings: LabTimings;
  readonly patchValid: boolean;
  readonly patchValidationError: string | null;
}

export interface LabComputeFailure {
  readonly ok: false;
  readonly error: string;
  readonly stage: "parse" | "diff" | "patch" | "merge" | "serialize";
}

export type LabComputeResult = LabComputeSuccess | LabComputeFailure;

function parsePaths(raw: string): readonly string[] | undefined {
  const parts = raw
    .split(/[,\n]/)
    .map((part) => part.trim())
    .filter(Boolean);
  return parts.length > 0 ? parts : undefined;
}

function buildDiffOptions(config: LabConfig): DiffOptions {
  const options: DiffOptions = {
    includeUnchanged: config.diff.includeUnchanged,
    treatUndefinedAsMissing: config.diff.treatUndefinedAsMissing,
    circular: config.diff.circular,
    detectMoves: config.diff.detectMoves,
  };

  const ignore = parsePaths(config.diff.ignorePaths);
  const include = parsePaths(config.diff.includePaths);
  const identityKey = config.diff.identityKey.trim();

  return {
    ...options,
    ...(config.diff.maxDepth > 0 ? { maxDepth: config.diff.maxDepth } : {}),
    ...(ignore ? { ignore } : {}),
    ...(include ? { include } : {}),
    ...(identityKey ? { identityKey } : {}),
  };
}

function injectCircular(value: unknown): unknown {
  if (value !== null && typeof value === "object") {
    const target = value as Record<string, unknown>;
    target.__circular = target;
  }
  return value;
}

export function computeLab(config: LabConfig): LabComputeResult {
  let before: unknown;
  let after: unknown;
  let base: unknown = null;

  try {
    before = JSON.parse(config.snapshotA) as unknown;
    after = JSON.parse(config.snapshotB) as unknown;
  } catch (caught) {
    return {
      ok: false,
      stage: "parse",
      error: caught instanceof Error ? caught.message : "Invalid JSON in snapshots.",
    };
  }

  if (config.merge.enabled) {
    try {
      base = JSON.parse(config.merge.baseJson) as unknown;
    } catch (caught) {
      return {
        ok: false,
        stage: "parse",
        error: caught instanceof Error ? caught.message : "Invalid JSON in merge base.",
      };
    }
  }

  if (config.injectCircular) {
    before = injectCircular(before);
    after = injectCircular(after);
  }

  const diffOptions = buildDiffOptions(config);
  const identityKey = config.diff.identityKey.trim() || undefined;

  const dirtyStarted = performance.now();
  let dirty: boolean;
  try {
    dirty = hasChanges(before, after, diffOptions);
  } catch {
    dirty = true;
  }
  const hasChangesMs = performance.now() - dirtyStarted;

  const compareStarted = performance.now();
  let result: DiffResult;

  try {
    result = diff(before, after, diffOptions);
  } catch (caught) {
    return {
      ok: false,
      stage: "diff",
      error: caught instanceof Error ? caught.message : "Diff failed.",
    };
  }
  const compareMs = performance.now() - compareStarted;

  const patchStarted = performance.now();
  let patchOps: Patch;
  let applied: unknown;
  let reverted: unknown;
  let patchValid = true;
  let patchValidationError: string | null = null;

  try {
    const patchOptions: PatchOptions = {
      format: config.patch.format,
      optimize: config.patch.optimize,
    };
    patchOps = patch(result, patchOptions);

    try {
      validatePatch(patchOps);
      patchValid = true;
    } catch (caught) {
      patchValid = false;
      patchValidationError = caught instanceof Error ? caught.message : "Invalid patch.";
    }

    applied = applyPatch(before, patchOps, {
      mutable: config.patch.mutable,
      validate: config.patch.validate,
    });
    reverted = revertPatch(applied, patchOps, {
      mutable: config.patch.mutable,
      validate: config.patch.validate,
    });
  } catch (caught) {
    return {
      ok: false,
      stage: "patch",
      error: caught instanceof Error ? caught.message : "Patch pipeline failed.",
    };
  }
  const patchMs = performance.now() - patchStarted;

  let mergeResult: MergeResult | null = null;
  let mergeMs: number | null = null;

  if (config.merge.enabled && base !== null) {
    const mergeStarted = performance.now();
    try {
      mergeResult = merge(before, after, {
        base,
        strategy: config.merge.strategy,
        includeApplied: true,
        ...(identityKey ? { identityKey } : {}),
      });
    } catch (caught) {
      return {
        ok: false,
        stage: "merge",
        error: caught instanceof Error ? caught.message : "Merge failed.",
      };
    }
    mergeMs = performance.now() - mergeStarted;
  }

  const serializeStarted = performance.now();
  let formatted: string;
  let explainHuman: string;
  let explanations: DiffExplanation[];
  try {
    formatted = serialize(result, config.format, {
      title: "Object Diff Result",
      color: false,
    });
    const view = createDiffView(result);
    const explainOpts = identityKey ? { identityKey } : undefined;
    explainHuman = view.explain({ format: "human", ...explainOpts }) as string;
    explanations = view.explain(explainOpts) as DiffExplanation[];
  } catch (caught) {
    return {
      ok: false,
      stage: "serialize",
      error: caught instanceof Error ? caught.message : "Serialize / explain failed.",
    };
  }
  const serializeMs = performance.now() - serializeStarted;

  const stats = statistics(result, patchOps);
  const totalMs = compareMs + patchMs + serializeMs + (mergeMs ?? 0);

  return {
    ok: true,
    before,
    after,
    base,
    result,
    patchOps,
    applied,
    reverted,
    mergeResult,
    formatted,
    explainHuman,
    explanations,
    dirty,
    stats,
    timings: {
      compareMs,
      patchMs,
      serializeMs,
      mergeMs,
      hasChangesMs,
      totalMs,
    },
    patchValid,
    patchValidationError,
  };
}
