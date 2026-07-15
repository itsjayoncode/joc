export type CodeLanguage = "javascript" | "json" | "text" | "typescript";

const OPEN_QUOTE = "&quot;";

export function escapeHtml(text: string): string {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export function highlightCode(source: string, language: CodeLanguage): string {
  const escaped = escapeHtml(source);

  if (language === "json") {
    return highlightJson(escaped);
  }

  if (language === "typescript" || language === "javascript") {
    return highlightScript(escaped);
  }

  return escaped;
}

function readEscapedStringEnd(source: string, start: number): number | null {
  if (!source.startsWith(OPEN_QUOTE, start)) {
    return null;
  }

  let cursor = start + OPEN_QUOTE.length;

  while (cursor < source.length) {
    if (source.startsWith(OPEN_QUOTE, cursor)) {
      return cursor + OPEN_QUOTE.length;
    }

    if (source[cursor] === "&") {
      const semicolonIndex = source.indexOf(";", cursor + 1);
      if (semicolonIndex === -1) {
        break;
      }
      cursor = semicolonIndex + 1;
      continue;
    }

    cursor += 1;
  }

  return null;
}

function extractEscapedStrings(source: string): { strings: string[]; text: string } {
  const strings: string[] = [];
  let text = "";
  let index = 0;

  while (index < source.length) {
    const end = readEscapedStringEnd(source, index);
    if (end === null) {
      const character = source.charAt(index);
      text += character;
      index += 1;
      continue;
    }

    const placeholder = `\u0000S${String(strings.length)}\u0000`;
    strings.push(source.slice(index, end));
    text += placeholder;
    index = end;
  }

  return { strings, text };
}

function restoreEscapedStrings(
  source: string,
  strings: readonly string[],
  replacer: (value: string, index: number) => string,
): string {
  return source.replace(/\u0000S(\d+)\u0000/g, (_match, indexText: string) => {
    const index = Number(indexText);
    const value = strings[index];
    return value === undefined ? "" : replacer(value, index);
  });
}

function wrap(className: string, value: string): string {
  return `<span class="${className}">${value}</span>`;
}

function highlightJson(escaped: string): string {
  const { strings, text } = extractEscapedStrings(escaped);

  let highlighted = text.replace(
    /(\u0000S\d+\u0000)(\s*):/g,
    (_match, placeholder: string, spacing: string) =>
      `${wrap("hl-key", restorePlaceholder(placeholder, strings))}${spacing}:`,
  );

  highlighted = highlighted.replace(
    /:(\s*)(\u0000S\d+\u0000)/g,
    (_match, spacing: string, placeholder: string) =>
      `:${spacing}${wrap("hl-string", restorePlaceholder(placeholder, strings))}`,
  );

  highlighted = highlighted.replace(
    /:(\s*)(-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)(\s*[,}\]])/g,
    (_match, spacing: string, value: string, suffix: string) =>
      `:${spacing}${wrap("hl-number", value)}${suffix}`,
  );

  highlighted = highlighted.replace(
    /:(\s*)(true|false)(\s*[,}\]])/g,
    (_match, spacing: string, value: string, suffix: string) =>
      `:${spacing}${wrap("hl-boolean", value)}${suffix}`,
  );

  highlighted = highlighted.replace(
    /:(\s*)(null)(\s*[,}\]])/g,
    (_match, spacing: string, value: string, suffix: string) =>
      `:${spacing}${wrap("hl-null", value)}${suffix}`,
  );

  return restoreEscapedStrings(highlighted, strings, (value) => value);
}

function restorePlaceholder(placeholder: string, strings: readonly string[]): string {
  const match = /\u0000S(\d+)\u0000/.exec(placeholder);
  if (!match) {
    return placeholder;
  }

  const value = strings[Number(match[1])];
  return value ?? placeholder;
}

const SCRIPT_KEYWORDS = new Set([
  "async",
  "await",
  "break",
  "case",
  "catch",
  "class",
  "const",
  "continue",
  "default",
  "export",
  "extends",
  "false",
  "finally",
  "for",
  "from",
  "function",
  "if",
  "import",
  "in",
  "let",
  "new",
  "null",
  "return",
  "switch",
  "this",
  "throw",
  "true",
  "try",
  "typeof",
  "undefined",
  "var",
  "void",
  "while",
]);

function highlightScript(escaped: string): string {
  let result = escaped.replace(
    /(\/\/.*$|\/\*[\s\S]*?\*\/)/gm,
    '<span class="hl-comment">$1</span>',
  );

  result = result.replace(
    /("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`)/g,
    '<span class="hl-string">$1</span>',
  );

  result = result.replace(/\b(-?\d+(?:\.\d+)?)\b/g, '<span class="hl-number">$1</span>');

  result = result.replace(/\b([A-Za-z_$][\w$]*)\b/g, (match, identifier: string) => {
    if (SCRIPT_KEYWORDS.has(identifier)) {
      return `<span class="hl-keyword">${identifier}</span>`;
    }

    if (/^[A-Z]/.test(identifier)) {
      return `<span class="hl-type">${identifier}</span>`;
    }

    return match;
  });

  return result;
}

export function inferCodeLanguage(code: string, hint?: CodeLanguage): CodeLanguage {
  if (hint && hint !== "text") {
    return hint;
  }

  const trimmed = code.trim();

  if (
    (trimmed.startsWith("{") && trimmed.endsWith("}")) ||
    (trimmed.startsWith("[") && trimmed.endsWith("]"))
  ) {
    return "json";
  }

  if (
    /\b(import|export|const|function|interface|type)\b/.test(code) ||
    code.includes("createBrowserLifecycle")
  ) {
    return "typescript";
  }

  return hint ?? "text";
}

export function getCodeLineCount(code: string): number {
  if (code.length === 0) {
    return 1;
  }

  return code.split("\n").length;
}
