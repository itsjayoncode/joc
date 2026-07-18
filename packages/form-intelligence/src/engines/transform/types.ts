import type { Formatter, Parser } from "../../format/types.js";
import type { FieldPath } from "../../types/index.js";

export type TransformStageName =
  | "raw"
  | "trim"
  | "normalize"
  | "sanitize"
  | "parse"
  | "custom"
  | "validateHandoff"
  | "workflowHandoff";

/**
 * Fixed inbound stage order (Alg 8 / 13_TRANSFORM_ENGINE).
 * Format/display is outbound-only and is not part of this list.
 */
export const TRANSFORM_INBOUND_ORDER = [
  "trim",
  "normalize",
  "sanitize",
  "custom",
  "parse",
] as const satisfies readonly TransformStageName[];

export type TransformInboundStage = (typeof TRANSFORM_INBOUND_ORDER)[number];

export interface TransformContext<
  TValues extends Record<string, unknown> = Record<string, unknown>,
> {
  readonly path: FieldPath;
  readonly values: TValues;
  readonly signal?: AbortSignal;
}

export type TransformFn<TValues extends Record<string, unknown> = Record<string, unknown>> = (
  value: unknown,
  ctx: TransformContext<TValues>,
) => unknown;

export interface SanitizeOptions {
  /** Strip simple HTML tags. Default true when `sanitize: true`. */
  readonly stripHtml?: boolean;
  /** Strip C0 control chars except tab/newline. Default true when `sanitize: true`. */
  readonly stripControlChars?: boolean;
}

export interface TransformPipelineOptions {
  readonly trim?: boolean | "start" | "end" | "both";
  readonly normalize?: boolean | "nfc" | "nfd";
  readonly sanitize?: boolean | SanitizeOptions;
  readonly parse?: Parser;
  readonly stages?: readonly TransformFn[];
}

export interface TransformPipelineHandle {
  pipe(...stages: TransformFn[]): TransformPipelineHandle;
  clear(): void;
}

export interface CompiledTransform {
  readonly inbound: readonly TransformFn[];
  readonly outbound?: Formatter;
}
