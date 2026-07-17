/**
 * Public middleware entry — same stack as plugin hooks (D-MW-VS-PLUGIN).
 *
 * @see MIDDLEWARE_HOOK_MAP for hook ↔ phase mapping
 * @see PLUGIN_PIPELINE_STAGES for documented stage order
 */
export {
  MIDDLEWARE_HOOK_MAP,
  MIDDLEWARE_ONLY_PHASES,
  MiddlewarePipeline,
  composeMiddleware,
  runMiddlewareChain,
} from "../plugins/middleware.js";
export { PLUGIN_PIPELINE_STAGES } from "../plugins/compat.js";
export type { PluginPipelineStage } from "../plugins/compat.js";
export type {
  FormMiddleware,
  MiddlewareContext,
  MiddlewareInput,
  MiddlewareNext,
  MiddlewarePhase,
  MiddlewareRegistration,
  MiddlewareRunResult,
  PluginMiddleware,
} from "../plugins/middleware.js";
