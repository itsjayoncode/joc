/**
 * Parse a byte size as a number or human string (`"5MB"`, `"500kb"`, `"1 GiB"`).
 */
export function parseByteSize(input: number | string): number {
  if (typeof input === "number") {
    if (!Number.isFinite(input) || input < 0) {
      throw new RangeError(`Invalid byte size: ${String(input)}`);
    }
    return Math.floor(input);
  }

  const trimmed = input.trim();
  const match = /^(\d+(?:\.\d+)?)\s*(b|kb|kib|mb|mib|gb|gib)?$/i.exec(trimmed);
  if (!match) {
    throw new RangeError(`Invalid byte size: ${input}`);
  }

  const amount = Number(match[1]);
  const unit = (match[2] ?? "b").toLowerCase();
  const multipliers: Record<string, number> = {
    b: 1,
    kb: 1000,
    kib: 1024,
    mb: 1000 ** 2,
    mib: 1024 ** 2,
    gb: 1000 ** 3,
    gib: 1024 ** 3,
  };
  const factor = multipliers[unit];
  if (factor === undefined || !Number.isFinite(amount)) {
    throw new RangeError(`Invalid byte size: ${input}`);
  }
  return Math.floor(amount * factor);
}

export function asFileList(value: unknown): File[] {
  if (typeof FileList !== "undefined" && value instanceof FileList) {
    return Array.from(value);
  }
  if (typeof File !== "undefined" && value instanceof File) {
    return [value];
  }
  if (Array.isArray(value)) {
    if (typeof File === "undefined") {
      return [];
    }
    return value.filter((entry): entry is File => entry instanceof File);
  }
  return [];
}

/** Whether a single file matches an HTML-like `accept` token. */
export function fileMatchesAcceptToken(file: File, token: string): boolean {
  const normalized = token.trim().toLowerCase();
  if (!normalized) {
    return true;
  }

  const mime = file.type.toLowerCase();
  const name = file.name.toLowerCase();

  if (normalized.startsWith(".")) {
    return name.endsWith(normalized);
  }

  if (normalized.endsWith("/*")) {
    const prefix = normalized.slice(0, -1); // keep trailing "/"
    return mime.startsWith(prefix);
  }

  return mime === normalized;
}

export function fileMatchesAccept(file: File, accept: string | readonly string[]): boolean {
  const tokens = (typeof accept === "string" ? accept.split(",") : [...accept])
    .map((token) => token.trim())
    .filter(Boolean);
  if (tokens.length === 0) {
    return true;
  }
  return tokens.some((token) => fileMatchesAcceptToken(file, token));
}
