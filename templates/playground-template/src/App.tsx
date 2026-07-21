import { packageId } from "__PACKAGE_SCOPED__";

declare const __PACKAGE_VERSION__: string;
declare const __PLAYGROUND_VERSION__: string;

export function App() {
  return (
    <main className="shell">
      <header className="hero">
        <p className="eyebrow">JayOnCode</p>
        <h1>__PLAYGROUND_TITLE__</h1>
        <p className="lede">
          Minimal lab scaffold for <code>{packageId}</code>. Expand this surface into real scenarios
          — keep the package core independently useful.
        </p>
      </header>
      <section className="panel" aria-label="Scaffold status">
        <dl>
          <div>
            <dt>Package</dt>
            <dd>__PACKAGE_SCOPED__</dd>
          </div>
          <div>
            <dt>Package version</dt>
            <dd>{__PACKAGE_VERSION__}</dd>
          </div>
          <div>
            <dt>Playground version</dt>
            <dd>{__PLAYGROUND_VERSION__}</dd>
          </div>
        </dl>
      </section>
    </main>
  );
}
