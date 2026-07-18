import type { FieldPath } from "@jayoncode/form-intelligence";

import styles from "./FieldMetaTable.module.css";

export interface FieldMetaRow {
  readonly path: FieldPath;
  readonly touched: boolean;
  readonly dirty: boolean;
  readonly visited: boolean;
  readonly validating?: boolean;
  readonly error?: string | undefined;
}

export interface FieldMetaTableProps {
  readonly rows: readonly FieldMetaRow[];
}

export function FieldMetaTable({ rows }: FieldMetaTableProps) {
  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Field</th>
            <th>Touched</th>
            <th>Dirty</th>
            <th>Visited</th>
            <th>Validating</th>
            <th>Error</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.path}>
              <td className={styles.mono}>{row.path}</td>
              <td>{row.touched ? "yes" : "—"}</td>
              <td>{row.dirty ? "yes" : "—"}</td>
              <td>{row.visited ? "yes" : "—"}</td>
              <td>{row.validating ? "yes" : "—"}</td>
              <td className={styles.errorCell}>{row.error ?? "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
