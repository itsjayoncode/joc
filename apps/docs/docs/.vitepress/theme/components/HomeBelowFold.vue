<script setup lang="ts">
import { featuredPackages, livePackages, livePackageCount } from "../data/joc-packages";
import HomePackageCatalog from "./HomePackageCatalog.vue";

const philosophy = [
  { title: "Write less", detail: "Shared patterns instead of one-off utilities per app." },
  { title: "Ship less", detail: "Install only the @jayoncode/* packages you need." },
  { title: "Learn once", detail: "Same docs journey and API philosophy across the ecosystem." },
  { title: "Reuse everywhere", detail: "Headless cores that adapt to your UI stack." },
] as const;

const docLinks = [
  { label: "Getting Started", href: "/getting-started/introduction" },
  { label: "Ecosystem", href: "/getting-started/ecosystem" },
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
    <!-- Why JOC -->
    <section class="joc-home-section joc-surface-band" aria-labelledby="why-joc">
      <span class="joc-kicker">Why JOC</span>
      <h2 id="why-joc" class="joc-section-title">Build once. Use everywhere.</h2>
      <p class="joc-muted joc-section-lead">
        JOC is a collection of modern, modular, headless TypeScript libraries that solve common
        frontend engineering problems — without locking you into a framework.
      </p>
    </section>

    <!-- Ecosystem (primary) -->
    <section
      id="ecosystem"
      class="joc-home-section joc-surface-band"
      aria-labelledby="ecosystem-title"
    >
      <span class="joc-kicker">Ecosystem</span>
      <h2 id="ecosystem-title" class="joc-section-title">JOC packages</h2>
      <p class="joc-muted joc-section-lead">
        Independently installable libraries under <code>@jayoncode/*</code>. Start with a live
        package, or explore what is coming next.
      </p>

      <div class="joc-package-stats" aria-label="Package ecosystem status">
        <div class="joc-package-stat">
          <span class="joc-package-stat__value">{{ livePackageCount }}</span>
          <span class="joc-package-stat__label">Live on npm</span>
        </div>
      </div>

      <div class="joc-eco-grid">
        <a
          v-for="pkg in featuredPackages"
          :key="pkg.id"
          class="joc-eco-card"
          :class="[
            `joc-eco-card--${pkg.accent}`,
            pkg.status === 'live' ? 'joc-eco-card--live' : 'joc-eco-card--soon',
          ]"
          :href="pkg.docsLink"
        >
          <div class="joc-eco-card__head">
            <span class="joc-eco-card__icon" aria-hidden="true">{{ pkg.icon }}</span>
            <span
              class="joc-eco-card__status"
              :class="
                pkg.status === 'live' ? 'joc-eco-card__status--live' : 'joc-eco-card__status--soon'
              "
            >
              {{ pkg.status === "live" ? "Live" : "Coming soon" }}
            </span>
          </div>
          <h3 class="joc-eco-card__name">{{ pkg.name }}</h3>
          <p class="joc-eco-card__npm">{{ pkg.npmName }}</p>
          <p class="joc-muted joc-eco-card__tagline">{{ pkg.tagline }}</p>
          <span class="joc-eco-card__cta">
            {{ pkg.status === "live" ? "Documentation" : "Preview" }}
          </span>
        </a>
      </div>
    </section>

    <!-- Why choose JOC — problems -->
    <section class="joc-home-section" aria-labelledby="why-choose">
      <span class="joc-kicker">Why choose JOC</span>
      <h2 id="why-choose" class="joc-section-title">Problems first. Packages second.</h2>
      <div class="joc-table-wrap">
        <table class="joc-home-table">
          <thead>
            <tr>
              <th scope="col">Problem</th>
              <th scope="col">JOC solution</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="pkg in featuredPackages" :key="`problem-${pkg.id}`">
              <td>{{ pkg.problem }}</td>
              <td>
                <a :href="pkg.docsLink">{{ pkg.name }}</a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- Design philosophy -->
    <section class="joc-home-section joc-surface-band" aria-labelledby="philosophy">
      <span class="joc-kicker">Design philosophy</span>
      <h2 id="philosophy" class="joc-section-title">Learn once. Reuse everywhere.</h2>
      <p class="joc-muted joc-section-lead">
        Every JOC package follows the same architecture, API philosophy, documentation structure,
        and development standards — so the second package feels familiar.
      </p>
      <div class="joc-philosophy-grid">
        <article v-for="item in philosophy" :key="item.title" class="joc-philosophy-card">
          <h3 class="joc-philosophy-card__title">{{ item.title }}</h3>
          <p class="joc-muted">{{ item.detail }}</p>
        </article>
      </div>
    </section>

    <!-- Architecture -->
    <section class="joc-home-section" aria-labelledby="architecture">
      <span class="joc-kicker">Architecture</span>
      <h2 id="architecture" class="joc-section-title">Ecosystem layers</h2>
      <p class="joc-muted joc-section-lead">
        Packages stay independent at the TypeScript core, then plug into any application layer.
      </p>
      <div
        class="joc-arch"
        role="img"
        aria-label="Applications over JOC packages over TypeScript core"
      >
        <div class="joc-arch__layer joc-arch__layer--apps">
          <span class="joc-arch__label">Applications</span>
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
          </div>
        </div>
        <div class="joc-arch__arrow" aria-hidden="true" />
        <div class="joc-arch__layer joc-arch__layer--core">
          <span class="joc-arch__label">TypeScript core</span>
          <p class="joc-muted joc-arch__note">Headless, typed, tree-shakeable modules</p>
        </div>
      </div>
    </section>

    <!-- Package comparison -->
    <section class="joc-home-section joc-surface-band" aria-labelledby="comparison">
      <span class="joc-kicker">Package comparison</span>
      <h2 id="comparison" class="joc-section-title">Status at a glance</h2>
      <div class="joc-table-wrap">
        <table class="joc-home-table">
          <thead>
            <tr>
              <th scope="col">Package</th>
              <th scope="col">Purpose</th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="pkg in featuredPackages" :key="`cmp-${pkg.id}`">
              <td>
                <a :href="pkg.docsLink">{{ pkg.name }}</a>
              </td>
              <td>{{ pkg.purpose }}</td>
              <td>{{ pkg.statusLabel }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- Quick start -->
    <section class="joc-home-section" aria-labelledby="quick-start">
      <span class="joc-kicker">Quick start</span>
      <h2 id="quick-start" class="joc-section-title">Install a package. Start building.</h2>
      <p class="joc-muted joc-section-lead">
        Pick any live package — the install path is the same across the ecosystem.
      </p>
      <div class="joc-quick-grid">
        <div class="joc-code-panel" aria-label="Browser Lifecycle install">
          <div class="joc-code-header">
            <span>browser-lifecycle</span>
            <span class="joc-code-badge">Live</span>
          </div>
          <pre v-pre><code>pnpm add @jayoncode/browser-lifecycle

import { createBrowserLifecycle } from "@jayoncode/browser-lifecycle";

const lifecycle = createBrowserLifecycle({ autoStart: true });</code></pre>
          <p class="joc-home-links">
            <a href="/packages/browser-lifecycle/">Package docs</a>
          </p>
        </div>
        <div class="joc-code-panel" aria-label="Form Intelligent install">
          <div class="joc-code-header">
            <span>form-intelligent</span>
            <span class="joc-code-badge">Live</span>
          </div>
          <pre v-pre><code>pnpm add @jayoncode/form-intelligent

import { createForm } from "@jayoncode/form-intelligent";

const form = createForm({
  initialValues: { email: "" },
});</code></pre>
          <p class="joc-home-links">
            <a href="/packages/form-intelligent/">Package docs</a>
          </p>
        </div>
      </div>
    </section>

    <!-- Package showcase -->
    <section class="joc-home-section joc-surface-band" aria-labelledby="showcase">
      <span class="joc-kicker">Package showcase</span>
      <h2 id="showcase" class="joc-section-title">What each package covers</h2>
      <div class="joc-showcase-grid">
        <article
          v-for="pkg in featuredPackages"
          :key="`show-${pkg.id}`"
          class="joc-show-card"
          :class="`joc-show-card--${pkg.accent}`"
        >
          <h3 class="joc-show-card__name">{{ pkg.name }}</h3>
          <ul class="joc-show-card__caps">
            <li v-for="cap in pkg.capabilities" :key="cap">{{ cap }}</li>
          </ul>
          <a class="joc-show-card__link" :href="pkg.docsLink">Open docs</a>
        </article>
      </div>
    </section>

    <!-- Playground -->
    <section class="joc-home-section joc-cta-section">
      <div class="joc-cta-band">
        <div>
          <span class="joc-kicker">Interactive playground</span>
          <h2 class="joc-section-title">Try packages in the browser</h2>
          <p class="joc-muted">
            Explore live demos for Browser Lifecycle, Form Intelligent, Object Diff, and more —
            without setting up a local project.
          </p>
        </div>
        <div class="joc-cta-actions">
          <a class="joc-cta-primary" href="/playground/">Open playground</a>
          <a class="joc-cta-secondary" href="/packages/">Browse packages</a>
        </div>
      </div>
    </section>

    <!-- Documentation + community -->
    <section class="joc-home-section joc-surface-band" aria-labelledby="docs-community">
      <div class="joc-link-columns">
        <div>
          <span class="joc-kicker">Documentation</span>
          <h2 id="docs-community" class="joc-section-title">Quick links</h2>
          <ul class="joc-link-list">
            <li v-for="link in docLinks" :key="link.href">
              <a :href="link.href">{{ link.label }}</a>
            </li>
          </ul>
        </div>
        <div>
          <span class="joc-kicker">Community</span>
          <h2 class="joc-section-title">Get involved</h2>
          <ul class="joc-link-list">
            <li v-for="link in communityLinks" :key="link.href">
              <a
                :href="link.href"
                :target="link.external ? '_blank' : undefined"
                :rel="link.external ? 'noopener noreferrer' : undefined"
              >
                {{ link.label }}
              </a>
            </li>
          </ul>
        </div>
        <div>
          <span class="joc-kicker">Latest releases</span>
          <h2 class="joc-section-title">On npm now</h2>
          <ul class="joc-release-list">
            <li v-for="pkg in livePackages" :key="`rel-${pkg.id}`">
              <a :href="pkg.docsLink">
                <strong>{{ pkg.name }}</strong>
                <span>{{ pkg.versionLabel ?? "Latest" }}</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </section>

    <!-- Full catalog -->
    <HomePackageCatalog />

    <!-- Footer band -->
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
