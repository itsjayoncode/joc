<script setup lang="ts">
import { browserLifecycleMeta } from "../../browser-lifecycle-meta.js";
</script>

<template>
  <span class="joc-nav-doc-version" aria-label="Documentation version">
    {{ browserLifecycleMeta.versionLabel }}
  </span>
</template>
