<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter, withBase } from "vitepress";

import { browserLifecycleDocVersions } from "../../browser-lifecycle-versions.js";
import { formIntelligentDocVersions } from "../../form-intelligent-versions.js";
import { objectDiffDocVersions } from "../../object-diff-versions.js";
import { useDocsPath } from "../normalize-docs-path.js";

const route = useRoute();
const router = useRouter();
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

const isPackageLanding = computed(() => {
  const pkg = activePackage.value;
  if (!pkg) {
    return false;
  }

  const path = docsPath.value.replace(/\/$/, "") || "/";
  const base = pkg.basePath.replace(/\/$/, "");
  return path === base;
});

const showSwitcher = computed(() => activePackage.value !== null && !isPackageLanding.value);

const archivedVersionPattern = computed(() => {
  const pkg = activePackage.value;
  if (!pkg) {
    return null;
  }

  const escaped = pkg.basePath.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`${escaped}/(v[\\d.]+)(?=/|$)`);
});

const activeVersion = computed(() => {
  const pkg = activePackage.value;
  const pattern = archivedVersionPattern.value;
  if (!pkg || !pattern) {
    return "";
  }

  const match = docsPath.value.match(pattern);
  return match?.[1]?.slice(1) ?? pkg.currentVersion;
});

const versionOptions = computed(() => {
  const pkg = activePackage.value;
  if (!pkg) {
    return [];
  }

  const latest = {
    version: pkg.currentVersion,
    label: `${pkg.currentVersionLabel} (latest)`,
  };

  const archived = pkg.archives
    .filter((archive) => archive.version !== pkg.currentVersion)
    .map((archive) => ({
      version: archive.version,
      label: archive.label,
    }));

  return [latest, ...archived];
});

function mapPathToVersion(pathname: string, targetVersion: string): string {
  const pkg = activePackage.value;
  if (!pkg) {
    return pathname;
  }

  const normalized = normalizeDocsPath(pathname);
  const escaped = pkg.basePath.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const suffix = normalized.replace(new RegExp(`^${escaped}(?:/v[\\d.]+)?`), "");

  if (targetVersion === pkg.currentVersion) {
    return `${pkg.basePath}${suffix}`;
  }

  return `${pkg.basePath}/v${targetVersion}${suffix}`;
}

function onVersionChange(event: Event) {
  const select = event.target as HTMLSelectElement;
  const nextVersion = select.value;
  // router.go() writes history as-is — must include site base (/joc/ on GitHub Pages).
  const nextPath = withBase(mapPathToVersion(docsPath.value, nextVersion));
  router.go(nextPath);
}
</script>

<template>
  <div v-if="showSwitcher" class="joc-docs-version-switcher" aria-label="Documentation version">
    <label class="joc-docs-version-switcher__label" for="joc-docs-version-select">Version</label>
    <select
      id="joc-docs-version-select"
      class="joc-docs-version-switcher__select"
      :value="activeVersion"
      @change="onVersionChange"
    >
      <option v-for="option in versionOptions" :key="option.version" :value="option.version">
        {{ option.label }}
      </option>
    </select>
  </div>
</template>
