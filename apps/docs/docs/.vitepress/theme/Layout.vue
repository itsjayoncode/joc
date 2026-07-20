<script setup lang="ts">
import DefaultTheme from "vitepress/theme";

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
