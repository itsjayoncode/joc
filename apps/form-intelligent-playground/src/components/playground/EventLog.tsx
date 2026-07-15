import styles from "./EventLog.module.css";

export interface EventLogEntry {
  readonly id: string;
  readonly at: string;
  readonly message: string;
}

export interface EventLogProps {
  readonly entries: readonly EventLogEntry[];
  readonly emptyMessage?: string;
}

export function EventLog({ emptyMessage = "No events yet.", entries }: EventLogProps) {
  if (entries.length === 0) {
    return <p className={styles.empty}>{emptyMessage}</p>;
  }

  return (
    <ul className={styles.log}>
      {entries.map((entry) => (
        <li className={styles.entry} key={entry.id}>
          <span className={styles.time}>{entry.at}</span>
          <span className={styles.message}>{entry.message}</span>
        </li>
      ))}
    </ul>
  );
}
