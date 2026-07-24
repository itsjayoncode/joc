# Upload transport

Opt-in multipart upload with progress and abort — without turning Form Intelligence into an upload framework.

**Related:** [Adapters → File inputs](/packages/form-intelligence/modules/adapters#file-inputs) · [Submission](/packages/form-intelligence/modules/submission) · [Entrypoints](/packages/form-intelligence/modules/entrypoints)

## Import path

```ts
import { uploadTransport } from "@jayoncode/form-intelligence/upload";
```

| Need                     | Import                                |
| ------------------------ | ------------------------------------- |
| Plugin + XHR helper      | `@jayoncode/form-intelligence/upload` |
| File values / validators | main package (see Adapters)           |

Core stays free of upload networking unless this plugin is registered.

## Basic usage

```ts
import { createForm } from "@jayoncode/form-intelligence";
import { uploadTransport } from "@jayoncode/form-intelligence/upload";

createForm({
  target: "#profile",
  initialValues: { name: "", avatar: [] },
  schema: { avatar: "file" },
  plugins: [
    uploadTransport({
      url: "/api/upload",
      onProgress: (p) => {
        // p.loaded / p.total / p.percent (percent may be null)
      },
    }),
  ],
  onSubmit(values, meta) {
    // Optional: runs after a successful upload when files were sent.
    // meta.upload → { status, responseText, response }
  },
});
```

By default (`whenFilesOnly: true`), JSON-only submits call `onSubmit` as usual. Submits that include files POST multipart `FormData` via XHR (so upload progress works).

Cancel with `form.cancelSubmit()` — the transport honors the submit `AbortSignal`. A late XHR `onload` after cancel is treated as abort (no `onComplete` / `onSubmit`).

## Options

| Option          | Default  | Description                                                                                           |
| --------------- | -------- | ----------------------------------------------------------------------------------------------------- |
| `url`           | —        | Target URL for the built-in XHR transport (required unless `transport` / `buildRequest` supplies one) |
| `method`        | `"POST"` | HTTP method                                                                                           |
| `headers`       | —        | Request headers (`Content-Type` is omitted so the browser sets the multipart boundary)                |
| `buildRequest`  | —        | Per-submit `{ url, method?, headers? }` from values + FormData                                        |
| `transport`     | —        | Custom uploader `(formData, { values, signal, onProgress })` — use for presigned / direct-to-cloud    |
| `whenFilesOnly` | `true`   | Only intercept multipart payloads; otherwise always upload `FormData`                                 |
| `onProgress`    | —        | `{ loaded, total, percent }`                                                                          |
| `onComplete`    | —        | Called with `{ status, responseText, response }`                                                      |
| `onError`       | —        | Called before the error is rethrown into the submit pipeline                                          |

## Events

| Event             | Payload          |
| ----------------- | ---------------- |
| `upload:progress` | `UploadProgress` |
| `upload:complete` | `UploadResult`   |
| `upload:error`    | `unknown`        |

```ts
form.on("upload:progress", (progress) => {
  /* … */
});
```

## Custom transport

Presigned URLs and cloud SDKs stay **app-owned**:

```ts
uploadTransport({
  transport: async (formData, { signal, onProgress }) => {
    // Your PUT/POST to a presigned URL, S3 SDK, etc.
    // Call onProgress when you can; honor signal.
    return { status: 200, responseText: "", response: null };
  },
});
```

## Explicit non-goals

- Chunking / resumable / tus
- Built-in S3 / Azure / GCS clients
- Background uploads / service workers
- Persisting file selections in drafts (see Phase A ephemeral rules)

## Related

- [Adapters → File inputs](/packages/form-intelligence/modules/adapters#file-inputs)
- [Submission](/packages/form-intelligence/modules/submission)
- [Plugins](/packages/form-intelligence/modules/plugins)
