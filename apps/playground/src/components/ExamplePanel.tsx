import type { PlaygroundExample } from "../examples/registry";

type ExamplePanelProps = {
  example: PlaygroundExample;
};

export function ExamplePanel({ example }: ExamplePanelProps) {
  return (
    <article className="example-card">
      <div className="example-header">
        <div>
          <p className="eyebrow">{example.packageName}</p>
          <h2>{example.name}</h2>
        </div>
        <span className={`status-pill status-${example.status}`}>{example.status}</span>
      </div>
      <p>{example.summary}</p>
      <ul>
        {example.details.map((detail) => (
          <li key={detail}>{detail}</li>
        ))}
      </ul>
      <div className="module-box">
        <span className="status-label">Observed module shape</span>
        <code>{example.moduleShape}</code>
      </div>
    </article>
  );
}
