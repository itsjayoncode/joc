<script setup lang="ts">
import { docsHref } from "../docs-href.js";
import { livePackages, livePackageCount } from "../data/joc-packages";
import PackageIcon from "./PackageIcon.vue";
</script>

<template>
  <section id="packages" class="joc-home-section joc-package-catalog joc-surface-band">
    <span class="joc-kicker">Package catalog</span>
    <h2 class="joc-section-title">Available now</h2>
    <p class="joc-muted joc-section-lead">
      Three live packages on npm. More libraries are on the
      <a :href="docsHref('/roadmap/')">roadmap</a>.
    </p>

    <div class="joc-package-stats" aria-label="Package ecosystem status">
      <div class="joc-package-stat">
        <span class="joc-package-stat__value">{{ livePackageCount }}</span>
        <span class="joc-package-stat__label">Live on npm</span>
      </div>
    </div>

    <div class="joc-package-grid">
      <article
        v-for="pkg in livePackages"
        :key="pkg.id"
        class="joc-package-card joc-package-card--live"
        :class="`joc-package-card--${pkg.accent}`"
      >
        <div class="joc-package-card__head">
          <div class="joc-package-card__icon" aria-hidden="true">
            <PackageIcon :package-id="pkg.id" size="sm" />
          </div>
          <span class="joc-package-card__status joc-package-card__status--live">Live</span>
        </div>

        <h3 class="joc-package-card__name">{{ pkg.name }}</h3>
        <p class="joc-package-card__npm">{{ pkg.npmName }}</p>
        <p class="joc-package-card__tagline joc-muted">{{ pkg.tagline }}</p>

        <a class="joc-package-card__link" :href="docsHref(pkg.docsLink)">View docs</a>
      </article>
    </div>
  </section>
</template>
