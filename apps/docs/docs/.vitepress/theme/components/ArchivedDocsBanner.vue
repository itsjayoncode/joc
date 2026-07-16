<script setup lang="ts">
import { computed } from "vue";
import { useRoute, withBase } from "vitepress";

import { browserLifecycleDocVersions } from "../../browser-lifecycle-versions.js";
import { formIntelligentDocVersions } from "../../form-intelligent-versions.js";
import { objectDiffDocVersions } from "../../object-diff-versions.js";
import { useDocsPath } from "../normalize-docs-path.js";

const route = useRoute();
const { normalizeDocsPath } = useDocsPath();

const DOC_VERSION_PACKAGES = [
  browserLifecycleDocVersions,
  formIntelligentDocVersions,
  objectDiffDocVersions,
] as const;

const docsPath = computed(() => normalizeDocsPath(route.path));

const activePackage = computed(() => {
  const matches = DOC_VERSION_PACKAGES.filter((pkg) =>
    docsPath.value.startsWith(pkg.basePath),
  ).sort((left, right) => right.basePath.length - left.basePath.length);

  return matches[0] ?? null;
});

const archivedVersion = computed(() => {
  const pkg = activePackage.value;
  if (!pkg) {
    return null;
  }

  const escaped = pkg.basePath.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(`${escaped}/(v[\\d.]+)(?=/|$)`);
  const match = docsPath.value.match(pattern);
  return match?.[1]?.slice(1) ?? null;
});

const showBanner = computed(() => {
  const pkg = activePackage.value;
  return (
    pkg !== null && archivedVersion.value !== null && archivedVersion.value !== pkg.currentVersion
  );
});
</script>

<template>
  <div v-if="showBanner && activePackage" class="joc-archived-docs-banner" role="status">
    <p>
      You are viewing archived documentation for
      <strong>{{ `v${archivedVersion}` }}</strong> of <code>{{ activePackage.packageName }}</code
      >.
      <a :href="withBase(`${activePackage.basePath}/`)"
        >Switch to latest ({{ activePackage.currentVersionLabel }})</a
      >
      or read the
      <a :href="withBase(`${activePackage.basePath}/changelog`)">changelog</a>.
    </p>
  </div>
</template>
