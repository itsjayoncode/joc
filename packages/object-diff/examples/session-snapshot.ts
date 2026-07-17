/**
 * Session snapshot compare — same pattern for browser-lifecycle session restores.
 */
import { diff, hasChanges } from "@jayoncode/object-diff";

const previousSession = { route: "/home", scrollY: 0, draftId: null as string | null };
const currentSession = { route: "/settings", scrollY: 120, draftId: "d1" };

if (hasChanges(previousSession, currentSession)) {
  console.log(
    "session deltas:",
    diff(previousSession, currentSession).changes.map((change) => change.path),
  );
}
