import { FORM_INTELLIGENT_VERSION } from "../version.js";

/**
 * Documented interceptor stages (Phase 15).
 * Onion `useMiddleware` + plugin hooks share this map (D-MW-VS-PLUGIN).
 */
export const PLUGIN_PIPELINE_STAGES = [
  "beforeValidate",
  "validate",
  "afterValidate",
  "beforeSubmit",
  "submit",
  "afterSubmit",
  "submitError",
] as const;

export type PluginPipelineStage = (typeof PLUGIN_PIPELINE_STAGES)[number];

export interface PluginErrorReport {
  readonly plugin?: string;
  readonly hook?: string;
  readonly phase?: string;
  readonly error: unknown;
}

export type PluginErrorHandler = (report: PluginErrorReport) => void;

/**
 * Minimal semver range check for plugin `engines` metadata.
 * Supports: `>=x.y.z`, `^x.y.z`, exact `x.y.z`.
 */
export function satisfiesEnginesRange(
  range: string,
  version: string = FORM_INTELLIGENT_VERSION,
): boolean {
  const trimmed = range.trim();
  const current = parseSemver(version);
  if (!current) {
    return true;
  }

  if (trimmed.startsWith(">=")) {
    const min = parseSemver(trimmed.slice(2).trim());
    return min ? compareSemver(current, min) >= 0 : true;
  }

  if (trimmed.startsWith("^")) {
    const base = parseSemver(trimmed.slice(1).trim());
    if (!base) {
      return true;
    }
    if (current.major !== base.major) {
      return false;
    }
    return compareSemver(current, base) >= 0;
  }

  const exact = parseSemver(trimmed);
  return exact ? compareSemver(current, exact) === 0 : true;
}

interface Semver {
  readonly major: number;
  readonly minor: number;
  readonly patch: number;
}

function parseSemver(input: string): Semver | null {
  const match = /^(\d+)\.(\d+)\.(\d+)/.exec(input.trim());
  if (!match) {
    return null;
  }
  return {
    major: Number(match[1]),
    minor: Number(match[2]),
    patch: Number(match[3]),
  };
}

function compareSemver(left: Semver, right: Semver): number {
  if (left.major !== right.major) {
    return left.major - right.major;
  }
  if (left.minor !== right.minor) {
    return left.minor - right.minor;
  }
  return left.patch - right.patch;
}
