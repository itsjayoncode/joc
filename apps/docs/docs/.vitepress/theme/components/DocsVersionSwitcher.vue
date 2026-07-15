<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vitepress";

import { browserLifecycleDocVersions } from "../../browser-lifecycle-versions.js";

const route = useRoute();
const router = useRouter();

const pkgBase = browserLifecycleDocVersions.basePath;
const archivedVersionPattern = /\/packages\/browser-lifecycle\/(v[\d.]+)(?=\/|$)/;

const showSwitcher = computed(() => route.path.startsWith(pkgBase));

const activeVersion = computed(() => {
  const match = route.path.match(archivedVersionPattern);
  return match?.[1]?.slice(1) ?? browserLifecycleDocVersions.currentVersion;
});

const versionOptions = computed(() => {
  const latest = {
    version: browserLifecycleDocVersions.currentVersion,
    label: `${browserLifecycleDocVersions.currentVersionLabel} (latest)`,
  };

  const archived = browserLifecycleDocVersions.archives
    .filter((archive) => archive.version !== browserLifecycleDocVersions.currentVersion)
    .map((archive) => ({
      version: archive.version,
      label: archive.label,
    }));

  return [latest, ...archived];
});

function mapPathToVersion(pathname: string, targetVersion: string): string {
  const suffix = pathname.replace(/^\/packages\/browser-lifecycle(?:\/v[\d.]+)?/, "");

  if (targetVersion === browserLifecycleDocVersions.currentVersion) {
    return `${pkgBase}${suffix}`;
  }

  return `${pkgBase}/v${targetVersion}${suffix}`;
}

function onVersionChange(event: Event) {
  const select = event.target as HTMLSelectElement;
  const nextVersion = select.value;
  const nextPath = mapPathToVersion(route.path, nextVersion);
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
