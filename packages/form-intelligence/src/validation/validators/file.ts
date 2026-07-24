import { tagValidator } from "../validator-kind.js";
import { asFileList, fileMatchesAccept, parseByteSize } from "./file-utils.js";

import type { Validator } from "../../types/index.js";

export type FileSizeInput = number | string;

/**
 * Require every selected file to match HTML-like `accept` tokens
 * (extensions `.png`, MIME `image/png`, or wildcards `image/*`).
 */
export const accept = (pattern: string | readonly string[]): Validator =>
  tagValidator((value) => {
    const files = asFileList(value);
    if (files.length === 0) {
      return true;
    }
    for (const file of files) {
      if (!fileMatchesAccept(file, pattern)) {
        return `File type not allowed (${file.name}).`;
      }
    }
    return true;
  }, "accept");

/** Maximum size per file (bytes or `"5MB"`). */
export const maxSize = (limit: FileSizeInput): Validator => {
  const maxBytes = parseByteSize(limit);
  return tagValidator((value) => {
    const files = asFileList(value);
    for (const file of files) {
      if (file.size > maxBytes) {
        return `File is too large (${file.name}).`;
      }
    }
    return true;
  }, "maxSize");
};

/** Minimum size per file (bytes or `"1KB"`). Empty selection passes. */
export const minSize = (limit: FileSizeInput): Validator => {
  const minBytes = parseByteSize(limit);
  return tagValidator((value) => {
    const files = asFileList(value);
    if (files.length === 0) {
      return true;
    }
    for (const file of files) {
      if (file.size < minBytes) {
        return `File is too small (${file.name}).`;
      }
    }
    return true;
  }, "minSize");
};

/** Maximum number of selected files. */
export const maxFiles = (limit: number): Validator =>
  tagValidator((value) => {
    if (!Number.isFinite(limit) || limit < 0) {
      return true;
    }
    const files = asFileList(value);
    if (files.length > limit) {
      return `Select at most ${String(limit)} file${limit === 1 ? "" : "s"}.`;
    }
    return true;
  }, "maxFiles");

/** Minimum number of selected files. Empty still fails when limit > 0. */
export const minFiles = (limit: number): Validator =>
  tagValidator((value) => {
    if (!Number.isFinite(limit) || limit <= 0) {
      return true;
    }
    const files = asFileList(value);
    if (files.length < limit) {
      return `Select at least ${String(limit)} file${limit === 1 ? "" : "s"}.`;
    }
    return true;
  }, "minFiles");
