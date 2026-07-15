<script setup lang="ts">
import { jocPackages, livePackageCount, upcomingPackageCount } from "../data/joc-packages";
</script>

<template>
  <section id="packages" class="joc-home-section joc-package-catalog joc-surface-band">
    <span class="joc-kicker">JayOnCode collection</span>
    <h2 class="joc-section-title">Packages built for real developer problems</h2>
    <p class="joc-muted joc-section-lead">
      JOC is an open source monorepo of focused TypeScript libraries under the
      <code>@jayoncode/*</code> scope. Install only what you need — each package ships independently
      with shared engineering standards, docs, and long-term maintainability in mind.
    </p>

    <div class="joc-package-stats" aria-label="Package ecosystem status">
      <div class="joc-package-stat">
        <span class="joc-package-stat__value">{{ livePackageCount }}</span>
        <span class="joc-package-stat__label">Live on npm</span>
      </div>
      <div class="joc-package-stat">
        <span class="joc-package-stat__value">{{ upcomingPackageCount }}+</span>
        <span class="joc-package-stat__label">Coming soon</span>
      </div>
      <div class="joc-package-stat">
        <span class="joc-package-stat__value">∞</span>
        <span class="joc-package-stat__label">Framework-agnostic</span>
      </div>
    </div>

    <div class="joc-package-grid">
      <article
        v-for="pkg in jocPackages"
        :key="pkg.id"
        class="joc-package-card"
        :class="[
          `joc-package-card--${pkg.accent}`,
          pkg.status === 'live' ? 'joc-package-card--live' : 'joc-package-card--soon',
        ]"
      >
        <div class="joc-package-card__head">
          <div class="joc-package-card__icon" aria-hidden="true">{{ pkg.icon }}</div>
          <span
            class="joc-package-card__status"
            :class="
              pkg.status === 'live'
                ? 'joc-package-card__status--live'
                : 'joc-package-card__status--soon'
            "
          >
            {{ pkg.status === "live" ? "Live" : "Coming soon" }}
          </span>
        </div>

        <h3 class="joc-package-card__name">{{ pkg.name }}</h3>
        <p class="joc-package-card__npm">{{ pkg.npmName }}</p>
        <p class="joc-package-card__tagline joc-muted">{{ pkg.tagline }}</p>

        <a class="joc-package-card__link" :href="pkg.docsLink">
          {{ pkg.status === "live" ? "View docs" : "Preview package" }}
        </a>
      </article>
    </div>

    <p class="joc-package-footnote joc-muted">
      More utilities are on the
      <a href="/roadmap/">product roadmap</a>
      — including cache, queue, config, and diagnostics tooling.
    </p>
  </section>
</template>
