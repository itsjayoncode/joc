/**
 * Formatter / serialize engine.
 *
 * Prefer this entry for formatting-focused apps:
 *   import { serialize, createSerializer } from "@jayoncode/object-diff/formatter";
 *
 * Root still re-exports `serialize` for compatibility. Importing this module
 * does not register plugins or mutate global state.
 */
export {
  createSerializer,
  serialize,
  serializeConsole,
  serializeHtml,
  serializeHuman,
  serializeJson,
  serializeMarkdown,
  serializeTable,
} from "../serialize/index.js";

export type {
  DiffResult,
  FormatterPlugin,
  SerializeFormat,
  SerializeOptions,
} from "../types/index.js";
