<script setup lang="ts">
withDefaults(
  defineProps<{
    packageId: string;
    size?: "sm" | "md" | "lg";
  }>(),
  { size: "md" },
);
</script>

<template>
  <span
    class="joc-pkg-icon"
    :class="[`joc-pkg-icon--${size}`, `joc-pkg-icon--${packageId}`]"
    aria-hidden="true"
  >
    <!-- Browser Lifecycle: window + live pulse -->
    <svg
      v-if="packageId === 'browser-lifecycle'"
      class="joc-pkg-icon__svg"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        class="joc-pkg-icon__frame"
        x="6"
        y="8"
        width="36"
        height="30"
        rx="5"
        stroke="currentColor"
        stroke-width="2"
      />
      <path
        class="joc-pkg-icon__chrome"
        d="M6 16h36"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
      />
      <circle
        class="joc-pkg-icon__dot joc-pkg-icon__dot--a"
        cx="12"
        cy="12"
        r="1.6"
        fill="currentColor"
      />
      <circle
        class="joc-pkg-icon__dot joc-pkg-icon__dot--b"
        cx="17"
        cy="12"
        r="1.6"
        fill="currentColor"
      />
      <circle
        class="joc-pkg-icon__dot joc-pkg-icon__dot--c"
        cx="22"
        cy="12"
        r="1.6"
        fill="currentColor"
      />
      <circle
        class="joc-pkg-icon__pulse-ring"
        cx="24"
        cy="28"
        r="7"
        stroke="currentColor"
        stroke-width="1.5"
      />
      <circle class="joc-pkg-icon__pulse-core" cx="24" cy="28" r="3.2" fill="currentColor" />
    </svg>

    <!-- Form Intelligence: fields + check -->
    <svg
      v-else-if="packageId === 'form-intelligence'"
      class="joc-pkg-icon__svg"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        class="joc-pkg-icon__frame"
        x="8"
        y="7"
        width="32"
        height="34"
        rx="5"
        stroke="currentColor"
        stroke-width="2"
      />
      <rect
        class="joc-pkg-icon__field joc-pkg-icon__field--1"
        x="13"
        y="13"
        width="22"
        height="5"
        rx="2"
        fill="currentColor"
        opacity="0.28"
      />
      <rect
        class="joc-pkg-icon__field joc-pkg-icon__field--2"
        x="13"
        y="22"
        width="16"
        height="5"
        rx="2"
        fill="currentColor"
        opacity="0.2"
      />
      <path
        class="joc-pkg-icon__check"
        d="M15 33.5l4 4 10-11"
        stroke="currentColor"
        stroke-width="2.4"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <circle class="joc-pkg-icon__cursor" cx="33" cy="24.5" r="1.8" fill="currentColor" />
    </svg>

    <!-- Object Diff: split panes + path -->
    <svg
      v-else-if="packageId === 'object-diff'"
      class="joc-pkg-icon__svg"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        class="joc-pkg-icon__pane joc-pkg-icon__pane--left"
        x="6"
        y="10"
        width="14"
        height="28"
        rx="3"
        stroke="currentColor"
        stroke-width="2"
      />
      <rect
        class="joc-pkg-icon__pane joc-pkg-icon__pane--right"
        x="28"
        y="10"
        width="14"
        height="28"
        rx="3"
        stroke="currentColor"
        stroke-width="2"
      />
      <path
        class="joc-pkg-icon__bridge"
        d="M20 18h8M20 24h8M20 30h8"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
      />
      <path
        class="joc-pkg-icon__arrow"
        d="M22 36l4 4 4-4"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>

    <!-- Keyboard -->
    <svg
      v-else-if="packageId === 'keyboard'"
      class="joc-pkg-icon__svg"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="5" y="14" width="38" height="22" rx="4" stroke="currentColor" stroke-width="2" />
      <rect
        class="joc-pkg-icon__key joc-pkg-icon__key--1"
        x="10"
        y="19"
        width="5"
        height="5"
        rx="1.2"
        fill="currentColor"
        opacity="0.35"
      />
      <rect
        class="joc-pkg-icon__key joc-pkg-icon__key--2"
        x="18"
        y="19"
        width="5"
        height="5"
        rx="1.2"
        fill="currentColor"
        opacity="0.55"
      />
      <rect
        class="joc-pkg-icon__key joc-pkg-icon__key--3"
        x="26"
        y="19"
        width="5"
        height="5"
        rx="1.2"
        fill="currentColor"
        opacity="0.35"
      />
      <rect
        class="joc-pkg-icon__key joc-pkg-icon__key--4"
        x="34"
        y="19"
        width="5"
        height="5"
        rx="1.2"
        fill="currentColor"
        opacity="0.35"
      />
      <rect
        class="joc-pkg-icon__key joc-pkg-icon__key--5"
        x="14"
        y="27"
        width="20"
        height="5"
        rx="1.2"
        fill="currentColor"
        opacity="0.28"
      />
    </svg>

    <!-- Theme -->
    <svg
      v-else-if="packageId === 'theme'"
      class="joc-pkg-icon__svg"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="24" cy="24" r="14" stroke="currentColor" stroke-width="2" />
      <path
        class="joc-pkg-icon__moon"
        d="M24 10a14 14 0 0 0 0 28V10z"
        fill="currentColor"
        opacity="0.35"
      />
      <circle
        class="joc-pkg-icon__orbit"
        cx="24"
        cy="24"
        r="6"
        stroke="currentColor"
        stroke-width="1.5"
      />
    </svg>

    <!-- Request -->
    <svg
      v-else-if="packageId === 'request'"
      class="joc-pkg-icon__svg"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        class="joc-pkg-icon__bolt"
        d="M14 26h10l-2 12 14-16H26l2-12L14 26z"
        stroke="currentColor"
        stroke-width="2"
        stroke-linejoin="round"
      />
    </svg>

    <!-- Scroll -->
    <svg
      v-else-if="packageId === 'scroll'"
      class="joc-pkg-icon__svg"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="16" y="6" width="16" height="36" rx="8" stroke="currentColor" stroke-width="2" />
      <circle class="joc-pkg-icon__thumb" cx="24" cy="18" r="3.5" fill="currentColor" />
    </svg>

    <!-- Responsive -->
    <svg
      v-else-if="packageId === 'responsive'"
      class="joc-pkg-icon__svg"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="6" y="12" width="22" height="16" rx="2" stroke="currentColor" stroke-width="2" />
      <rect
        class="joc-pkg-icon__device"
        x="30"
        y="18"
        width="12"
        height="18"
        rx="2"
        stroke="currentColor"
        stroke-width="2"
      />
      <path d="M14 32h6" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
    </svg>

    <!-- Audit -->
    <svg
      v-else-if="packageId === 'audit'"
      class="joc-pkg-icon__svg"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M14 8h16l8 8v24a2 2 0 0 1-2 2H14a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2z"
        stroke="currentColor"
        stroke-width="2"
      />
      <path d="M30 8v8h8" stroke="currentColor" stroke-width="2" stroke-linejoin="round" />
      <path
        class="joc-pkg-icon__lines"
        d="M16 24h16M16 30h12M16 36h10"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
      />
    </svg>

    <!-- Layers -->
    <svg
      v-else-if="packageId === 'layers'"
      class="joc-pkg-icon__svg"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        class="joc-pkg-icon__layer joc-pkg-icon__layer--1"
        x="10"
        y="20"
        width="28"
        height="16"
        rx="3"
        stroke="currentColor"
        stroke-width="2"
      />
      <rect
        class="joc-pkg-icon__layer joc-pkg-icon__layer--2"
        x="8"
        y="14"
        width="28"
        height="16"
        rx="3"
        stroke="currentColor"
        stroke-width="2"
      />
      <rect
        class="joc-pkg-icon__layer joc-pkg-icon__layer--3"
        x="6"
        y="8"
        width="28"
        height="16"
        rx="3"
        stroke="currentColor"
        stroke-width="2"
      />
    </svg>

    <!-- Workflow -->
    <svg
      v-else-if="packageId === 'workflow'"
      class="joc-pkg-icon__svg"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        class="joc-pkg-icon__node joc-pkg-icon__node--1"
        cx="12"
        cy="24"
        r="5"
        stroke="currentColor"
        stroke-width="2"
      />
      <circle
        class="joc-pkg-icon__node joc-pkg-icon__node--2"
        cx="24"
        cy="14"
        r="5"
        stroke="currentColor"
        stroke-width="2"
      />
      <circle
        class="joc-pkg-icon__node joc-pkg-icon__node--3"
        cx="36"
        cy="24"
        r="5"
        stroke="currentColor"
        stroke-width="2"
      />
      <circle
        class="joc-pkg-icon__node joc-pkg-icon__node--4"
        cx="24"
        cy="34"
        r="5"
        stroke="currentColor"
        stroke-width="2"
      />
      <path
        d="M16.5 21l3-4.5M27.5 16.5l3 4.5M31.5 27l-3 4.5M16.5 27l3 4.5"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
      />
    </svg>

    <!-- Permissions -->
    <svg
      v-else-if="packageId === 'permissions'"
      class="joc-pkg-icon__svg"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M24 8l14 6v9c0 9-6.5 15.5-14 17-7.5-1.5-14-8-14-17v-9l14-6z"
        stroke="currentColor"
        stroke-width="2"
        stroke-linejoin="round"
      />
      <path
        class="joc-pkg-icon__check"
        d="M18 24l4.5 4.5L31 20"
        stroke="currentColor"
        stroke-width="2.2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>

    <!-- Fallback -->
    <svg
      v-else
      class="joc-pkg-icon__svg"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="10" y="10" width="28" height="28" rx="6" stroke="currentColor" stroke-width="2" />
      <circle cx="24" cy="24" r="5" fill="currentColor" opacity="0.4" />
    </svg>
  </span>
</template>
