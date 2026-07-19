import { playgroundExamples } from "../examples/registry.js";

export function PlaygroundHeader() {
  const packageNames = [...new Set(playgroundExamples.map((example) => example.packageName))];

  return (
    <header className="playground-header">
      <div>
        <div className="eyebrow-row">
          {packageNames.map((name) => (
            <span className="package-name" key={name}>
              {name}
            </span>
          ))}
          <span className="eyebrow">JOC Playground</span>
        </div>
        <h1>Local package exploration without publishing</h1>
      </div>
      <p className="lead">
        This workbench is for manual testing, API exploration, and future demos across the JOC
        ecosystem.
      </p>
    </header>
  );
}
