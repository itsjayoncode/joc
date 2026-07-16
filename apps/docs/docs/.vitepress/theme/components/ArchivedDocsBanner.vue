<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vitepress";

import { browserLifecycleDocVersions } from "../../browser-lifecycle-versions.js";

const route = useRoute();
const pkgBase = browserLifecycleDocVersions.basePath;
const archivedVersionPattern = /\/packages\/browser-lifecycle\/(v[\d.]+)(?=\/|$)/;

const archivedVersion = computed(() => {
  const match = route.path.match(archivedVersionPattern);
  return match?.[1]?.slice(1) ?? null;
});

const showBanner = computed(
  () =>
    archivedVersion.value !== null &&
    archivedVersion.value !== browserLifecycleDocVersions.currentVersion,
);
</script>

<template>
  <div v-if="showBanner" class="joc-archived-docs-banner" role="status">
    <p>
      You are viewing archived documentation for
      <strong>{{ `v${archivedVersion}` }}</strong> of
      <code>{{ browserLifecycleDocVersions.packageName }}</code
      >.
      <a :href="`${pkgBase}/`"
        >Switch to latest ({{ browserLifecycleDocVersions.currentVersionLabel }})</a
      >
      or read the <a href="/packages/browser-lifecycle/changelog">changelog</a>.
    </p>
  </div>
</template>
