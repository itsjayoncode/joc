// Intentional re-export of deprecated helper for migration.
// eslint-disable-next-line @typescript-eslint/no-deprecated -- see ring-buffer.ts
export { capLog } from "./ring-buffer.js";

let eventCounter = 0;

export function nextDevToolsEventId(prefix: string): string {
  eventCounter += 1;
  return `${prefix}_${String(eventCounter)}`;
}

export function summarizeErrors(errors: Readonly<Record<string, string>>): Record<string, string> {
  const summary: Record<string, string> = {};
  for (const [path, message] of Object.entries(errors)) {
    if (message) {
      summary[path] = message;
    }
  }
  return summary;
}

export function hasValidationErrors(errors: Readonly<Record<string, string>>): boolean {
  return Object.values(errors).some(Boolean);
}
