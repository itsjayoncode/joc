<script setup lang="ts">
import { computed } from "vue";

import { docsHref } from "../docs-href.js";
import { isPlaygroundSpaPath } from "../playground-new-tab.js";

const props = withDefaults(
  defineProps<{
    href: string;
    /** Force treating the href as external (opens in a new tab). */
    external?: boolean;
  }>(),
  {
    external: false,
  },
);

const isExternal = computed(() => {
  if (props.external) {
    return true;
  }

  if (/^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(props.href)) {
    return true;
  }

  // Interactive playground SPAs must leave the VitePress tab.
  try {
    const pathname = new URL(docsHref(props.href), "https://example.invalid").pathname;
    return isPlaygroundSpaPath(pathname);
  } catch {
    return isPlaygroundSpaPath(props.href);
  }
});

const resolvedHref = computed(() => docsHref(props.href));
</script>

<template>
  <a
    :href="resolvedHref"
    :target="isExternal ? '_blank' : undefined"
    :rel="isExternal ? 'noopener noreferrer' : undefined"
  >
    <slot />
  </a>
</template>
