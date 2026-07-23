<script setup lang="ts">
const DRAFT_DESK_URL = "https://jayoncode.com/draft-desk";

const packages = ["Browser Lifecycle", "Storage", "Form Intelligence", "Object Diff"] as const;
</script>

<template>
  <a
    class="joc-draft-desk-callout"
    :href="DRAFT_DESK_URL"
    target="_blank"
    rel="noopener noreferrer"
  >
    <span class="joc-draft-desk-callout__glow" aria-hidden="true" />
    <span class="joc-draft-desk-callout__sheen" aria-hidden="true" />

    <span class="joc-draft-desk-callout__badge">
      <span class="joc-draft-desk-callout__pulse" aria-hidden="true" />
      Official reference app
    </span>

    <span class="joc-draft-desk-callout__title">Draft Desk</span>
    <span class="joc-draft-desk-callout__body">
      See the four JOC packages working together in one resilient form experience.
    </span>

    <span class="joc-draft-desk-callout__chips" aria-hidden="true">
      <span v-for="name in packages" :key="name" class="joc-draft-desk-callout__chip">
        {{ name }}
      </span>
    </span>

    <span class="joc-draft-desk-callout__cta">
      <span class="joc-draft-desk-callout__cta-label">Launch Draft Desk</span>
      <span class="joc-draft-desk-callout__cta-arrow" aria-hidden="true">→</span>
    </span>
  </a>
</template>

<style scoped>
.joc-draft-desk-callout {
  --dd-brand: var(--joc-primary, var(--vp-c-brand-1));
  --dd-brand-deep: var(--joc-secondary, var(--vp-c-brand-2, var(--vp-c-brand-1)));
  --dd-ink: var(--joc-text, var(--vp-c-text-1));
  --dd-muted: var(--joc-muted, var(--vp-c-text-2));

  position: relative;
  isolation: isolate;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.55rem;
  width: 100%;
  max-width: 36rem;
  margin-top: 1.35rem;
  padding: 1.25rem 1.3rem 1.3rem;
  overflow: hidden;
  border-radius: 1.25rem;
  border: 1px solid color-mix(in srgb, var(--dd-brand) 32%, transparent);
  background:
    radial-gradient(ellipse 80% 70% at 12% 0%, rgba(45, 168, 255, 0.22), transparent 55%),
    radial-gradient(ellipse 70% 60% at 100% 100%, rgba(27, 109, 255, 0.16), transparent 50%),
    linear-gradient(165deg, #f8fbff 0%, #eef5fc 48%, #f5f8fc 100%);
  box-shadow:
    0 12px 32px rgba(10, 31, 68, 0.1),
    0 0 0 1px rgba(45, 168, 255, 0.06),
    inset 0 1px 0 rgba(255, 255, 255, 0.75);
  text-decoration: none;
  text-align: center;
  color: inherit;
  transition:
    transform 0.28s cubic-bezier(0.22, 1, 0.36, 1),
    border-color 0.28s ease,
    box-shadow 0.28s ease;
}

html.dark .joc-draft-desk-callout {
  border-color: color-mix(in srgb, var(--dd-brand) 40%, transparent);
  background:
    radial-gradient(ellipse 80% 70% at 12% 0%, rgba(45, 168, 255, 0.2), transparent 55%),
    radial-gradient(ellipse 70% 60% at 100% 100%, rgba(27, 109, 255, 0.18), transparent 50%),
    linear-gradient(165deg, #0a1628 0%, #0c1c36 50%, #081426 100%);
  box-shadow:
    0 14px 36px rgba(0, 0, 0, 0.35),
    0 0 0 1px rgba(45, 168, 255, 0.12),
    inset 0 1px 0 rgba(255, 255, 255, 0.06);
}

.joc-draft-desk-callout__glow {
  position: absolute;
  inset: -40% -20% auto;
  height: 70%;
  z-index: 0;
  background: radial-gradient(circle at 50% 40%, rgba(45, 168, 255, 0.28), transparent 62%);
  opacity: 0.7;
  pointer-events: none;
  transition: opacity 0.35s ease;
}

.joc-draft-desk-callout__sheen {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background: linear-gradient(
    115deg,
    transparent 35%,
    rgba(255, 255, 255, 0.35) 48%,
    transparent 62%
  );
  transform: translateX(-120%);
  opacity: 0;
}

.joc-draft-desk-callout:hover,
.joc-draft-desk-callout:focus-visible {
  transform: translateY(-3px) scale(1.01);
  border-color: color-mix(in srgb, var(--dd-brand) 60%, transparent);
  box-shadow:
    0 18px 40px rgba(27, 109, 255, 0.18),
    0 0 0 1px rgba(45, 168, 255, 0.16),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
}

.joc-draft-desk-callout:hover .joc-draft-desk-callout__glow,
.joc-draft-desk-callout:focus-visible .joc-draft-desk-callout__glow {
  opacity: 1;
}

.joc-draft-desk-callout:hover .joc-draft-desk-callout__sheen,
.joc-draft-desk-callout:focus-visible .joc-draft-desk-callout__sheen {
  opacity: 1;
  animation: joc-dd-sheen 0.85s ease forwards;
}

.joc-draft-desk-callout:focus-visible {
  outline: 2px solid var(--dd-brand);
  outline-offset: 3px;
}

.joc-draft-desk-callout__badge,
.joc-draft-desk-callout__title,
.joc-draft-desk-callout__body,
.joc-draft-desk-callout__chips,
.joc-draft-desk-callout__cta {
  position: relative;
  z-index: 1;
}

.joc-draft-desk-callout__badge {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.28rem 0.7rem;
  border-radius: 999px;
  border: 1px solid color-mix(in srgb, var(--dd-brand) 28%, transparent);
  background: color-mix(in srgb, var(--dd-brand) 10%, transparent);
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--dd-brand-deep);
}

html.dark .joc-draft-desk-callout__badge {
  color: #7dd3fc;
  background: rgba(45, 168, 255, 0.12);
}

.joc-draft-desk-callout__pulse {
  width: 0.45rem;
  height: 0.45rem;
  border-radius: 999px;
  background: var(--dd-brand);
  box-shadow: 0 0 0 0 rgba(45, 168, 255, 0.55);
  animation: joc-dd-pulse 1.8s ease-out infinite;
}

.joc-draft-desk-callout__title {
  font-size: 1.35rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.15;
  background: linear-gradient(135deg, var(--dd-ink) 20%, var(--dd-brand-deep) 120%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

html.dark .joc-draft-desk-callout__title {
  background: linear-gradient(135deg, #f8fbff 10%, #7dd3fc 90%);
  -webkit-background-clip: text;
  background-clip: text;
}

.joc-draft-desk-callout__body {
  max-width: 28ch;
  font-size: 0.9rem;
  line-height: 1.55;
  color: var(--dd-muted);
}

.joc-draft-desk-callout__chips {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.35rem;
  margin-top: 0.15rem;
}

.joc-draft-desk-callout__chip {
  padding: 0.22rem 0.55rem;
  border-radius: 999px;
  border: 1px solid color-mix(in srgb, var(--dd-brand) 18%, transparent);
  background: color-mix(in srgb, #fff 70%, transparent);
  font-size: 0.65rem;
  font-weight: 650;
  letter-spacing: 0.01em;
  color: var(--dd-ink);
  transition:
    transform 0.2s ease,
    border-color 0.2s ease,
    background 0.2s ease;
}

html.dark .joc-draft-desk-callout__chip {
  background: rgba(255, 255, 255, 0.06);
  color: #dbeafe;
  border-color: rgba(45, 168, 255, 0.22);
}

.joc-draft-desk-callout:hover .joc-draft-desk-callout__chip {
  border-color: color-mix(in srgb, var(--dd-brand) 40%, transparent);
  transform: translateY(-1px);
}

.joc-draft-desk-callout__cta {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  margin-top: 0.45rem;
  padding: 0.55rem 1rem;
  border-radius: 999px;
  background: linear-gradient(135deg, #2da8ff, #1b6dff);
  color: #fff;
  font-size: 0.9rem;
  font-weight: 700;
  box-shadow: 0 8px 20px rgba(27, 109, 255, 0.28);
  transition:
    gap 0.25s ease,
    box-shadow 0.25s ease,
    filter 0.25s ease;
}

.joc-draft-desk-callout:hover .joc-draft-desk-callout__cta,
.joc-draft-desk-callout:focus-visible .joc-draft-desk-callout__cta {
  gap: 0.7rem;
  filter: brightness(1.05);
  box-shadow: 0 10px 24px rgba(27, 109, 255, 0.38);
}

.joc-draft-desk-callout__cta-arrow {
  display: inline-block;
  transition: transform 0.25s ease;
}

.joc-draft-desk-callout:hover .joc-draft-desk-callout__cta-arrow,
.joc-draft-desk-callout:focus-visible .joc-draft-desk-callout__cta-arrow {
  transform: translateX(3px);
}

@keyframes joc-dd-pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(45, 168, 255, 0.55);
  }
  70% {
    box-shadow: 0 0 0 8px rgba(45, 168, 255, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(45, 168, 255, 0);
  }
}

@keyframes joc-dd-sheen {
  from {
    transform: translateX(-120%);
  }
  to {
    transform: translateX(120%);
  }
}

@media (min-width: 960px) {
  .joc-draft-desk-callout {
    max-width: 30rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .joc-draft-desk-callout,
  .joc-draft-desk-callout:hover,
  .joc-draft-desk-callout:focus-visible,
  .joc-draft-desk-callout__chip,
  .joc-draft-desk-callout__cta,
  .joc-draft-desk-callout__cta-arrow {
    transition: none;
    transform: none;
    animation: none;
  }

  .joc-draft-desk-callout__pulse,
  .joc-draft-desk-callout__sheen {
    animation: none !important;
  }

  .joc-draft-desk-callout:hover .joc-draft-desk-callout__sheen,
  .joc-draft-desk-callout:focus-visible .joc-draft-desk-callout__sheen {
    opacity: 0;
  }
}
</style>
