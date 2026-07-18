import { ValueHistoryStack } from "../history/stack.js";

export { ValueHistoryStack };

export function createStateHistory<TValues extends Record<string, unknown>>(maxDepth = 50) {
  return new ValueHistoryStack<TValues>(maxDepth);
}
