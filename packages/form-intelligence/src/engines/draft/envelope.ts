import { mergeDraftValues, sanitizeDraftRecord, type DraftMergeMode } from "./merge.js";

/** Versioned draft envelope (opt-in via `DraftConfig.versioning` or wizard step persist). */
export interface DraftEnvelopeV1 {
  readonly version: 1;
  readonly formId?: string;
  readonly schemaVersion?: string;
  readonly savedAt: number;
  readonly values: Record<string, unknown>;
  readonly workflow?: { readonly currentStep: number };
}

export type DraftMigrateFn = (envelope: DraftEnvelopeV1) => DraftEnvelopeV1;

export interface DraftEnvelopeOptions {
  readonly versioning?: boolean;
  readonly schemaVersion?: string;
  readonly formId?: string;
  readonly migrateDraft?: DraftMigrateFn;
  readonly workflow?: { readonly currentStep: number };
  /** Wrap an envelope even when `versioning` is false (e.g. persist wizard step). */
  readonly persistWorkflow?: boolean;
}

export type ParsedDraftPayload =
  | { readonly kind: "raw"; readonly values: Record<string, unknown> }
  | { readonly kind: "envelope"; readonly envelope: DraftEnvelopeV1 }
  | { readonly kind: "corrupt" }
  | { readonly kind: "empty" };

export function isDraftEnvelopeV1(value: unknown): value is DraftEnvelopeV1 {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }
  const candidate = value as Record<string, unknown>;
  return (
    candidate.version === 1 &&
    typeof candidate.savedAt === "number" &&
    candidate.values !== null &&
    typeof candidate.values === "object" &&
    !Array.isArray(candidate.values)
  );
}

export function parseDraftPayload(raw: Record<string, unknown> | null): ParsedDraftPayload {
  if (!raw) {
    return { kind: "empty" };
  }

  if (isDraftEnvelopeV1(raw)) {
    return { kind: "envelope", envelope: raw };
  }

  // Raw values blob (v0) — must not look like a broken envelope.
  if ("version" in raw && raw.version !== undefined && raw.version !== 1) {
    return { kind: "corrupt" };
  }

  return { kind: "raw", values: raw };
}

export function wrapDraftEnvelope(
  values: Record<string, unknown>,
  options: DraftEnvelopeOptions = {},
): DraftEnvelopeV1 | Record<string, unknown> {
  const safe = sanitizeDraftRecord(values);
  const shouldWrap = options.versioning === true || options.persistWorkflow === true;
  if (!shouldWrap) {
    return safe;
  }

  return {
    version: 1,
    savedAt: Date.now(),
    values: safe,
    ...(options.formId ? { formId: options.formId } : {}),
    ...(options.schemaVersion ? { schemaVersion: options.schemaVersion } : {}),
    ...(options.workflow ? { workflow: options.workflow } : {}),
  };
}

/**
 * Stable fingerprint of draft *content* (values + wizard step), ignoring `savedAt`
 * and other volatile envelope metadata. Used by `onRestoreDecline: "remember"`.
 */
export function draftContentSignature(raw: Record<string, unknown> | null): string {
  if (!raw) {
    return "";
  }

  const resolved = resolveDraftValuesFromPayload(raw);
  if (!resolved.values) {
    try {
      return JSON.stringify(sanitizeDraftRecord(raw));
    } catch {
      return "";
    }
  }

  try {
    return JSON.stringify({
      values: resolved.values,
      ...(resolved.workflow?.currentStep !== undefined
        ? { step: resolved.workflow.currentStep }
        : {}),
    });
  } catch {
    return "";
  }
}

export function resolveDraftValuesFromPayload(
  raw: Record<string, unknown> | null,
  options: DraftEnvelopeOptions = {},
): {
  readonly values: Record<string, unknown> | null;
  readonly workflow?: { readonly currentStep: number };
  readonly reason?: "empty" | "corrupt" | "version_mismatch";
} {
  const parsed = parseDraftPayload(raw);
  if (parsed.kind === "empty") {
    return { values: null, reason: "empty" };
  }
  if (parsed.kind === "corrupt") {
    return { values: null, reason: "corrupt" };
  }

  if (parsed.kind === "raw") {
    return { values: sanitizeDraftRecord(parsed.values) };
  }

  let envelope = parsed.envelope;
  if (options.migrateDraft) {
    try {
      envelope = options.migrateDraft(envelope);
    } catch {
      return { values: null, reason: "version_mismatch" };
    }
  }

  if (!isDraftEnvelopeV1(envelope)) {
    return { values: null, reason: "corrupt" };
  }

  if (
    options.schemaVersion !== undefined &&
    envelope.schemaVersion !== undefined &&
    envelope.schemaVersion !== options.schemaVersion &&
    !options.migrateDraft
  ) {
    return { values: null, reason: "version_mismatch" };
  }

  return {
    values: sanitizeDraftRecord(envelope.values),
    ...(envelope.workflow ? { workflow: envelope.workflow } : {}),
  };
}

export function applyDraftRestore<TValues extends Record<string, unknown>>(input: {
  readonly defaults: TValues;
  readonly raw: Record<string, unknown> | null;
  readonly merge?: DraftMergeMode;
  readonly envelope?: DraftEnvelopeOptions;
}): {
  readonly values: TValues;
  readonly restored: boolean;
  readonly workflow?: { readonly currentStep: number };
  readonly reason?: "empty" | "corrupt" | "version_mismatch";
} {
  const resolved = resolveDraftValuesFromPayload(input.raw, input.envelope ?? {});
  if (!resolved.values) {
    return {
      values: input.defaults,
      restored: false,
      ...(resolved.reason ? { reason: resolved.reason } : { reason: "empty" as const }),
    };
  }

  return {
    values: mergeDraftValues(input.defaults, resolved.values, input.merge ?? "overlay"),
    restored: true,
    ...(resolved.workflow ? { workflow: resolved.workflow } : {}),
  };
}
