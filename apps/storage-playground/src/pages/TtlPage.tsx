import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { createMemoryAdapter, createStorage, type StorageEnvelope } from "@jayoncode/storage";

import styles from "./Pages.module.css";
import { Card } from "../components/primitives/Card.js";
import { PageContainer } from "../components/primitives/PageContainer.js";

export function TtlPage() {
  const [ttlSeconds, setTtlSeconds] = useState(3);
  const [envelope, setEnvelope] = useState<StorageEnvelope | null>(null);
  const [status, setStatus] = useState("Write a value, then wait for TTL expiry.");

  const storage = useMemo(
    () =>
      createStorage({
        namespace: "playground-ttl",
        adapter: createMemoryAdapter(),
        schemaVersion: "1",
        ttl: { seconds: ttlSeconds },
      }),
    [ttlSeconds],
  );

  const write = () => {
    storage.set("ttl-demo", { writtenAt: Date.now() });
    setEnvelope(storage.peek("ttl-demo"));
    setStatus(`Wrote with TTL ${String(ttlSeconds)}s. Use Get after delay to observe expiry.`);
  };

  const read = () => {
    const value = storage.get("ttl-demo");
    setEnvelope(storage.peek("ttl-demo"));
    setStatus(
      value === null ? "Value expired or missing." : `Still present: ${JSON.stringify(value)}`,
    );
  };

  return (
    <PageContainer
      compact
      description={
        <>
          Inspect TTL expiry and envelopes. Prefer the <Link to="/">Storage Lab</Link> for live
          adapter switching.
        </>
      }
    >
      <div className={styles.heroGrid}>
        <Card description="Default TTL applied to writes from this explorer." title="TTL window">
          <label className={styles.preferenceField}>
            <span className={styles.fieldLabel}>Seconds</span>
            <input
              className={styles.jsonEditor}
              min={1}
              onChange={(event) => {
                setTtlSeconds(Number(event.target.value));
              }}
              style={{ minHeight: "auto", height: "2.5rem" }}
              type="number"
              value={ttlSeconds}
            />
          </label>
          <div className={styles.toggleGroup} style={{ marginTop: "0.75rem" }}>
            <button className={styles.choiceButtonActive} onClick={write} type="button">
              Write
            </button>
            <button className={styles.choiceButton} onClick={read} type="button">
              Get
            </button>
          </div>
          <p className={styles.fieldHint}>{status}</p>
        </Card>

        <Card description="Raw envelope via peek()." title="Envelope">
          <pre className={styles.codeBlock}>
            {envelope ? JSON.stringify(envelope, null, 2) : "—"}
          </pre>
        </Card>
      </div>
    </PageContainer>
  );
}
