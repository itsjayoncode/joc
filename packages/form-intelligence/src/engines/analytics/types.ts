export type FieldPath = string;

export interface FormAnalyticsSnapshot {
  readonly startedAt: number;
  readonly completedAt: number | null;
  readonly errorCount: number;
  readonly errorsByField: Readonly<Record<FieldPath, number>>;
  readonly abandonedAt: number | null;
  readonly currentStep: number;
  readonly fieldViews: Readonly<Record<FieldPath, number>>;
  readonly dropOffField: FieldPath | null;
  /** Duration from start to successful submit; null if not completed. */
  readonly timeToCompleteMs: number | null;
  /** Duration from start to first recorded field error; null if none. */
  readonly timeToFirstErrorMs: number | null;
}

export interface AnalyticsPrivacyOptions {
  /** When set, only these paths appear in path-keyed metrics (deny-by-default for others). */
  readonly includePaths?: readonly FieldPath[];
  /** Paths omitted from path-keyed metrics (applied after includePaths). */
  readonly excludePaths?: readonly FieldPath[];
}

export interface AnalyticsRuntimeOptions extends AnalyticsPrivacyOptions {
  readonly onSnapshot?: (snapshot: FormAnalyticsSnapshot) => void;
}

/** True when a path may be recorded in analytics path maps. */
export function isAnalyticsPathAllowed(
  path: FieldPath,
  options: AnalyticsPrivacyOptions = {},
): boolean {
  if (options.includePaths && options.includePaths.length > 0) {
    if (!options.includePaths.includes(path)) {
      return false;
    }
  }
  if (options.excludePaths?.includes(path)) {
    return false;
  }
  return true;
}

export function filterPathRecord(
  record: Readonly<Record<FieldPath, number>>,
  options: AnalyticsPrivacyOptions,
): Record<FieldPath, number> {
  const next: Record<FieldPath, number> = {};
  for (const [path, count] of Object.entries(record)) {
    if (isAnalyticsPathAllowed(path, options)) {
      next[path] = count;
    }
  }
  return next;
}
