<script setup lang="ts">
import DefaultTheme from "vitepress/theme";

import ArchivedDocsBanner from "./components/ArchivedDocsBanner.vue";
import DocTitleVersionBadge from "./components/DocTitleVersionBadge.vue";
import DocsVersionSwitcher from "./components/DocsVersionSwitcher.vue";
import NavPackageVersion from "./components/NavPackageVersion.vue";

const { Layout: DefaultLayout } = DefaultTheme;
</script>

<template>
  <DefaultLayout>
    <template #nav-bar-title-after>
      <NavPackageVersion />
    </template>

    <template #doc-before>
      <DocsVersionSwitcher />
      <ArchivedDocsBanner />
      <DocTitleVersionBadge />
    </template>
  </DefaultLayout>
</template>
