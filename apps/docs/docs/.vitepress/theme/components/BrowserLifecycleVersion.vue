<script setup lang="ts">
import { browserLifecycleMeta } from "../../browser-lifecycle-meta.js";

withDefaults(
  defineProps<{
    mode?: "badge" | "overview" | "install";
  }>(),
  {
    mode: "badge",
  },
);

const pkg = browserLifecycleMeta;
</script>

<template>
  <span v-if="mode === 'badge'" class="joc-pkg-version">
    {{ pkg.versionLabel }}
  </span>

  <p v-else-if="mode === 'overview'" class="joc-pkg-version-block">
    Current npm version:
    <strong>{{ pkg.versionLabel }}</strong>
    (<code>{{ pkg.npmName }}</code>).
    See
    <a href="/packages/browser-lifecycle/migration/">Migration</a>
    and
    <a href="/changelog/">Changelog</a>
    for release history.
  </p>

  <div v-else-if="mode === 'install'" class="joc-pkg-install-note">
    <p>
      Latest published version:
      <strong>{{ pkg.versionLabel }}</strong>
    </p>
    <pre><code>npm install {{ pkg.npmName }}@{{ pkg.version }}</code></pre>
  </div>
</template>
