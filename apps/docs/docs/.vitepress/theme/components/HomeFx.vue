<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";

const enabled = ref(false);
const hovering = ref(false);
const lightCursor = ref(false);
const cursorX = ref(-100);
const cursorY = ref(-100);
const ringX = ref(-100);
const ringY = ref(-100);

let frame = 0;
let targetX = -100;
let targetY = -100;
let currentRingX = -100;
let currentRingY = -100;

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function isFinePointer(): boolean {
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}

function updateCursorState(target: Element | null): void {
  if (!target) {
    hovering.value = false;
    lightCursor.value = false;
    return;
  }

  hovering.value = Boolean(
    target.closest(
      "a, button, .VPFeature .box, .joc-scenario-card, .joc-package-card, .joc-cta-primary, .joc-cta-secondary, .VPButton, .sponsor-group",
    ),
  );

  lightCursor.value = Boolean(target.closest(".joc-dark-band, .joc-cta-band"));
}

function onPointerMove(event: PointerEvent): void {
  targetX = event.clientX;
  targetY = event.clientY;
  cursorX.value = targetX;
  cursorY.value = targetY;

  const target = event.target;
  updateCursorState(target instanceof Element ? target : null);
}

function onPointerOver(event: PointerEvent): void {
  const target = event.target;
  updateCursorState(target instanceof Element ? target : null);
}

function tick(): void {
  currentRingX += (targetX - currentRingX) * 0.14;
  currentRingY += (targetY - currentRingY) * 0.14;
  ringX.value = currentRingX;
  ringY.value = currentRingY;
  frame = window.requestAnimationFrame(tick);
}

let heroOrbit: HTMLElement | null = null;

function mountHeroOrbit(): void {
  const host = document.querySelector<HTMLElement>(".VPHomeHero .image-container");
  if (!host || host.querySelector(".joc-hero-orbit")) {
    return;
  }

  const orbit = document.createElement("div");
  orbit.className = "joc-hero-orbit";
  orbit.setAttribute("aria-hidden", "true");
  orbit.innerHTML = `
    <span class="joc-hero-orbit__ring joc-hero-orbit__ring--1"></span>
    <span class="joc-hero-orbit__ring joc-hero-orbit__ring--2"></span>
    <span class="joc-hero-orbit__ring joc-hero-orbit__ring--3"></span>
    <span class="joc-hero-orbit__path joc-hero-orbit__path--1">
      <span class="joc-hero-orbit__planet joc-hero-orbit__planet--a"></span>
    </span>
    <span class="joc-hero-orbit__path joc-hero-orbit__path--2">
      <span class="joc-hero-orbit__planet joc-hero-orbit__planet--b"></span>
    </span>
    <span class="joc-hero-orbit__path joc-hero-orbit__path--3">
      <span class="joc-hero-orbit__planet joc-hero-orbit__planet--c"></span>
    </span>
  `;
  host.appendChild(orbit);
  heroOrbit = orbit;
}

onMounted(() => {
  mountHeroOrbit();

  if (prefersReducedMotion() || !isFinePointer()) {
    return;
  }

  enabled.value = true;
  document.documentElement.classList.add("joc-home-cursor-active");
  window.addEventListener("pointermove", onPointerMove, { passive: true });
  document.addEventListener("pointerover", onPointerOver, { passive: true });
  frame = window.requestAnimationFrame(tick);
});

onUnmounted(() => {
  heroOrbit?.remove();
  heroOrbit = null;
  document.documentElement.classList.remove("joc-home-cursor-active");
  window.removeEventListener("pointermove", onPointerMove);
  document.removeEventListener("pointerover", onPointerOver);
  window.cancelAnimationFrame(frame);
});
</script>

<template>
  <div class="joc-home-fx" aria-hidden="true">
    <div class="joc-home-fx__mesh" />
    <div class="joc-home-fx__grid" />
    <div class="joc-home-fx__scanlines" />
    <div class="joc-home-fx__noise" />
  </div>

  <Teleport to="body">
    <template v-if="enabled">
      <div
        class="joc-home-fx__cursor"
        :class="{ 'is-light': lightCursor }"
        :style="{ transform: `translate3d(${cursorX}px, ${cursorY}px, 0)` }"
      />
      <div
        class="joc-home-fx__cursor-ring"
        :class="{ 'is-hover': hovering, 'is-light': lightCursor }"
        :style="{ transform: `translate3d(${ringX}px, ${ringY}px, 0)` }"
      />
    </template>
  </Teleport>
</template>
