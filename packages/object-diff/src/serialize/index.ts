import type { DiffResult, SerializeFormat, SerializeOptions } from "../types/index.js";

function formatValue(value: unknown): string {
  if (typeof value === "string") {
    return value;
  }

  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

function toJson(diff: DiffResult, pretty: boolean): string {
  const payload = {
    changes: diff.changes,
    metadata: diff.metadata,
  };

  return pretty ? JSON.stringify(payload, null, 2) : JSON.stringify(payload);
}

function toMarkdown(diff: DiffResult, options?: SerializeOptions): string {
  const title = options?.title ?? "Object Diff";
  const lines = [`# ${title}`, "", `Changes: ${String(diff.metadata.changeCount)}`, ""];

  for (const change of diff.changes) {
    lines.push(`- **${change.type}** \`${change.path}\``);

    if (change.previous !== undefined) {
      lines.push(`  - previous: \`${formatValue(change.previous)}\``);
    }

    if (change.current !== undefined) {
      lines.push(`  - current: \`${formatValue(change.current)}\``);
    }
  }

  return lines.join("\n");
}

function toTable(diff: DiffResult): string {
  const header = "| Path | Type | Previous | Current |";
  const divider = "| --- | --- | --- | --- |";
  const rows = diff.changes.map((change) => {
    return `| ${change.path} | ${change.type} | ${formatValue(change.previous)} | ${formatValue(change.current)} |`;
  });

  return [header, divider, ...rows].join("\n");
}

/**
 * Serialize a diff result to a supported output format.
 */
export function serialize(
  diff: DiffResult,
  format: SerializeFormat,
  options?: SerializeOptions,
): string {
  switch (format) {
    case "json":
      return toJson(diff, false);
    case "pretty":
      return toJson(diff, true);
    case "markdown":
      return toMarkdown(diff, options);
    case "table":
      return toTable(diff);
    default:
      return toJson(diff, false);
  }
}

export { toJson as serializeJson };
export { toMarkdown as serializeMarkdown };
export { toTable as serializeTable };
