/**
 * Turn DiffRecords into audit-trail events for a bus or logger.
 */
import { diff } from "@jayoncode/object-diff";

type AuditEvent = {
  readonly type: "object-diff.change";
  readonly path: string;
  readonly changeType: string;
  readonly previous?: unknown;
  readonly current?: unknown;
};

function toAuditEvents(before: unknown, after: unknown): AuditEvent[] {
  return diff(before, after).changes.map((change) => ({
    type: "object-diff.change" as const,
    path: change.path,
    changeType: change.type,
    ...(change.previous !== undefined ? { previous: change.previous } : {}),
    ...(change.current !== undefined ? { current: change.current } : {}),
  }));
}

const events = toAuditEvents({ count: 1 }, { count: 2, label: "ready" });
console.log(events);
