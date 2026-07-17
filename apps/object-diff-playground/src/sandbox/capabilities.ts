import type { LabConfig } from "./types.js";

/**
 * Extensibility registry for lab capabilities.
 * Future engines/plugins register here so config, inspector, console,
 * and generated code pick them up without redesigning the lab shell.
 */
export interface LabCapability {
  readonly id: string;
  readonly label: string;
  readonly group: "diff" | "patch" | "merge" | "formatter" | "performance" | "plugins";
  readonly docsPath: string;
  readonly description: string;
  readonly isEnabled: (config: LabConfig) => boolean;
  readonly codeHint?: (config: LabConfig) => string | undefined;
}

export const LAB_CAPABILITIES: readonly LabCapability[] = [
  {
    id: "detect-moves",
    label: "Detect moves",
    group: "diff",
    docsPath: "/modules/diff",
    description: "Pair equal removed+added values into moved records.",
    isEnabled: (c) => c.diff.detectMoves,
    codeHint: (c) => (c.diff.detectMoves ? "detectMoves: true" : undefined),
  },
  {
    id: "include-unchanged",
    label: "Include unchanged",
    group: "diff",
    docsPath: "/modules/diff",
    description: "Emit unchanged records alongside changes.",
    isEnabled: (c) => c.diff.includeUnchanged,
  },
  {
    id: "circular-skip",
    label: "Skip circular refs",
    group: "diff",
    docsPath: "/modules/diff",
    description: 'circular: "skip" instead of throwing.',
    isEnabled: (c) => c.diff.circular === "skip",
  },
  {
    id: "identity-key",
    label: "Identity matching",
    group: "diff",
    docsPath: "/modules/diff",
    description: "Match array elements by identity key.",
    isEnabled: (c) => c.diff.identityKey.trim().length > 0,
    codeHint: (c) =>
      c.diff.identityKey.trim() ? `identityKey: "${c.diff.identityKey.trim()}"` : undefined,
  },
  {
    id: "optimize-patch",
    label: "Optimize patch",
    group: "patch",
    docsPath: "/modules/patch",
    description: "Coalesce sequential replaces / drop noise.",
    isEnabled: (c) => c.patch.optimize,
  },
  {
    id: "validate-patch",
    label: "Validate patch",
    group: "patch",
    docsPath: "/modules/patch",
    description: "Validate operations before apply.",
    isEnabled: (c) => c.patch.validate,
  },
  {
    id: "merge-lab",
    label: "Merge laboratory",
    group: "merge",
    docsPath: "/modules/merge",
    description: "Run three-way merge (base + A + B).",
    isEnabled: (c) => c.merge.enabled,
  },
  {
    id: "benchmark",
    label: "Benchmark mode",
    group: "performance",
    docsPath: "/modules/performance",
    description: "Record repeated timing runs in history.",
    isEnabled: (c) => c.performance.benchmarkMode,
  },
];

export function capabilitiesByGroup(group: LabCapability["group"]): readonly LabCapability[] {
  return LAB_CAPABILITIES.filter((entry) => entry.group === group);
}

export function activeCapabilityLabels(config: LabConfig): readonly string[] {
  return LAB_CAPABILITIES.filter((entry) => entry.isEnabled(config)).map((entry) => entry.label);
}
