import { useMemo, useState } from "react";

import styles from "./CodeBlock.module.css";
import { classNames } from "../../utils/class-names.js";
import { getCodeLineCount, highlightCode, inferCodeLanguage } from "../../utils/code-highlight.js";

import type { CodeLanguage } from "../../utils/code-highlight.js";
import type { CSSProperties, TextareaHTMLAttributes } from "react";

export interface CodeBlockProps {
  readonly code: string;
  readonly compact?: boolean;
  readonly language?: CodeLanguage;
  readonly maxHeight?: string;
  readonly showCopy?: boolean;
  readonly showLineNumbers?: boolean;
  readonly title?: string;
}

async function copyToClipboard(value: string): Promise<void> {
  await navigator.clipboard.writeText(value);
}

export function CodeBlock({
  code,
  compact = false,
  language,
  maxHeight,
  showCopy = true,
  showLineNumbers,
  title,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const resolvedLanguage = inferCodeLanguage(code, language);
  const lines = useMemo(() => code.split("\n"), [code]);
  const shouldShowLineNumbers = showLineNumbers ?? getCodeLineCount(code) > 1;

  const handleCopy = (): void => {
    void copyToClipboard(code).then(() => {
      setCopied(true);
      globalThis.setTimeout(() => {
        setCopied(false);
      }, 1600);
    });
  };

  return (
    <div
      className={classNames(styles.wrapper, compact && styles.compact)}
      style={maxHeight ? ({ "--code-max-height": maxHeight } as CSSProperties) : undefined}
    >
      <div className={styles.header}>
        <p className={styles.title}>{title ?? "Source"}</p>
        <div className={styles.headerActions}>
          <span className={styles.language}>{resolvedLanguage}</span>
          {showCopy ? (
            <button className={styles.copyButton} onClick={handleCopy} type="button">
              {copied ? "Copied" : "Copy"}
            </button>
          ) : null}
        </div>
      </div>
      <div className={styles.scroll}>
        <pre className={styles.pre}>
          <code className={styles.code}>
            {lines.map((line, index) => (
              <div key={`line-${String(index)}`} className={styles.line}>
                {shouldShowLineNumbers ? (
                  <span aria-hidden="true" className={styles.lineNumber}>
                    {index + 1}
                  </span>
                ) : (
                  <span aria-hidden="true" className={styles.lineNumber} />
                )}
                <span
                  className={styles.lineContent}
                  dangerouslySetInnerHTML={{
                    __html: line.length > 0 ? highlightCode(line, resolvedLanguage) : "&nbsp;",
                  }}
                />
              </div>
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
}

export interface CodeEditorProps extends Omit<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  "className"
> {
  readonly language?: CodeLanguage;
  readonly title?: string;
}

export function CodeEditor({
  language = "json",
  title = "Editor",
  ...textareaProps
}: CodeEditorProps) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <p className={styles.title}>{title}</p>
        <span className={styles.language}>{language}</span>
      </div>
      <textarea className={styles.editor} spellCheck={false} {...textareaProps} />
    </div>
  );
}

export interface InlineCodeProps {
  readonly children: string;
}

export function InlineCode({ children }: InlineCodeProps) {
  return <code className={styles.inline}>{children}</code>;
}
