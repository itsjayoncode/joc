<script setup lang="ts">
import { computed, ref } from "vue";
import { docsHref } from "../docs-href.js";
import { featuredPackages, livePackages, jocPackages } from "../data/joc-packages";
import HomePackageCatalog from "./HomePackageCatalog.vue";
import PackageIcon from "./PackageIcon.vue";

const problems = [
  {
    id: "browser",
    label: "Tab hidden / idle / offline",
    intent: "Pause work when the tab is hidden, idle, or the network drops",
    packageId: "browser-lifecycle",
  },
  {
    id: "forms",
    label: "Forms that get complex",
    intent: "Validate, show/hide fields, keep drafts, and submit without races",
    packageId: "form-intelligence",
  },
  {
    id: "diff",
    label: "What changed in an object?",
    intent: "Compare two values, list changes, and build a patch",
    packageId: "object-diff",
  },
  {
    id: "storage",
    label: "Save data in the browser",
    intent: "Prefs and cache with clear names, expiry, and a backend you choose",
    packageId: "storage",
  },
] as const;

const selectedProblemId = ref<(typeof problems)[number]["id"]>("browser");

const selectedProblem = computed(
  () => problems.find((p) => p.id === selectedProblemId.value) ?? problems[0],
);

const selectedPackage = computed(
  () => jocPackages.find((pkg) => pkg.id === selectedProblem.value.packageId) ?? livePackages[0],
);

const learningPath = [
  { step: "1", title: "What the JOC Ecosystem is", href: "/getting-started/introduction" },
  { step: "2", title: "Browse packages", href: "/packages/" },
  {
    step: "3",
    title: "Quick start a package",
    href: "/packages/form-intelligence/modules/getting-started",
  },
  { step: "4", title: "Try the playground", href: "/playground/" },
  { step: "5", title: "See the roadmap", href: "/roadmap/" },
] as const;

const docLinks = [
  { label: "Getting Started", href: "/getting-started/introduction" },
  { label: "Ecosystem", href: "/getting-started/ecosystem" },
  { label: "Composition", href: "/guides/composition" },
  { label: "Ecosystem governance", href: "/guides/ecosystem-governance" },
  { label: "Packages", href: "/packages/" },
  { label: "Playground", href: "/playground/" },
  { label: "Roadmap", href: "/roadmap/" },
  { label: "Contributing", href: "/guides/contribution" },
] as const;

const communityLinks = [
  {
    label: "GitHub",
    href: "https://github.com/itsjayoncode/joc",
    external: true,
  },
  {
    label: "Issues",
    href: "https://github.com/itsjayoncode/joc/issues",
    external: true,
  },
  {
    label: "Discussions",
    href: "https://github.com/itsjayoncode/joc/discussions",
    external: true,
  },
  { label: "Roadmap", href: "/roadmap/", external: false },
  { label: "Contributing", href: "/guides/contribution", external: false },
] as const;
</script>

<template>
  <div class="joc-home-custom">
    <!-- Choose by problem -->
    <section class="joc-home-section joc-surface-band" aria-labelledby="choose-problem">
      <span class="joc-kicker">Choose by problem</span>
      <h2 id="choose-problem" class="joc-section-title">What are you trying to build?</h2>
      <p class="joc-muted joc-section-lead">
        Arrive with a problem — not a package name. Pick an intent and we’ll point you at the right
        library.
      </p>

      <div class="joc-choose" role="list">
        <button
          v-for="problem in problems"
          :key="problem.id"
          type="button"
          class="joc-choose__option"
          :class="{ 'joc-choose__option--active': selectedProblemId === problem.id }"
          role="listitem"
          :aria-pressed="selectedProblemId === problem.id"
          @click="selectedProblemId = problem.id"
        >
          {{ problem.label }}
        </button>
      </div>

      <div class="joc-choose-result" :class="`joc-choose-result--${selectedPackage.accent}`">
        <div class="joc-choose-result__meta">
          <span class="joc-choose-result__label">Recommended</span>
          <span class="joc-choose-result__status joc-choose-result__status--live">Live</span>
        </div>
        <h3 class="joc-choose-result__name">{{ selectedPackage.name }}</h3>
        <p class="joc-choose-result__npm">{{ selectedPackage.npmName }}</p>
        <p class="joc-muted">{{ selectedProblem.intent }}</p>
        <ul class="joc-choose-result__caps" aria-label="Capabilities">
          <li v-for="cap in selectedPackage.capabilities" :key="cap">{{ cap }}</li>
        </ul>
        <div class="joc-choose-result__actions">
          <a class="joc-cta-primary" :href="docsHref(selectedPackage.docsLink)">View docs</a>
          <a
            class="joc-cta-secondary"
            :href="docsHref(`/playground/${selectedPackage.id}/`)"
            target="_blank"
            rel="noreferrer noopener"
          >
            Open playground
          </a>
        </div>
      </div>
    </section>

    <!-- Featured packages -->
    <section id="ecosystem" class="joc-home-section" aria-labelledby="featured-title">
      <span class="joc-kicker">JOC Ecosystem</span>
      <h2 id="featured-title" class="joc-section-title">Focused tools. One ecosystem.</h2>
      <p class="joc-muted joc-section-lead">
        Independent, headless <code>@jayoncode/*</code> libraries — framework-agnostic, thoroughly
        documented, and backed by interactive playgrounds.
      </p>

      <div class="joc-feature-pkgs">
        <article
          v-for="pkg in featuredPackages"
          :key="pkg.id"
          class="joc-feature-pkg"
          :class="`joc-feature-pkg--${pkg.accent}`"
        >
          <div class="joc-feature-pkg__head">
            <span class="joc-feature-pkg__icon" aria-hidden="true">
              <PackageIcon :package-id="pkg.id" size="sm" />
            </span>
            <span class="joc-feature-pkg__status">Live</span>
          </div>
          <h3 class="joc-feature-pkg__name">
            <a :href="docsHref(pkg.docsLink)">{{ pkg.name }}</a>
          </h3>
          <p class="joc-feature-pkg__npm">{{ pkg.npmName }}</p>
          <p class="joc-muted joc-feature-pkg__tagline">{{ pkg.tagline }}</p>
          <ul class="joc-feature-pkg__caps">
            <li v-for="cap in pkg.capabilities" :key="cap">{{ cap }}</li>
          </ul>
          <a class="joc-feature-pkg__cta" :href="docsHref(pkg.docsLink)">View docs →</a>
        </article>
      </div>
    </section>

    <!-- Real code -->
    <section class="joc-home-section joc-surface-band" aria-labelledby="code-example">
      <span class="joc-kicker">Quick start</span>
      <h2 id="code-example" class="joc-section-title">Real code. One screen.</h2>
      <p class="joc-muted joc-section-lead">
        Pause work when the tab hides, queue when offline, sync when the session resumes.
      </p>

      <div class="joc-code-panel joc-code-panel--wide" aria-label="Browser Lifecycle example">
        <div class="joc-code-header">
          <span>@jayoncode/browser-lifecycle</span>
          <span class="joc-code-badge">Live</span>
        </div>
        <pre v-pre><code>import { createBrowserLifecycle } from "@jayoncode/browser-lifecycle";

const lifecycle = createBrowserLifecycle({ autoStart: true });

lifecycle.on("page:hidden", () => {
  analytics.pause();
});

lifecycle.on("connection:offline", () => {
  queue.enableOfflineMode();
});

lifecycle.on("page:visible", () => {
  syncPendingChanges();
});

// Teardown on unmount
await lifecycle.dispose();</code></pre>
        <p class="joc-home-links">
          <a :href="docsHref('/packages/browser-lifecycle/')">Package docs</a>
          <a
            :href="docsHref('/playground/browser-lifecycle/')"
            target="_blank"
            rel="noreferrer noopener"
          >
            Open sandbox
          </a>
          <a :href="docsHref('/packages/form-intelligence/')">Form Intelligence example</a>
        </p>
      </div>
    </section>

    <!-- Ecosystem map -->
    <section class="joc-home-section" aria-labelledby="architecture">
      <span class="joc-kicker">Ecosystem</span>
      <h2 id="architecture" class="joc-section-title">How the pieces fit</h2>
      <p class="joc-muted joc-section-lead">
        Independent TypeScript cores, optional framework adapters, and shared docs — not a
        monolithic SDK.
      </p>
      <div
        class="joc-arch"
        role="img"
        aria-label="Applications over JOC packages over TypeScript core"
      >
        <div class="joc-arch__layer joc-arch__layer--apps">
          <span class="joc-arch__label">Your application</span>
          <div class="joc-arch__chips">
            <span>React</span>
            <span>Vue</span>
            <span>Angular</span>
            <span>Svelte</span>
            <span>Vanilla</span>
          </div>
        </div>
        <div class="joc-arch__arrow" aria-hidden="true" />
        <div class="joc-arch__layer joc-arch__layer--pkgs">
          <span class="joc-arch__label">JOC packages</span>
          <div class="joc-arch__chips">
            <span v-for="pkg in featuredPackages" :key="`arch-${pkg.id}`">{{ pkg.name }}</span>
            <span>Adapters</span>
          </div>
        </div>
        <div class="joc-arch__arrow" aria-hidden="true" />
        <div class="joc-arch__layer joc-arch__layer--core">
          <span class="joc-arch__label">Headless TypeScript cores</span>
          <p class="joc-muted joc-arch__note">Typed · tree-shakeable · SSR-aware</p>
        </div>
      </div>
    </section>

    <!-- Vision -->
    <section class="joc-home-section" aria-labelledby="vision-title">
      <span class="joc-kicker">Vision</span>
      <h2 id="vision-title" class="joc-section-title">What the JOC Ecosystem is becoming</h2>
      <p class="joc-muted joc-section-lead">
        An ecosystem of independent, headless TypeScript libraries — framework-agnostic, thoroughly
        documented, and backed by interactive playgrounds. Install only what you need. Compose when
        you need more.
      </p>
      <div class="joc-choose-result__actions">
        <a class="joc-cta-primary" :href="docsHref('/getting-started/introduction')"
          >Read the intro</a
        >
        <a class="joc-cta-secondary" :href="docsHref('/roadmap/')">See the future</a>
      </div>
    </section>

    <!-- Learning path -->
    <section class="joc-home-section joc-surface-band" aria-labelledby="learning-path">
      <span class="joc-kicker">New here?</span>
      <h2 id="learning-path" class="joc-section-title">Learning path</h2>
      <ol class="joc-learn-path">
        <li v-for="item in learningPath" :key="item.step" class="joc-learn-path__item">
          <span class="joc-learn-path__step" aria-hidden="true">{{ item.step }}</span>
          <a class="joc-learn-path__link" :href="docsHref(item.href)">{{ item.title }}</a>
        </li>
      </ol>
    </section>

    <!-- Playground CTA -->
    <section class="joc-home-section joc-cta-section">
      <div class="joc-cta-band">
        <div>
          <span class="joc-kicker">Interactive playground</span>
          <h2 class="joc-section-title">Try packages before you install</h2>
          <p class="joc-muted">
            Explore Browser Lifecycle, Form Intelligence, and Object Diff live — hide the tab, edit
            a form, or diff two objects in the browser.
          </p>
        </div>
        <div class="joc-cta-actions">
          <a class="joc-cta-primary" :href="docsHref('/playground/')">Open playground</a>
          <a class="joc-cta-secondary" :href="docsHref('/packages/')">Browse packages</a>
        </div>
      </div>
    </section>

    <!-- Docs + community -->
    <section class="joc-home-section joc-surface-band" aria-labelledby="docs-community">
      <div class="joc-link-columns">
        <div>
          <span class="joc-kicker">Documentation</span>
          <h2 id="docs-community" class="joc-section-title">Quick links</h2>
          <ul class="joc-link-list">
            <li v-for="link in docLinks" :key="link.href">
              <a :href="docsHref(link.href)">{{ link.label }}</a>
            </li>
          </ul>
        </div>
        <div>
          <span class="joc-kicker">Community</span>
          <h2 class="joc-section-title">Get involved</h2>
          <ul class="joc-link-list">
            <li v-for="link in communityLinks" :key="link.href">
              <a
                :href="link.external ? link.href : docsHref(link.href)"
                :target="link.external ? '_blank' : undefined"
                :rel="link.external ? 'noopener noreferrer' : undefined"
              >
                {{ link.label }}
              </a>
            </li>
          </ul>
        </div>
        <div>
          <span class="joc-kicker">On npm</span>
          <h2 class="joc-section-title">Live packages</h2>
          <ul class="joc-release-list">
            <li v-for="pkg in livePackages" :key="`rel-${pkg.id}`">
              <a :href="docsHref(pkg.docsLink)">
                <strong>{{ pkg.name }}</strong>
                <span>{{ pkg.versionLabel ?? "Latest" }}</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </section>

    <HomePackageCatalog />

    <section class="joc-home-section joc-home-footer-band" aria-label="License and attribution">
      <p class="joc-muted">
        MIT License · Built by
        <a href="https://github.com/itsjayoncode" target="_blank" rel="noopener noreferrer"
          >JayOnCode</a
        >
        ·
        <a href="https://github.com/itsjayoncode/joc" target="_blank" rel="noopener noreferrer"
          >GitHub</a
        >
        ·
        <a href="https://www.npmjs.com/org/jayoncode" target="_blank" rel="noopener noreferrer"
          >npm</a
        >
      </p>
    </section>
  </div>
</template>
