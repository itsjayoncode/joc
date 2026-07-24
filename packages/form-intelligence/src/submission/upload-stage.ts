import type { FormInstance, SubmitMeta } from "../types/index.js";

/**
 * Upload submit override — pipeline slot that wraps `onSubmit` when
 * `@jayoncode/form-intelligence/upload` registers (ADR-FILE-002).
 * Lives under `/submission` so core never imports the `/upload` XHR module.
 */

export type UploadSubmitHandler<TValues extends Record<string, unknown>> = (
  values: TValues,
  meta: SubmitMeta | undefined,
  originalOnSubmit: ((values: TValues, meta?: SubmitMeta) => void | Promise<void>) | undefined,
) => Promise<void>;

interface UploadTransportRegistration<TValues extends Record<string, unknown>> {
  readonly submit: UploadSubmitHandler<TValues>;
}

const registrations = new WeakMap<
  FormInstance<Record<string, unknown>>,
  UploadTransportRegistration<Record<string, unknown>>
>();

export function registerUploadTransport<TValues extends Record<string, unknown>>(
  form: FormInstance<TValues>,
  submit: UploadSubmitHandler<TValues>,
): () => void {
  const formLike = form as FormInstance<Record<string, unknown>>;
  const registration: UploadTransportRegistration<Record<string, unknown>> = {
    submit: submit as UploadSubmitHandler<Record<string, unknown>>,
  };
  registrations.set(formLike, registration);
  return () => {
    if (registrations.get(formLike) === registration) {
      registrations.delete(formLike);
    }
  };
}

export function resolveSubmitHandler<TValues extends Record<string, unknown>>(
  form: FormInstance<TValues>,
  originalOnSubmit: ((values: TValues, meta?: SubmitMeta) => void | Promise<void>) | undefined,
): ((values: TValues, meta?: SubmitMeta) => void | Promise<void>) | undefined {
  const registration = registrations.get(form as FormInstance<Record<string, unknown>>);
  if (!registration) {
    return originalOnSubmit;
  }

  return async (values, meta) => {
    await registration.submit(
      values as Record<string, unknown>,
      meta,
      originalOnSubmit as
        ((values: Record<string, unknown>, meta?: SubmitMeta) => void | Promise<void>) | undefined,
    );
  };
}
