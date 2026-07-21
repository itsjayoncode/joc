import { Link } from "react-router-dom";

import styles from "./Pages.module.css";
import { Card } from "../components/primitives/Card.js";
import { PageContainer } from "../components/primitives/PageContainer.js";

const BASIC_SNIPPET = `import {
  createStorage,
  createLocalStorageAdapter,
} from "@jayoncode/storage";

const storage = createStorage({
  namespace: "prefs",
  adapter: createLocalStorageAdapter(),
  schemaVersion: "1",
  policies: {
    preferences: { ttl: { days: 365 } },
    cache: { ttl: { minutes: 15 } },
  },
});

storage.set("theme", "dark", { policy: "preferences" });
const theme = storage.get("theme");`;

const MEMORY_SNIPPET = `import { createStorage, createMemoryAdapter } from "@jayoncode/storage";

const storage = createStorage({
  namespace: "test",
  adapter: createMemoryAdapter(),
});

storage.set("fixture", { ok: true });
storage.peek("fixture");`;

export function ExamplesPage() {
  return (
    <PageContainer
      compact
      description={
        <>
          Integration snippets. Open the <Link to="/">Storage Lab</Link> to try them interactively.
        </>
      }
    >
      <div className={styles.stack}>
        <Card
          description="Named write presets — same pattern the playground shell uses for theme/sidebar."
          title="Policies (preferences / cache)"
        >
          <pre className={styles.codeBlock}>{BASIC_SNIPPET}</pre>
        </Card>
        <Card description="Ephemeral adapter for unit tests and demos." title="Memory adapter">
          <pre className={styles.codeBlock}>{MEMORY_SNIPPET}</pre>
        </Card>
      </div>
    </PageContainer>
  );
}
