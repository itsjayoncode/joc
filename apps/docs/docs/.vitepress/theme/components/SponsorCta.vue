<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";

const props = withDefaults(
  defineProps<{
    /** Where the CTA is rendered. */
    placement?: "hero" | "nav";
    /** Set by VitePress when rendered inside the mobile nav screen. */
    screenMenu?: boolean;
  }>(),
  {
    placement: "hero",
    screenMenu: false,
  },
);

const root = ref<HTMLElement | null>(null);
const homeSlotSelector = ".joc-sponsor-slot";
let wrap: HTMLDivElement | null = null;

const isNav = computed(() => props.placement === "nav" || props.screenMenu);

onMounted(() => {
  if (props.placement !== "hero") {
    return;
  }

  const el = root.value;
  if (!el || typeof document === "undefined") {
    return;
  }

  const actions = el.closest(".VPHomeHero")?.querySelector(".actions");
  if (!(actions instanceof HTMLElement)) {
    return;
  }

  wrap = document.createElement("div");
  wrap.className = "action joc-sponsor-action";

  // After Get Started + Explore Packages so support stays tertiary
  const actionButtons = actions.querySelectorAll(".action:not(.joc-sponsor-action)");
  const lastAction = actionButtons[actionButtons.length - 1];
  if (lastAction) {
    lastAction.after(wrap);
  } else {
    actions.appendChild(wrap);
  }
  wrap.appendChild(el);
});

onBeforeUnmount(() => {
  if (props.placement !== "hero") {
    return;
  }

  const slot = document.querySelector(homeSlotSelector);
  if (slot && root.value) {
    slot.appendChild(root.value);
  }
  wrap?.remove();
  wrap = null;
});
</script>

<template>
  <a
    ref="root"
    class="sponsor-group"
    :class="{
      'sponsor-group--nav': isNav,
      'sponsor-group--screen': screenMenu,
    }"
    href="https://github.com/sponsors/jayoncoding"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Support the Project on GitHub Sponsors"
  >
    <span class="sponsor-plush" aria-hidden="true">
      <svg class="sponsor-plush-svg" viewBox="0 0 64 72" fill="none">
        <ellipse
          class="sponsor-plush-shadow"
          cx="32"
          cy="66"
          rx="16"
          ry="3.5"
          fill="currentColor"
          opacity="0.18"
        />
        <g class="sponsor-plush-body">
          <circle cx="16" cy="18" r="9" fill="#ff8fa3" />
          <circle cx="16" cy="18" r="5" fill="#ffd6de" />
          <circle cx="48" cy="18" r="9" fill="#ff8fa3" />
          <circle cx="48" cy="18" r="5" fill="#ffd6de" />
          <path
            fill="#ff4d6d"
            d="M32 58c-1.2 0-18-11.2-18-26.2C14 22.2 20.4 16 27 16c2.8 0 4.6 1.1 5 1.8.4-.7 2.2-1.8 5-1.8 6.6 0 13 6.2 13 15.8C50 46.8 33.2 58 32 58z"
          />
          <path
            fill="#ff8fa3"
            opacity=".55"
            d="M32 54c-1 0-14-9-14-21.2C18 24.6 22.8 20 27.6 20c2 0 3.4.8 4.4 1.6 1-.8 2.4-1.6 4.4-1.6 4.8 0 9.6 4.6 9.6 12.8C46 45 33 54 32 54z"
          />
          <ellipse
            cx="24"
            cy="30"
            rx="5"
            ry="7"
            fill="#fff"
            opacity=".3"
            transform="rotate(-18 24 30)"
          />
          <g class="sponsor-plush-eyes">
            <ellipse class="sponsor-plush-eye" cx="25.5" cy="34" rx="2.4" ry="2.8" fill="#3a2030" />
            <ellipse class="sponsor-plush-eye" cx="38.5" cy="34" rx="2.4" ry="2.8" fill="#3a2030" />
            <circle cx="26.3" cy="33.2" r=".7" fill="#fff" />
            <circle cx="39.3" cy="33.2" r=".7" fill="#fff" />
          </g>
          <ellipse cx="20" cy="39" rx="3.2" ry="1.8" fill="#ff2d55" opacity=".32" />
          <ellipse cx="44" cy="39" rx="3.2" ry="1.8" fill="#ff2d55" opacity=".32" />
          <path
            d="M28.5 41.5c1.4 1.6 3.2 2.4 3.5 2.4s2.1-.8 3.5-2.4"
            stroke="#3a2030"
            stroke-width="1.4"
            stroke-linecap="round"
            fill="none"
          />
          <g class="sponsor-plush-arm">
            <ellipse cx="11" cy="40" rx="5.5" ry="4" fill="#ff8fa3" transform="rotate(-28 11 40)" />
            <circle cx="7.5" cy="37.5" r="2.2" fill="#ffd6de" />
          </g>
          <ellipse cx="53" cy="42" rx="5.5" ry="4" fill="#ff8fa3" transform="rotate(24 53 42)" />
        </g>
      </svg>
    </span>

    <span class="sponsor-pill">
      <span class="sponsor-floaters" aria-hidden="true">
        <span class="sponsor-floater f1">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z"
            />
          </svg>
        </span>
        <span class="sponsor-floater f2">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z"
            />
          </svg>
        </span>
        <span class="sponsor-floater f3">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z"
            />
          </svg>
        </span>
        <span class="sponsor-spark s1"></span>
        <span class="sponsor-spark s2"></span>
        <span class="sponsor-spark s3"></span>
      </span>

      <span class="sponsor-chrome" aria-hidden="true">
        <span class="sponsor-sheen"></span>
        <span class="sponsor-pulse"></span>
      </span>

      <span class="sponsor-copy">
        <span class="sponsor-label">❤️ Support</span>
        <span class="sponsor-sub">the Project</span>
      </span>
    </span>
  </a>
</template>
