import { InvalidOptionsError } from "../errors/index.js";

import type {
  DiffResult,
  DiffType,
  FormatterPlugin,
  SerializeFormat,
  SerializeOptions,
} from "../types/index.js";

const BUILTIN_FORMATS = new Set<SerializeFormat>([
  "json",
  "pretty",
  "markdown",
  "table",
  "html",
  "console",
  "human",
]);

function formatValue(value: unknown): string {
  if (value === undefined) {
    return "";
  }

  if (typeof value === "string") {
    return value;
  }

  try {
    return JSON.stringify(value);
  } catch {
    return typeof value === "object" && value !== null
      ? Object.prototype.toString.call(value)
      : typeof value;
  }
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
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
    lines.push(
      change.type === "moved" && change.from
        ? `- **moved** \`${change.from}\` → \`${change.path}\``
        : `- **${change.type}** \`${change.path}\``,
    );

    if (change.type !== "moved" && change.previous !== undefined) {
      lines.push(`  - previous: \`${formatValue(change.previous)}\``);
    }

    if (change.type !== "moved" && change.current !== undefined) {
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

function toHtml(diff: DiffResult, options?: SerializeOptions): string {
  const title = escapeHtml(options?.title ?? "Object Diff");
  const rows = diff.changes
    .map((change) => {
      return [
        "<tr>",
        `<td>${escapeHtml(change.path)}</td>`,
        `<td>${escapeHtml(change.type)}</td>`,
        `<td><code>${escapeHtml(formatValue(change.previous))}</code></td>`,
        `<td><code>${escapeHtml(formatValue(change.current))}</code></td>`,
        "</tr>",
      ].join("");
    })
    .join("");

  return [
    `<section data-object-diff>`,
    `<h2>${title}</h2>`,
    `<p>Changes: ${String(diff.metadata.changeCount)}</p>`,
    "<table>",
    "<thead><tr><th>Path</th><th>Type</th><th>Previous</th><th>Current</th></tr></thead>",
    `<tbody>${rows}</tbody>`,
    "</table>",
    "</section>",
  ].join("");
}

const ANSI = {
  reset: "\u001b[0m",
  dim: "\u001b[2m",
  red: "\u001b[31m",
  green: "\u001b[32m",
  yellow: "\u001b[33m",
} as const;

function colorForType(type: DiffType): string {
  switch (type) {
    case "added":
      return ANSI.green;
    case "removed":
      return ANSI.red;
    case "changed":
      return ANSI.yellow;
    case "moved":
      return ANSI.yellow;
    default:
      return ANSI.dim;
  }
}

function toConsole(diff: DiffResult, options?: SerializeOptions): string {
  const title = options?.title ?? "Object Diff";
  const useColor = options?.color !== false;
  const lines = [`${title} (${String(diff.metadata.changeCount)} changes)`];

  for (const change of diff.changes) {
    const label =
      change.type === "moved" && change.from
        ? `moved ${change.from} → ${change.path}`
        : `${change.type} ${change.path}`;
    const detail =
      change.type !== "moved" && (change.previous !== undefined || change.current !== undefined)
        ? `  ${formatValue(change.previous)} → ${formatValue(change.current)}`
        : "";
    const colored = useColor
      ? `${colorForType(change.type)}${label}${ANSI.reset}${detail}`
      : `${label}${detail}`;
    lines.push(colored);
  }

  return lines.join("\n");
}

function countByType(diff: DiffResult): Record<DiffType, number> {
  const counts: Record<DiffType, number> = {
    added: 0,
    removed: 0,
    changed: 0,
    unchanged: 0,
    moved: 0,
  };

  for (const change of diff.changes) {
    counts[change.type] += 1;
  }

  return counts;
}

function toHuman(diff: DiffResult, options?: SerializeOptions): string {
  const title = options?.title ?? "Object Diff";
  const counts = countByType(diff);
  const parts: string[] = [];

  if (counts.added > 0) {
    parts.push(`${String(counts.added)} added`);
  }

  if (counts.removed > 0) {
    parts.push(`${String(counts.removed)} removed`);
  }

  if (counts.changed > 0) {
    parts.push(`${String(counts.changed)} changed`);
  }

  if (counts.moved > 0) {
    parts.push(`${String(counts.moved)} moved`);
  }

  const summary =
    parts.length === 0
      ? `${title}: no changes`
      : `${title}: ${String(diff.metadata.changeCount)} change${diff.metadata.changeCount === 1 ? "" : "s"} (${parts.join(", ")})`;

  if (diff.changes.length === 0) {
    return summary;
  }

  const bullets = diff.changes.map((change) => {
    if (change.type === "added") {
      return `- added \`${change.path}\`: ${formatValue(change.current)}`;
    }

    if (change.type === "removed") {
      return `- removed \`${change.path}\`: ${formatValue(change.previous)}`;
    }

    if (change.type === "changed") {
      return `- changed \`${change.path}\`: ${formatValue(change.previous)} → ${formatValue(change.current)}`;
    }

    if (change.type === "moved") {
      const from = change.from ?? "?";
      return `- moved \`${from}\` → \`${change.path}\``;
    }

    return `- ${change.type} \`${change.path}\``;
  });

  return [summary, ...bullets].join("\n");
}

function serializeBuiltin(
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
    case "html":
      return toHtml(diff, options);
    case "console":
      return toConsole(diff, options);
    case "human":
      return toHuman(diff, options);
    default: {
      const _exhaustive: never = format;
      throw new InvalidOptionsError(`Unknown serialize format "${String(_exhaustive)}".`);
    }
  }
}

/**
 * Serialize a diff result to a supported built-in output format.
 * Works with zero plugins (no import side effects).
 */
export function serialize(
  diff: DiffResult,
  format: SerializeFormat,
  options?: SerializeOptions,
): string {
  return serializeBuiltin(diff, format, options);
}

/**
 * Build a serializer that can resolve custom `FormatterPlugin` names.
 * Does not mutate global state — pass plugins explicitly.
 */
export function createSerializer(plugins: readonly FormatterPlugin[] = []) {
  const byName = new Map<string, FormatterPlugin>();

  for (const plugin of plugins) {
    if (!plugin.name || typeof plugin.format !== "function") {
      throw new InvalidOptionsError("FormatterPlugin requires a name and format().", {
        details: { name: plugin.name },
      });
    }

    if (BUILTIN_FORMATS.has(plugin.name as SerializeFormat)) {
      throw new InvalidOptionsError(
        `FormatterPlugin name "${plugin.name}" collides with a built-in format.`,
        { details: { name: plugin.name } },
      );
    }

    if (byName.has(plugin.name)) {
      throw new InvalidOptionsError(`Duplicate FormatterPlugin name "${plugin.name}".`, {
        details: { name: plugin.name },
      });
    }

    byName.set(plugin.name, plugin);
  }

  return function serializeWithPlugins(
    diff: DiffResult,
    format: string,
    options?: SerializeOptions,
  ): string {
    const plugin = byName.get(format);

    if (plugin) {
      return plugin.format(diff, options);
    }

    if (BUILTIN_FORMATS.has(format as SerializeFormat)) {
      return serializeBuiltin(diff, format as SerializeFormat, options);
    }

    throw new InvalidOptionsError(`Unknown serialize format "${format}".`, {
      details: { format },
    });
  };
}

export { toJson as serializeJson };
export { toMarkdown as serializeMarkdown };
export { toTable as serializeTable };
export { toHtml as serializeHtml };
export { toConsole as serializeConsole };
export { toHuman as serializeHuman };
