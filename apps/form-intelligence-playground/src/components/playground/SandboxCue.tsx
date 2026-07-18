import { Link } from "react-router-dom";

import styles from "../../pages/Pages.module.css";

export interface SandboxCueProps {
  readonly hint: string;
}

/** Points explorers back to the interactive sandbox for free-form experiments. */
export function SandboxCue({ hint }: SandboxCueProps) {
  return (
    <p className={styles.sandboxCue}>
      <Link className={styles.sandboxCueLink} to="/">
        Open Sandbox
      </Link>
      <span aria-hidden="true"> · </span>
      {hint}
    </p>
  );
}
