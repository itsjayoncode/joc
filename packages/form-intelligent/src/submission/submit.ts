import { SubmitError } from "../errors/index.js";

import type { SubmitOptions } from "../types/index.js";

export interface SubmissionContext<TValues extends Record<string, unknown>> {
  readonly values: TValues;
  readonly submitCount: number;
  readonly signal: AbortSignal;
}

export async function executeSubmit<TValues extends Record<string, unknown>>(input: {
  values: TValues;
  submitCount: number;
  onSubmit?: (values: TValues) => void | Promise<void>;
  onSubmitError?: (error: unknown) => void;
  options?: SubmitOptions;
}): Promise<{ ok: boolean; submitCount: number }> {
  if (!input.onSubmit) {
    throw new SubmitError("Form does not define an onSubmit handler.");
  }

  const controller = new AbortController();

  try {
    await input.onSubmit(input.values);
    return { ok: true, submitCount: input.submitCount + 1 };
  } catch (error) {
    input.onSubmitError?.(error);
    throw new SubmitError("Submit handler failed.", { cause: error });
  } finally {
    controller.abort();
  }
}
