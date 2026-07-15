<script setup lang="ts">
import DefaultTheme from "vitepress/theme";

import NavPackageVersion from "./components/NavPackageVersion.vue";

const { Layout: DefaultLayout } = DefaultTheme;
</script>

<template>
  <DefaultLayout>
    <template #nav-bar-title-after>
      <NavPackageVersion />
    </template>
  </DefaultLayout>
</template>
