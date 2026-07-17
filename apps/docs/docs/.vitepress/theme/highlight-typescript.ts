/** Escape text for safe HTML embedding. */
function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

const KEYWORDS = new Set([
  "await",
  "async",
  "break",
  "case",
  "catch",
  "class",
  "const",
  "continue",
  "default",
  "else",
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
  "instanceof",
  "let",
  "new",
  "null",
  "of",
  "return",
  "static",
  "super",
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
  "yield",
  "type",
  "interface",
  "as",
  "satisfies",
]);

/**
 * Lightweight TypeScript highlighter for package-landing samples.
 * Avoids pulling Shiki into the client bundle for short snippets.
 */
export function highlightTypeScript(source: string): string {
  const lines = source.replace(/\r\n/g, "\n").split("\n");

  return lines
    .map((line) => {
      if (!line) {
        return "";
      }

      const commentIndex = findLineCommentStart(line);
      if (commentIndex === 0) {
        return `<span class="tok-comment">${escapeHtml(line)}</span>`;
      }

      const codePart = commentIndex >= 0 ? line.slice(0, commentIndex) : line;
      const commentPart = commentIndex >= 0 ? line.slice(commentIndex) : "";

      return (
        highlightCodeSegment(codePart) +
        (commentPart ? `<span class="tok-comment">${escapeHtml(commentPart)}</span>` : "")
      );
    })
    .join("\n");
}

function findLineCommentStart(line: string): number {
  let inSingle = false;
  let inDouble = false;
  let inTemplate = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    const prev = line[i - 1];

    if (char === "'" && !inDouble && !inTemplate && prev !== "\\") {
      inSingle = !inSingle;
      continue;
    }
    if (char === '"' && !inSingle && !inTemplate && prev !== "\\") {
      inDouble = !inDouble;
      continue;
    }
    if (char === "`" && !inSingle && !inDouble && prev !== "\\") {
      inTemplate = !inTemplate;
      continue;
    }

    if (!inSingle && !inDouble && !inTemplate && char === "/" && line[i + 1] === "/") {
      return i;
    }
  }

  return -1;
}

function highlightCodeSegment(segment: string): string {
  const pattern =
    /('(?:\\.|[^'\\])*'|"(?:\\.|[^"\\])*"|`(?:\\.|[^`\\])*`)|(\b\d+(?:\.\d+)?\b)|(\b[A-Za-z_$][\w$]*\b)|([{}()[\];,.:]=?>?|=>|[+\-*/%=<>!&|?]+)/g;

  let result = "";
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(segment)) !== null) {
    if (match.index > lastIndex) {
      result += escapeHtml(segment.slice(lastIndex, match.index));
    }

    const [full, stringLit, numberLit, ident, punct] = match;

    if (stringLit) {
      result += `<span class="tok-string">${escapeHtml(stringLit)}</span>`;
    } else if (numberLit) {
      result += `<span class="tok-number">${escapeHtml(numberLit)}</span>`;
    } else if (ident) {
      if (KEYWORDS.has(ident)) {
        result += `<span class="tok-keyword">${escapeHtml(ident)}</span>`;
      } else if (/^[A-Z]/.test(ident)) {
        result += `<span class="tok-type">${escapeHtml(ident)}</span>`;
      } else {
        const nextNonSpace = segment.slice(match.index + full.length).match(/^\s*(\()/);
        if (nextNonSpace) {
          result += `<span class="tok-fn">${escapeHtml(ident)}</span>`;
        } else {
          result += `<span class="tok-ident">${escapeHtml(ident)}</span>`;
        }
      }
    } else if (punct) {
      result += `<span class="tok-punct">${escapeHtml(punct)}</span>`;
    } else {
      result += escapeHtml(full);
    }

    lastIndex = match.index + full.length;
  }

  if (lastIndex < segment.length) {
    result += escapeHtml(segment.slice(lastIndex));
  }

  return result;
}
