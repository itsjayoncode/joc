import type { UploadProgress, UploadResult, UploadTransportFn } from "./types.js";
import type { FormInstance } from "../types/index.js";

const lastProgress = new WeakMap<FormInstance<Record<string, unknown>>, UploadProgress>();

export function setLastUploadProgress(
  form: FormInstance<Record<string, unknown>>,
  progress: UploadProgress,
): void {
  lastProgress.set(form, progress);
}

export function getLastUploadProgress(
  form: FormInstance<Record<string, unknown>>,
): UploadProgress | undefined {
  return lastProgress.get(form);
}

export type { UploadTransportFn, UploadResult, UploadProgress };
