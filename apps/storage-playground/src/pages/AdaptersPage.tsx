import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import {
  createLocalStorageAdapter,
  createMemoryAdapter,
  createSessionStorageAdapter,
  createStorage,
} from "@jayoncode/storage";

import styles from "./Pages.module.css";
import { Card } from "../components/primitives/Card.js";
import { PageContainer } from "../components/primitives/PageContainer.js";

type AdapterKind = "memory" | "local" | "session";

const ADAPTERS: readonly { id: AdapterKind; label: string; description: string }[] = [
  {
    id: "memory",
    label: "Memory",
    description: "In-process Map adapter. Ideal for tests and ephemeral sessions.",
  },
  {
    id: "local",
    label: "localStorage",
    description: "Browser localStorage. Survives reloads in the same origin.",
  },
  {
    id: "session",
    label: "sessionStorage",
    description: "Browser sessionStorage. Cleared when the tab session ends.",
  },
];

function resolveAdapter(kind: AdapterKind) {
  switch (kind) {
    case "local":
      return createLocalStorageAdapter();
    case "session":
      return createSessionStorageAdapter();
    default:
      return createMemoryAdapter();
  }
}

export function AdaptersPage() {
  const [kind, setKind] = useState<AdapterKind>("memory");
  const [result, setResult] = useState<string>("Pick an adapter and run the sample.");

  const storage = useMemo(
    () =>
      createStorage({
        namespace: "playground-adapters",
        adapter: resolveAdapter(kind),
        schemaVersion: "1",
      }),
    [kind],
  );

  const runSample = () => {
    try {
      storage.set("probe", { adapter: kind, at: Date.now() });
      const value = storage.get("probe");
      setResult(`ok → ${JSON.stringify(value)}`);
    } catch (error) {
      setResult(error instanceof Error ? error.message : "Sample failed");
    }
  };

  return (
    <PageContainer
      compact
      description={
        <>
          Compare adapters side by side. Prefer the <Link to="/">Storage Lab</Link> for full
          controls and envelope inspection.
        </>
      }
    >
      <div className={styles.cardGrid}>
        {ADAPTERS.map((adapter) => (
          <Card
            key={adapter.id}
            description={adapter.description}
            title={adapter.label}
            tone={kind === adapter.id ? "brand" : "default"}
          >
            <button
              className={styles.choiceButton}
              onClick={() => {
                setKind(adapter.id);
                setResult(`Selected ${adapter.label}.`);
              }}
              type="button"
            >
              Use {adapter.label}
            </button>
          </Card>
        ))}
      </div>

      <Card description={`Active adapter: ${kind}`} title="Sample write/read">
        <div className={styles.toggleGroup}>
          <button className={styles.choiceButtonActive} onClick={runSample} type="button">
            Run sample
          </button>
        </div>
        <pre className={styles.codeBlock}>{result}</pre>
      </Card>
    </PageContainer>
  );
}
