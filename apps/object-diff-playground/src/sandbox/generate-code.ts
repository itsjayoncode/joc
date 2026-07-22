import type { LabConfig } from "./types.js";

function indent(lines: string[], spaces = 2): string {
  const pad = " ".repeat(spaces);
  return lines.map((line) => `${pad}${line}`).join("\n");
}

function parsePaths(raw: string): readonly string[] {
  return raw
    .split(/[,\n]/)
    .map((part) => part.trim())
    .filter(Boolean);
}

export function generateLabCode(config: LabConfig): string {
  const optionLines: string[] = [];

  if (config.diff.maxDepth > 0) {
    optionLines.push(`maxDepth: ${String(config.diff.maxDepth)},`);
  }
  if (config.diff.includeUnchanged) {
    optionLines.push("includeUnchanged: true,");
  }
  if (config.diff.treatUndefinedAsMissing) {
    optionLines.push("treatUndefinedAsMissing: true,");
  }
  if (config.diff.circular !== "error") {
    optionLines.push(`circular: "${config.diff.circular}",`);
  }
  if (config.diff.detectMoves) {
    optionLines.push("detectMoves: true,");
  }
  if (config.diff.identityKey.trim()) {
    optionLines.push(`identityKey: "${config.diff.identityKey.trim()}",`);
  }
  const ignore = parsePaths(config.diff.ignorePaths);
  if (ignore.length > 0) {
    optionLines.push(`ignore: ${JSON.stringify(ignore)},`);
  }
  const include = parsePaths(config.diff.includePaths);
  if (include.length > 0) {
    optionLines.push(`include: ${JSON.stringify(include)},`);
  }

  const hasOptions = optionLines.length > 0;
  const imports = [
    'import { diff, patch, applyPatch, revertPatch, serialize } from "@jayoncode/object-diff";',
    'import { createDiffView } from "@jayoncode/object-diff/view";',
  ];
  if (config.merge.enabled) {
    imports.push('import { merge } from "@jayoncode/object-diff/merge";');
  }
  imports.push('import { statistics } from "@jayoncode/object-diff/stats";');

  const identityHint = config.diff.identityKey.trim()
    ? `, identityKey: "${config.diff.identityKey.trim()}"`
    : "";

  const body: string[] = [
    "const before = /* Snapshot A */ undefined as unknown;",
    "const after = /* Snapshot B */ undefined as unknown;",
    "",
    hasOptions
      ? `const result = diff(before, after, {\n${indent(optionLines)}\n});`
      : "const result = diff(before, after);",
    "",
    `const operations = patch(result, { format: "${config.patch.format}"${config.patch.optimize ? ", optimize: true" : ""} });`,
    `const applied = applyPatch(before, operations, { validate: ${String(config.patch.validate)}, mutable: ${String(config.patch.mutable)} });`,
    "const reverted = revertPatch(applied, operations);",
    "",
    `const formatted = serialize(result, "${config.format}");`,
    "const stats = statistics(result, operations);",
    `const view = createDiffView(result);`,
    `const explained = view.explain({ format: "human"${identityHint} });`,
  ];

  if (config.merge.enabled) {
    body.push(
      "",
      "const base = /* Merge base */ undefined as unknown;",
      `const merged = merge(before, after, { base, strategy: "${config.merge.strategy}"${identityHint} });`,
    );
  }

  return `${imports.join("\n")}\n\n${body.join("\n")}\n`;
}
