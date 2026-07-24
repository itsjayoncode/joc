/**
 * Upload transport — opt-in multipart progress/abort (ADR-FILE-002).
 *
 * @packageDocumentation
 */

export { uploadTransport } from "./plugin.js";
export { xhrMultipartUpload, UploadTransportError } from "./xhr-multipart.js";
export { getLastUploadProgress } from "./registry.js";
export type {
  UploadProgress,
  UploadResult,
  UploadTransportContext,
  UploadTransportFn,
  UploadTransportOptions,
} from "./types.js";
