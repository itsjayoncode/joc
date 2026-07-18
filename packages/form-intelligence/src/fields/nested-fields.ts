export { listAllPaths as listFieldPaths } from "../validation/pipeline.js";

import type { FieldPath } from "../types/index.js";

export function joinFieldPath(parent: FieldPath, segment: string | number): FieldPath {
  const segmentText = String(segment);
  return parent ? `${parent}.${segmentText}` : segmentText;
}
