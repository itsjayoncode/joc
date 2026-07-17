<script setup lang="ts">
import { docsHref } from "../docs-href.js";
import { livePackages } from "../data/joc-packages";
import { resolvePlaygroundPath } from "../../playground-path.js";
import PackageIcon from "./PackageIcon.vue";

function playgroundGuideLink(docsLink: string): string {
  return docsHref(`${docsLink.replace(/\/$/, "")}/playground/playground`);
}

function playgroundHref(packageId: string): string {
  return docsHref(resolvePlaygroundPath(packageId));
}
</script>

<template>
  <section class="joc-playground-catalog" aria-label="Package playgrounds">
    <div class="joc-playground-list">
      <article
        v-for="pkg in livePackages"
        :key="pkg.id"
        class="joc-playground-card"
        :class="`joc-playground-card--${pkg.accent}`"
      >
        <div class="joc-playground-card__glow" aria-hidden="true" />

        <div class="joc-playground-card__body">
          <div class="joc-playground-card__identity">
            <div class="joc-playground-card__icon" aria-hidden="true">
              <PackageIcon :package-id="pkg.id" size="md" />
            </div>
            <div class="joc-playground-card__meta">
              <span class="joc-playground-card__status">Live playground</span>
              <span v-if="pkg.versionLabel" class="joc-pkg-version-tag">{{
                pkg.versionLabel
              }}</span>
            </div>
          </div>

          <div class="joc-playground-card__content">
            <h2 class="joc-playground-card__name">{{ pkg.name }}</h2>
            <p class="joc-playground-card__npm">{{ pkg.npmName }}</p>
            <p class="joc-playground-card__tagline">{{ pkg.tagline }}</p>

            <ul class="joc-playground-card__capabilities">
              <li v-for="capability in pkg.capabilities" :key="capability">{{ capability }}</li>
            </ul>
          </div>

          <div class="joc-playground-card__actions">
            <a
              class="joc-cta-primary joc-playground-card__cta"
              :href="playgroundHref(pkg.id)"
              target="_blank"
              rel="noreferrer noopener"
            >
              Open playground
            </a>

            <div class="joc-playground-card__links">
              <a class="joc-playground-card__link" :href="playgroundGuideLink(pkg.docsLink)">
                Playground docs
              </a>
              <span class="joc-playground-card__divider" aria-hidden="true">·</span>
              <a class="joc-playground-card__link" :href="docsHref(pkg.docsLink)">Package docs</a>
            </div>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>
