let eventCounter = 0;

export function nextDevToolsEventId(prefix: string): string {
  eventCounter += 1;
  return `${prefix}_${String(eventCounter)}`;
}

export function capLog<T>(entries: T[], maxEntries: number, entry: T): T[] {
  const next = [...entries, entry];
  if (next.length <= maxEntries) {
    return next;
  }

  return next.slice(next.length - maxEntries);
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
