export interface UploadProgress {
  readonly loaded: number;
  readonly total: number;
  /** 0–100 when `total` is known; otherwise `null`. */
  readonly percent: number | null;
}

export interface UploadResult {
  readonly status: number;
  readonly responseText: string;
  readonly response: unknown;
}

export interface UploadTransportContext<
  TValues extends Record<string, unknown> = Record<string, unknown>,
> {
  readonly values: TValues;
  readonly signal: AbortSignal;
  readonly onProgress: (progress: UploadProgress) => void;
}

export type UploadTransportFn<TValues extends Record<string, unknown> = Record<string, unknown>> = (
  formData: FormData,
  context: UploadTransportContext<TValues>,
) => Promise<UploadResult | void> | UploadResult | void;

export interface UploadTransportOptions<
  TValues extends Record<string, unknown> = Record<string, unknown>,
> {
  /** Target URL for the built-in XHR multipart transport. Required unless `transport` is set. */
  readonly url?: string;
  readonly method?: string;
  readonly headers?: Readonly<Record<string, string>>;
  /** Customize URL/method/headers per submit. */
  readonly buildRequest?: (input: { readonly values: TValues; readonly formData: FormData }) => {
    readonly url: string;
    readonly method?: string;
    readonly headers?: Readonly<Record<string, string>>;
  };
  /** Replace the built-in XHR transport (e.g. presigned PUT). */
  readonly transport?: UploadTransportFn<TValues>;
  /**
   * When true (default), only intercept submits that include files.
   * JSON-only submits call `onSubmit` as usual.
   */
  readonly whenFilesOnly?: boolean;
  readonly onProgress?: (progress: UploadProgress) => void;
  readonly onComplete?: (result: UploadResult) => void;
  readonly onError?: (error: unknown) => void;
}
