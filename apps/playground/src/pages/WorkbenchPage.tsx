import { ExamplePanel } from "../components/ExamplePanel";
import { PlaygroundHeader } from "../components/PlaygroundHeader";
import { WorkspaceStatus } from "../components/WorkspaceStatus";
import { playgroundExamples } from "../examples/registry";

const docsUrl = "http://127.0.0.1:4175";

export function WorkbenchPage() {
  return (
    <main className="layout-shell">
      <PlaygroundHeader />
      <WorkspaceStatus packageCount={18} docsUrl={docsUrl} />
      <section className="examples-grid" aria-label="Playground examples">
        {playgroundExamples.map((example) => (
          <ExamplePanel key={example.id} example={example} />
        ))}
      </section>
    </main>
  );
}
