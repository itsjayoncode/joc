<script setup lang="ts">
import { computed } from "vue";

import { docsHref } from "../docs-href.js";

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

  return /^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(props.href);
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
