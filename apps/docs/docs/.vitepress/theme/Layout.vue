<script setup lang="ts">
import DefaultTheme from "vitepress/theme";

import { livePackageCount } from "./data/joc-packages.js";
import ArchivedDocsBanner from "./components/ArchivedDocsBanner.vue";
import DocTitleVersionBadge from "./components/DocTitleVersionBadge.vue";
import DocsVersionSwitcher from "./components/DocsVersionSwitcher.vue";
import NavPackageVersion from "./components/NavPackageVersion.vue";
import SponsorCta from "./components/SponsorCta.vue";

const { Layout: DefaultLayout } = DefaultTheme;
</script>

<template>
  <DefaultLayout>
    <template #nav-bar-title-after>
      <NavPackageVersion />
    </template>

    <!-- Tablet + mobile top bar (desktop keeps the menu-row copy). -->
    <template #nav-bar-content-before>
      <div class="joc-sponsor-topbar">
        <SponsorCta placement="nav" />
      </div>
    </template>

    <template #home-hero-info-after>
      <div class="joc-hero-snapshot" role="list" aria-label="Ecosystem snapshot">
        <span class="joc-hero-tag joc-hero-tag--packages" role="listitem">
          {{ livePackageCount }} flagship libraries
        </span>
        <span class="joc-hero-tag joc-hero-tag--ts" role="listitem">100% TypeScript</span>
        <span class="joc-hero-tag joc-hero-tag--oss" role="listitem">Open Source</span>
      </div>
    </template>

    <template #home-hero-actions-after>
      <div class="joc-sponsor-slot">
        <SponsorCta placement="hero" />
      </div>
    </template>

    <template #doc-before>
      <DocsVersionSwitcher />
      <ArchivedDocsBanner />
      <DocTitleVersionBadge />
    </template>
  </DefaultLayout>
</template>
