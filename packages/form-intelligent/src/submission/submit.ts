import { SubmissionController } from "./cancel.js";
import { SubmissionLoadingTracker } from "./loading.js";
import {
  normalizeRetryPolicy,
  resolveRetryDelay,
  shouldRetryError,
  waitForRetry,
} from "./retry.js";
import { SubmitError } from "../errors/index.js";

import type { RetryPolicy } from "./retry.js";
import type { FieldPath, SubmitMeta, SubmitOptions } from "../types/index.js";

export interface SubmissionFieldErrors {
  readonly fieldErrors?: Readonly<Record<FieldPath, string>>;
  readonly formError?: string;
}

export interface SubmitResult {
  readonly ok: boolean;
  readonly submitCount: number;
  readonly fieldErrors?: Readonly<Record<FieldPath, string>>;
  readonly formError?: string;
  readonly cancelled?: boolean;
}

export interface SubmissionContext<TValues extends Record<string, unknown>> {
  readonly values: TValues;
  readonly submitCount: number;
  readonly signal: AbortSignal;
  readonly meta?: SubmitMeta;
}

export function isSubmissionFieldErrors(error: unknown): error is SubmissionFieldErrors {
  if (!error || typeof error !== "object") {
    return false;
  }

  const candidate = error as SubmissionFieldErrors;
  return candidate.fieldErrors !== undefined || candidate.formError !== undefined;
}

export function mapSubmissionErrors(error: unknown): {
  readonly fieldErrors: Record<FieldPath, string>;
  readonly formError?: string;
} {
  if (isSubmissionFieldErrors(error)) {
    return {
      fieldErrors: { ...(error.fieldErrors ?? {}) },
      ...(error.formError ? { formError: error.formError } : {}),
    };
  }

  if (error && typeof error === "object" && "errors" in error) {
    const nested = (error as { errors?: unknown }).errors;
    if (nested && typeof nested === "object" && !Array.isArray(nested)) {
      const fieldErrors: Record<FieldPath, string> = {};
      for (const [path, message] of Object.entries(nested as Record<string, unknown>)) {
        if (typeof message === "string" && message.length > 0) {
          fieldErrors[path] = message;
        }
      }
      return { fieldErrors };
    }
  }

  if (error instanceof SubmitError && error.details && typeof error.details === "object") {
    return mapSubmissionErrors(error.details);
  }

  return { fieldErrors: {} };
}

export class SubmissionOrchestrator<TValues extends Record<string, unknown>> {
  private readonly controller = new SubmissionController();
  private readonly loading = new SubmissionLoadingTracker();

  public get loadingState() {
    return this.loading.snapshot();
  }

  public get isActive(): boolean {
    return this.controller.isActive;
  }

  public cancel(): void {
    this.controller.cancel();
    this.loading.end();
  }

  public async execute(input: {
    values: TValues;
    submitCount: number;
    meta?: SubmitMeta;
    onSubmit?: (values: TValues, meta?: SubmitMeta) => void | Promise<void>;
    onSubmitError?: (error: unknown) => void;
    options?: SubmitOptions;
  }): Promise<SubmitResult> {
    if (!input.onSubmit) {
      throw new SubmitError("Form does not define an onSubmit handler.");
    }

    const retryPolicy = normalizeRetryPolicy(input.options?.retry);
    const maxAttempts = retryPolicy.maxAttempts ?? 1;
    const signal = this.controller.begin();
    this.loading.begin();

    let attempt = 0;

    try {
      while (attempt < maxAttempts) {
        attempt += 1;
        this.loading.setAttempt(attempt);

        if (signal.aborted) {
          return {
            ok: false,
            submitCount: input.submitCount,
            cancelled: true,
          };
        }

        const meta: SubmitMeta = {
          ...(input.meta ?? {}),
          signal,
        };

        try {
          await input.onSubmit(input.values, meta);

          return {
            ok: true,
            submitCount: input.submitCount + 1,
          };
        } catch (error) {
          if (signal.aborted || (error instanceof Error && error.name === "AbortError")) {
            return {
              ok: false,
              submitCount: input.submitCount,
              cancelled: true,
            };
          }

          const mapped = mapSubmissionErrors(error);
          const hasMappedErrors =
            Object.keys(mapped.fieldErrors).length > 0 || mapped.formError !== undefined;

          if (!shouldRetryError(retryPolicy, error, attempt, maxAttempts)) {
            input.onSubmitError?.(error);

            if (hasMappedErrors) {
              return {
                ok: false,
                submitCount: input.submitCount,
                fieldErrors: mapped.fieldErrors,
                ...(mapped.formError ? { formError: mapped.formError } : {}),
              };
            }

            throw new SubmitError("Submit handler failed.", { cause: error });
          }

          const delayMs = resolveRetryDelay(retryPolicy, attempt);
          await waitForRetry(delayMs, signal);
        }
      }

      return {
        ok: false,
        submitCount: input.submitCount,
      };
    } finally {
      this.controller.end();
      this.loading.end();
    }
  }
}

export async function executeSubmit<TValues extends Record<string, unknown>>(input: {
  values: TValues;
  submitCount: number;
  meta?: SubmitMeta;
  onSubmit?: (values: TValues, meta?: SubmitMeta) => void | Promise<void>;
  onSubmitError?: (error: unknown) => void;
  options?: SubmitOptions;
}): Promise<{ ok: boolean; submitCount: number }> {
  const orchestrator = new SubmissionOrchestrator<TValues>();
  const result = await orchestrator.execute(input);
  return {
    ok: result.ok,
    submitCount: result.submitCount,
  };
}

export type { RetryPolicy };
