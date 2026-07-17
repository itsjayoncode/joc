import type {
  CircularReferenceStrategy,
  PatchFormat,
  SerializeFormat,
} from "../lib/object-diff.js";

export type SnapshotTemplateId =
  | "user-profile"
  | "product"
  | "employee"
  | "invoice"
  | "shopping-cart"
  | "blog-post"
  | "settings"
  | "api-response"
  | "configuration"
  | "deep-nested"
  | "large-dataset";

export type WorkspaceTab =
  "raw" | "tree" | "side-by-side" | "patch" | "merge" | "visual" | "formatter";

export type InspectorTab = "diff" | "patch" | "stats" | "performance" | "code";

export type MergeStrategyUi = "latest-wins" | "manual";

export interface LabDiffOptions {
  readonly maxDepth: number;
  readonly includeUnchanged: boolean;
  readonly treatUndefinedAsMissing: boolean;
  readonly circular: CircularReferenceStrategy;
  readonly detectMoves: boolean;
  readonly ignorePaths: string;
  readonly includePaths: string;
  readonly identityKey: string;
}

export interface LabPatchOptions {
  readonly format: PatchFormat;
  readonly optimize: boolean;
  readonly validate: boolean;
  readonly mutable: boolean;
}

export interface LabMergeOptions {
  readonly enabled: boolean;
  readonly strategy: MergeStrategyUi;
  readonly baseJson: string;
}

export interface LabPerformanceOptions {
  readonly benchmarkMode: boolean;
  readonly timing: boolean;
  readonly largeDataset: boolean;
  readonly stressTest: boolean;
}

export interface LabConfig {
  readonly templateId: SnapshotTemplateId;
  readonly snapshotA: string;
  readonly snapshotB: string;
  readonly diff: LabDiffOptions;
  readonly patch: LabPatchOptions;
  readonly merge: LabMergeOptions;
  readonly format: SerializeFormat;
  readonly performance: LabPerformanceOptions;
  /** Inject circular refs after parse (JSON cannot express them). */
  readonly injectCircular: boolean;
}

export const DEFAULT_DIFF_OPTIONS: LabDiffOptions = {
  maxDepth: 0,
  includeUnchanged: false,
  treatUndefinedAsMissing: false,
  circular: "error",
  detectMoves: false,
  ignorePaths: "",
  includePaths: "",
  identityKey: "",
};

export const DEFAULT_PATCH_OPTIONS: LabPatchOptions = {
  format: "json-patch",
  optimize: false,
  validate: true,
  mutable: false,
};

export const DEFAULT_MERGE_OPTIONS: LabMergeOptions = {
  enabled: false,
  strategy: "latest-wins",
  baseJson: "{\n  \n}",
};

export const DEFAULT_PERFORMANCE_OPTIONS: LabPerformanceOptions = {
  benchmarkMode: false,
  timing: true,
  largeDataset: false,
  stressTest: false,
};

export const DEFAULT_LAB_CONFIG: LabConfig = {
  templateId: "user-profile",
  snapshotA: "{}",
  snapshotB: "{}",
  diff: DEFAULT_DIFF_OPTIONS,
  patch: DEFAULT_PATCH_OPTIONS,
  merge: DEFAULT_MERGE_OPTIONS,
  format: "pretty",
  performance: DEFAULT_PERFORMANCE_OPTIONS,
  injectCircular: false,
};

export interface LabConsoleEntry {
  readonly id: string;
  readonly at: string;
  readonly level: "info" | "warn" | "error" | "success";
  readonly category: string;
  readonly message: string;
  readonly durationMs?: number;
  readonly payload?: string;
}

export interface LabTimings {
  readonly compareMs: number;
  readonly patchMs: number;
  readonly serializeMs: number;
  readonly mergeMs: number | null;
  readonly totalMs: number;
}

export interface LabBenchmarkRun {
  readonly id: string;
  readonly at: string;
  readonly label: string;
  readonly compareMs: number;
  readonly patchMs: number;
  readonly nodes: number;
  readonly ops: number;
}

export interface SnapshotTemplate {
  readonly id: SnapshotTemplateId;
  readonly label: string;
  readonly description: string;
  readonly docsPath: string;
  readonly before: unknown;
  readonly after: unknown;
  readonly base?: unknown;
}
