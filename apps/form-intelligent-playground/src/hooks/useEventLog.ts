import { useCallback, useState } from "react";

import type { EventLogEntry } from "../components/playground/EventLog.js";

let eventCounter = 0;

export function useEventLog(limit = 40) {
  const [entries, setEntries] = useState<readonly EventLogEntry[]>([]);

  const push = useCallback(
    (message: string) => {
      const entry: EventLogEntry = {
        id: `event-${String(++eventCounter)}`,
        at: new Date().toLocaleTimeString(),
        message,
      };

      setEntries((current) => [entry, ...current].slice(0, limit));
    },
    [limit],
  );

  const clear = useCallback(() => {
    setEntries([]);
  }, []);

  return { clear, entries, push };
}
