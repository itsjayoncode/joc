import { setLastUploadProgress } from "./registry.js";
import { xhrMultipartUpload } from "./xhr-multipart.js";
import { SubmitError } from "../errors/index.js";
import { registerUploadTransport } from "../submission/upload-stage.js";

import type { UploadProgress, UploadResult, UploadTransportOptions } from "./types.js";
import type { FormInstance, FormPlugin, SubmitMeta } from "../types/index.js";

function normalizeResult(result: UploadResult | void | undefined): UploadResult {
  if (result && typeof result === "object" && "status" in result) {
    return result;
  }
  return {
    status: 200,
    responseText: "",
    response: null,
  };
}

function abortError(): Error {
  const error = new Error("Upload aborted.");
  error.name = "AbortError";
  return error;
}

/**
 * Opt-in multipart upload transport with progress and abort (ADR-FILE-002).
 *
 * @example
 * ```ts
 * import { uploadTransport } from "@jayoncode/form-intelligence/upload";
 *
 * createForm({
 *   plugins: [
 *     uploadTransport({
 *       url: "/api/upload",
 *       onProgress: (p) => setPct(p.percent),
 *     }),
 *   ],
 * });
 * ```
 */
export function uploadTransport<TValues extends Record<string, unknown> = Record<string, unknown>>(
  options: UploadTransportOptions<TValues>,
): FormPlugin<TValues> {
  if (!options.transport && !options.url && !options.buildRequest) {
    throw new Error("uploadTransport requires `url`, `buildRequest`, or `transport`.");
  }

  const whenFilesOnly = options.whenFilesOnly !== false;

  return {
    name: "upload-transport",
    setup(form) {
      const formLike = form as FormInstance<Record<string, unknown>>;

      const unregister = registerUploadTransport(
        formLike,
        async (values, meta, originalOnSubmit) => {
          const payload = formLike.payload();
          const shouldUpload = !whenFilesOnly || payload.kind === "multipart";

          if (!shouldUpload) {
            if (!originalOnSubmit) {
              throw new SubmitError("Form does not define an onSubmit handler.");
            }
            await originalOnSubmit(values as TValues, meta);
            return;
          }

          const formData = payload.kind === "multipart" ? payload.formData : formLike.toFormData();
          const signal = meta?.signal ?? new AbortController().signal;

          const reportProgress = (progress: UploadProgress): void => {
            if (signal.aborted) {
              return;
            }
            setLastUploadProgress(formLike, progress);
            options.onProgress?.(progress);
            formLike.emit("upload:progress", progress);
          };

          try {
            let result: UploadResult;

            if (options.transport) {
              result = normalizeResult(
                await options.transport(formData, {
                  values: values as TValues,
                  signal,
                  onProgress: reportProgress,
                }),
              );
            } else {
              const built = options.buildRequest?.({
                values: values as TValues,
                formData,
              });
              const url = built?.url ?? options.url;
              if (!url) {
                throw new Error(
                  "uploadTransport requires `url` or `buildRequest` returning a url.",
                );
              }
              const method = built?.method ?? options.method;
              const headers = built?.headers ?? options.headers;
              result = await xhrMultipartUpload({
                url,
                formData,
                signal,
                onProgress: reportProgress,
                ...(method !== undefined ? { method } : {}),
                ...(headers !== undefined ? { headers } : {}),
              });
            }

            if (signal.aborted) {
              throw abortError();
            }

            options.onComplete?.(result);
            formLike.emit("upload:complete", result);

            const submitMeta: SubmitMeta = {
              ...(meta ?? {}),
              upload: {
                status: result.status,
                responseText: result.responseText,
                response: result.response,
              },
            };

            if (originalOnSubmit) {
              if (signal.aborted) {
                throw abortError();
              }
              await originalOnSubmit(values as TValues, submitMeta);
            }
          } catch (error) {
            options.onError?.(error);
            formLike.emit("upload:error", error);
            throw error;
          }
        },
      );

      return unregister;
    },
  };
}
