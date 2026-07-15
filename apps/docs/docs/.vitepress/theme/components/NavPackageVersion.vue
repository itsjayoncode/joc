<script setup lang="ts">
import { computed } from "vue";
import { useData } from "vitepress";

const { theme } = useData();

const pkg = computed(() => theme.value.browserLifecycle);
</script>

<template>
  <span class="joc-nav-doc-version" aria-label="Documentation version">
    {{ pkg.versionLabel }}
  </span>
</template>
