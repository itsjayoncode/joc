import { buildInboundStages } from "./stages.js";
import { TRANSFORM_INBOUND_ORDER } from "./types.js";

import type { TransformContext, TransformFn, TransformPipelineOptions } from "./types.js";
import type { Formatter } from "../../format/types.js";

export interface TransformPipeline {
  /** Raw → canonical (pre-validation). */
  inbound(raw: unknown, ctx: TransformContext): unknown;
  /** Canonical → display (Format / outbound). */
  outbound(canonical: unknown, ctx: TransformContext): unknown;
  readonly stages: readonly TransformFn[];
}

/**
 * Compile a reusable inbound transform pipeline.
 * Stage order is fixed: trim → normalize → sanitize → custom → parse.
 */
export function createTransformPipeline(
  options: TransformPipelineOptions = {},
  outbound?: Formatter,
): TransformPipeline {
  const stages = buildInboundStages(options);

  return {
    stages,
    inbound(raw, ctx) {
      let current = raw;
      for (const stage of stages) {
        current = stage(current, ctx);
      }
      return current;
    },
    outbound(canonical, _ctx) {
      return outbound ? outbound(canonical) : canonical;
    },
  };
}

export function runTransformInbound<
  TValues extends Record<string, unknown> = Record<string, unknown>,
>(
  raw: unknown,
  options: TransformPipelineOptions | readonly TransformFn<TValues>[] | undefined,
  ctx: TransformContext<TValues>,
): unknown {
  if (!options) {
    return raw;
  }

  if (Array.isArray(options)) {
    let current = raw;
    for (const stage of options as readonly TransformFn<TValues>[]) {
      current = stage(current, ctx);
    }
    return current;
  }

  const pipelineOptions = options as TransformPipelineOptions;
  return createTransformPipeline(pipelineOptions).inbound(raw, ctx);
}

export { TRANSFORM_INBOUND_ORDER };
