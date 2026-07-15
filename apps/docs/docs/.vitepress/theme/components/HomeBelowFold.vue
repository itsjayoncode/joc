<template>
  <div class="joc-home-custom">
    <section class="joc-home-section joc-featured-section">
      <div class="joc-dark-band">
        <span class="joc-kicker joc-kicker--band">Featured package · Live on npm</span>
        <div class="joc-showcase">
          <div class="joc-showcase-copy">
            <h2 class="joc-section-title">Browser Lifecycle Manager</h2>
            <p class="joc-muted">
              The first shipped package in the collection. One typed API for page visibility, window
              focus, connectivity, idle detection, cross-tab sync, and plugin-based session
              diagnostics — no globals, no hidden timers.
            </p>
            <div class="joc-pill-row">
              <span class="joc-pill">Page visibility</span>
              <span class="joc-pill">Window focus</span>
              <span class="joc-pill">Online / offline</span>
              <span class="joc-pill">Idle detection</span>
              <span class="joc-pill">Cross-tab sync</span>
            </div>
            <p class="joc-home-links">
              <a href="/packages/browser-lifecycle/installation">Install guide</a>
              <span aria-hidden="true">·</span>
              <a href="/guides/browser-lifecycle/quick-start">Quick start</a>
              <span aria-hidden="true">·</span>
              <a href="/playground/playground">Playground docs</a>
            </p>
          </div>
          <div class="joc-code-panel" aria-label="Browser Lifecycle quick start code example">
            <div class="joc-code-header">
              <span>quick-start.ts</span>
              <span class="joc-code-badge">@jayoncode/browser-lifecycle</span>
            </div>
            <pre v-pre><code>import { createBrowserLifecycle } from "@jayoncode/browser-lifecycle";

const lifecycle = createBrowserLifecycle({ autoStart: true });

lifecycle.on("page:visible", () => {
  resumePolling();
});

lifecycle.on("session:idle", () => {
  pauseExpensiveWork();
});

const snapshot = lifecycle.getSnapshot();

lifecycle.dispose();</code></pre>
          </div>
        </div>
      </div>
    </section>

    <section class="joc-home-section joc-cta-section">
      <div class="joc-cta-band">
        <div>
          <span class="joc-kicker">Open source · @jayoncode/*</span>
          <h2 class="joc-section-title">Join the ecosystem</h2>
          <p class="joc-muted">
            Start with the live Browser Lifecycle package, explore upcoming libraries, or follow the
            roadmap as the JayOnCode collection grows.
          </p>
        </div>
        <div class="joc-cta-actions">
          <a class="joc-cta-primary" href="/packages/browser-lifecycle/installation">
            Install browser-lifecycle
          </a>
          <a
            class="joc-cta-secondary"
            href="https://github.com/itsjayoncode/joc"
            target="_blank"
            rel="noopener noreferrer"
          >
            Star on GitHub
          </a>
        </div>
      </div>
    </section>
  </div>
</template>
