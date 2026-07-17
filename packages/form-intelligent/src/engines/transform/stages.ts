import type { SanitizeOptions, TransformFn, TransformPipelineOptions } from "./types.js";

export function createTrimStage(mode: boolean | "start" | "end" | "both"): TransformFn | undefined {
  if (mode === false) {
    return undefined;
  }
  const resolved = mode === true ? "both" : mode;
  return (value) => {
    if (typeof value !== "string") {
      return value;
    }
    switch (resolved) {
      case "start":
        return value.trimStart();
      case "end":
        return value.trimEnd();
      default:
        return value.trim();
    }
  };
}

export function createNormalizeStage(mode: boolean | "nfc" | "nfd"): TransformFn | undefined {
  if (mode === false) {
    return undefined;
  }
  const form = mode === true || mode === "nfc" ? "NFC" : "NFD";
  return (value) => {
    if (typeof value !== "string") {
      return value;
    }
    return value.normalize(form);
  };
}

function resolveSanitizeOptions(sanitize: boolean | SanitizeOptions): SanitizeOptions | undefined {
  if (sanitize === false) {
    return undefined;
  }
  if (sanitize === true) {
    return { stripHtml: true, stripControlChars: true };
  }
  return {
    stripHtml: sanitize.stripHtml !== false,
    stripControlChars: sanitize.stripControlChars !== false,
  };
}

export function createSanitizeStage(
  sanitize: boolean | SanitizeOptions | undefined,
): TransformFn | undefined {
  if (sanitize === undefined || sanitize === false) {
    return undefined;
  }
  const options = resolveSanitizeOptions(sanitize);
  if (!options) {
    return undefined;
  }

  return (value) => {
    if (typeof value !== "string") {
      return value;
    }
    let next = value;
    if (options.stripControlChars) {
      next = next.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "");
    }
    if (options.stripHtml) {
      // Strip well-formed tags, then neutralize residual angle brackets so
      // incomplete markup (e.g. `<script`) cannot survive (CodeQL js/incomplete-sanitization).
      next = next.replace(/<\/?[^>]+>/g, "");
      next = next.replace(/[<>]/g, "");
    }
    return next;
  };
}

export function createParseStage(
  parse: TransformPipelineOptions["parse"],
): TransformFn | undefined {
  if (!parse) {
    return undefined;
  }
  return (value) => parse(value);
}

export function buildInboundStages(options: TransformPipelineOptions): TransformFn[] {
  const stages: TransformFn[] = [];

  const trim = createTrimStage(options.trim ?? false);
  if (trim) {
    stages.push(trim);
  }

  const normalize = createNormalizeStage(options.normalize ?? false);
  if (normalize) {
    stages.push(normalize);
  }

  const sanitize = createSanitizeStage(options.sanitize);
  if (sanitize) {
    stages.push(sanitize);
  }

  if (options.stages) {
    stages.push(...options.stages);
  }

  const parse = createParseStage(options.parse);
  if (parse) {
    stages.push(parse);
  }

  return stages;
}
