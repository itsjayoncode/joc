type WorkspaceStatusProps = {
  packageCount: number;
  docsUrl: string;
};

export function WorkspaceStatus({ packageCount, docsUrl }: WorkspaceStatusProps) {
  return (
    <section className="status-panel" aria-label="Workspace status">
      <div className="status-card">
        <span className="status-label">Packages in scope</span>
        <strong>{packageCount}</strong>
      </div>
      <div className="status-card">
        <span className="status-label">Docs app</span>
        <a href={docsUrl} target="_blank" rel="noreferrer">
          Open VitePress site
        </a>
      </div>
      <div className="status-card">
        <span className="status-label">Current role</span>
        <strong>DX infrastructure</strong>
      </div>
    </section>
  );
}
