<script setup lang="ts">
import { computed } from "vue";

import { browserLifecycleMeta } from "../../browser-lifecycle-meta.js";
import { formIntelligenceMeta } from "../../form-intelligence-meta.js";
import { objectDiffMeta } from "../../object-diff-meta.js";
import { storageMeta } from "../../storage-meta.js";
import DocsLink from "./DocsLink.vue";
import PackageIcon from "./PackageIcon.vue";
import { getPackageLanding } from "../data/package-landings.js";
import { highlightTypeScript } from "../highlight-typescript.js";

const PACKAGE_META = {
  "browser-lifecycle": browserLifecycleMeta,
  "form-intelligence": formIntelligenceMeta,
  "object-diff": objectDiffMeta,
  storage: storageMeta,
} as const;

const props = defineProps<{
  packageId: string;
}>();

const landing = computed(() => getPackageLanding(props.packageId));

const versionLabel = computed(() => {
  const meta = PACKAGE_META[props.packageId as keyof typeof PACKAGE_META];
  return meta?.versionLabel;
});

const highlightedSample = computed(() => {
  const code = landing.value?.sampleCode;
  return code ? highlightTypeScript(code) : "";
});
</script>

<template>
  <div v-if="landing" class="joc-pkg-landing" :class="`joc-pkg-landing--${landing.accent}`">
    <div class="joc-pkg-landing__bg" aria-hidden="true" />
    <section class="joc-pkg-landing__hero" aria-labelledby="joc-pkg-landing-title">
      <div class="joc-pkg-landing__hero-inner">
        <div class="joc-pkg-landing__icon" aria-hidden="true">
          <PackageIcon :package-id="landing.id" size="lg" />
        </div>
        <span
          v-if="versionLabel"
          class="joc-pkg-version-tag joc-pkg-landing__version"
          :aria-label="`${landing.name} ${versionLabel}`"
        >
          {{ versionLabel }}
        </span>
        <h1 id="joc-pkg-landing-title" class="joc-pkg-landing__title">{{ landing.name }}</h1>
        <p class="joc-pkg-landing__npm">{{ landing.npmName }}</p>
        <p class="joc-pkg-landing__headline">{{ landing.headline }}</p>
        <p class="joc-pkg-landing__description">{{ landing.description }}</p>
        <div class="joc-pkg-landing__actions">
          <DocsLink
            class="joc-pkg-landing__cta joc-pkg-landing__cta--primary"
            :href="landing.getStartedLink"
          >
            Get Started
          </DocsLink>
          <DocsLink
            class="joc-pkg-landing__cta joc-pkg-landing__cta--ghost"
            :href="landing.playgroundLink"
            external
          >
            Open playground
          </DocsLink>
          <DocsLink
            v-if="landing.draftDeskLink"
            class="joc-pkg-landing__cta joc-pkg-landing__cta--draft-desk"
            :href="landing.draftDeskLink"
          >
            <span class="joc-pkg-landing__cta-draft-desk__label">Try Draft Desk</span>
            <span class="joc-pkg-landing__cta-draft-desk__arrow" aria-hidden="true">↗</span>
          </DocsLink>
        </div>
      </div>
    </section>

    <section class="joc-pkg-landing__sample" aria-labelledby="joc-pkg-sample-title">
      <div class="joc-pkg-landing__sample-inner">
        <h2 id="joc-pkg-sample-title" class="joc-pkg-landing__section-title">
          {{ landing.sampleTitle }}
        </h2>
        <div class="joc-pkg-landing__code" data-lang="ts">
          <pre><code class="language-ts" v-html="highlightedSample" /></pre>
        </div>
        <DocsLink
          class="joc-pkg-landing__cta joc-pkg-landing__cta--primary"
          :href="landing.overviewLink"
        >
          Read the overview
        </DocsLink>
      </div>
    </section>

    <section class="joc-pkg-landing__highlights" aria-labelledby="joc-pkg-highlights-title">
      <h2 id="joc-pkg-highlights-title" class="joc-pkg-landing__section-title">
        Why it stands out
      </h2>
      <div class="joc-pkg-landing__grid">
        <article v-for="item in landing.highlights" :key="item.title" class="joc-pkg-landing__card">
          <h3>{{ item.title }}</h3>
          <p>{{ item.detail }}</p>
        </article>
      </div>
    </section>
  </div>
  <p v-else class="joc-pkg-landing__missing">Unknown package landing: {{ packageId }}</p>
</template>
