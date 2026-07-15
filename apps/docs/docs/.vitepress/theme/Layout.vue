<script setup lang="ts">
import DefaultTheme from "vitepress/theme";

import ArchivedDocsBanner from "./components/ArchivedDocsBanner.vue";
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
    </template>
  </DefaultLayout>
</template>
