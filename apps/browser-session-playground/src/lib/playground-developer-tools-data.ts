export const MODULE_LIFECYCLE_MODULES = [
  {
    events: ["session:started", "session:stopped"],
    id: "session-core",
    label: "Session Core",
  },
  {
    events: ["page:visible", "page:hidden"],
    id: "visibility",
    label: "Visibility",
  },
  {
    events: ["window:focus", "window:blur"],
    id: "focus",
    label: "Focus",
  },
  {
    events: ["connection:online", "connection:offline", "connection:reconnect"],
    id: "connectivity",
    label: "Connectivity",
  },
  {
    events: ["session:active", "session:idle", "activity:detected", "activity:reset"],
    id: "idle",
    label: "Idle",
  },
  {
    events: ["page:suspend", "page:resume", "session:restored"],
    id: "lifecycle",
    label: "Lifecycle",
  },
  {
    events: ["tab:primary", "tab:secondary", "tab:message"],
    id: "cross-tab",
    label: "Cross Tab",
  },
  {
    events: ["plugin:registered", "plugin:removed", "plugin:error"],
    id: "plugins",
    label: "Plugins",
  },
] as const;

export const FRAMEWORK_EXAMPLES = [
  {
    description: "Framework-agnostic TypeScript bootstrap with lifecycle cleanup.",
    id: "vanilla",
    path: "examples/vanilla",
    title: "Vanilla TypeScript",
  },
  {
    description: "React provider and hooks with StrictMode-safe cleanup.",
    id: "react",
    path: "examples/react",
    title: "React",
  },
  {
    description: "Vue 3 composables with script setup patterns.",
    id: "vue",
    path: "examples/vue",
    title: "Vue",
  },
  {
    description: "Angular standalone service with DestroyRef cleanup.",
    id: "angular",
    path: "examples/angular",
    title: "Angular",
  },
  {
    description: "Svelte stores and onDestroy cleanup.",
    id: "svelte",
    path: "examples/svelte",
    title: "Svelte",
  },
  {
    description: "Next.js App Router client component initialization.",
    id: "nextjs",
    path: "examples/nextjs",
    title: "Next.js",
  },
  {
    description: "Electron renderer process lifecycle integration.",
    id: "electron",
    path: "examples/electron",
    title: "Electron",
  },
  {
    description: "Offline-first PWA connectivity and visibility patterns.",
    id: "pwa",
    path: "examples/pwa",
    title: "PWA",
  },
] as const;
