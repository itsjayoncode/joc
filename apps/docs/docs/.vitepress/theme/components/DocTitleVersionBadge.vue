<script setup lang="ts">
import { onMounted } from "vue";
import { onContentUpdated, useRoute } from "vitepress";

import { browserLifecycleMeta } from "../../browser-lifecycle-meta.js";
import { formIntelligentMeta } from "../../form-intelligent-meta.js";
import { objectDiffMeta } from "../../object-diff-meta.js";
import { useDocsPath } from "../normalize-docs-path.js";

const PACKAGE_OVERVIEW_META = {
  "browser-lifecycle": browserLifecycleMeta,
  "form-intelligent": formIntelligentMeta,
  "object-diff": objectDiffMeta,
} as const;

const route = useRoute();
const { normalizeDocsPath } = useDocsPath();

function injectTitleVersionBadge() {
  const match = normalizeDocsPath(route.path).match(/^\/packages\/([^/]+)\/overview\/?$/);
  if (!match) {
    return;
  }

  const meta = PACKAGE_OVERVIEW_META[match[1] as keyof typeof PACKAGE_OVERVIEW_META];
  if (!meta) {
    return;
  }

  const h1 = document.querySelector<HTMLHeadingElement>(".vp-doc > h1:first-of-type");
  if (!h1 || h1.querySelector(".joc-pkg-version-tag--title")) {
    return;
  }

  const badge = document.createElement("span");
  badge.className = "joc-pkg-version-tag joc-pkg-version-tag--title";
  badge.textContent = meta.versionLabel;

  const anchor = h1.querySelector(".header-anchor");
  if (anchor) {
    h1.insertBefore(document.createTextNode(" "), anchor);
    h1.insertBefore(badge, anchor);
    return;
  }

  h1.append(document.createTextNode(" "), badge);
}

onMounted(injectTitleVersionBadge);
onContentUpdated(injectTitleVersionBadge);
</script>

<template />
