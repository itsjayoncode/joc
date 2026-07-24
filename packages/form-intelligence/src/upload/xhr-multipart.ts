import type { UploadProgress, UploadResult } from "./types.js";

export class UploadTransportError extends Error {
  readonly status?: number;
  readonly responseText?: string;

  constructor(
    message: string,
    options: {
      readonly status?: number;
      readonly responseText?: string;
      readonly cause?: unknown;
    } = {},
  ) {
    super(message, options.cause !== undefined ? { cause: options.cause } : undefined);
    this.name = "UploadTransportError";
    if (options.status !== undefined) {
      this.status = options.status;
    }
    if (options.responseText !== undefined) {
      this.responseText = options.responseText;
    }
  }
}

function parseResponseBody(responseText: string): unknown {
  const trimmed = responseText.trim();
  if (!trimmed) {
    return null;
  }
  try {
    return JSON.parse(trimmed) as unknown;
  } catch {
    return responseText;
  }
}

function abortError(): Error {
  const error = new Error("Upload aborted.");
  error.name = "AbortError";
  return error;
}

/**
 * Multipart POST/PUT via XHR so upload progress is available.
 * Honors `AbortSignal` (wired from `form.cancelSubmit()`).
 */
export function xhrMultipartUpload(input: {
  readonly url: string;
  readonly method?: string;
  readonly headers?: Readonly<Record<string, string>>;
  readonly formData: FormData;
  readonly signal?: AbortSignal;
  readonly onProgress?: (progress: UploadProgress) => void;
}): Promise<UploadResult> {
  const method = input.method ?? "POST";

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    let settled = false;

    const finishReject = (error: Error): void => {
      if (settled) {
        return;
      }
      settled = true;
      input.signal?.removeEventListener("abort", onAbort);
      reject(error);
    };

    const finishResolve = (result: UploadResult): void => {
      if (settled) {
        return;
      }
      if (input.signal?.aborted) {
        finishReject(abortError());
        return;
      }
      settled = true;
      input.signal?.removeEventListener("abort", onAbort);
      resolve(result);
    };

    const onAbort = (): void => {
      xhr.abort();
    };

    xhr.open(method, input.url, true);

    if (input.headers) {
      for (const [key, value] of Object.entries(input.headers)) {
        // Let the browser set multipart boundary.
        if (key.toLowerCase() === "content-type") {
          continue;
        }
        xhr.setRequestHeader(key, value);
      }
    }

    if (input.signal) {
      if (input.signal.aborted) {
        finishReject(abortError());
        return;
      }
      input.signal.addEventListener("abort", onAbort, { once: true });
    }

    xhr.upload.onprogress = (event) => {
      if (!input.onProgress || input.signal?.aborted || settled) {
        return;
      }
      const total = event.lengthComputable ? event.total : 0;
      input.onProgress({
        loaded: event.loaded,
        total,
        percent:
          event.lengthComputable && total > 0 ? Math.round((event.loaded / total) * 100) : null,
      });
    };

    xhr.onload = () => {
      const result: UploadResult = {
        status: xhr.status,
        responseText: xhr.responseText,
        response: parseResponseBody(xhr.responseText),
      };
      if (xhr.status >= 200 && xhr.status < 300) {
        finishResolve(result);
        return;
      }
      finishReject(
        new UploadTransportError(`Upload failed with status ${String(xhr.status)}.`, {
          status: xhr.status,
          responseText: xhr.responseText,
        }),
      );
    };

    xhr.onerror = () => {
      finishReject(new UploadTransportError("Upload network error."));
    };

    xhr.onabort = () => {
      finishReject(abortError());
    };

    xhr.send(input.formData);
  });
}
