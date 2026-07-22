import type { JocPackageAccent } from "./joc-packages.js";

export interface PackageLandingHighlight {
  readonly title: string;
  readonly detail: string;
}

export interface PackageLandingContent {
  readonly id: string;
  readonly name: string;
  readonly npmName: string;
  readonly accent: JocPackageAccent;
  readonly headline: string;
  readonly description: string;
  readonly getStartedLink: string;
  readonly playgroundLink: string;
  readonly overviewLink: string;
  readonly highlights: readonly PackageLandingHighlight[];
  readonly sampleTitle: string;
  readonly sampleCode: string;
}

export const packageLandings: Record<string, PackageLandingContent> = {
  "browser-lifecycle": {
    id: "browser-lifecycle",
    name: "Browser Lifecycle",
    npmName: "@jayoncode/browser-lifecycle",
    accent: "cyan",
    headline: "Observe browser state. Derive session intelligence. React with confidence.",
    description:
      "One session, one snapshot, one event stream — visibility, focus, connectivity, idle, page lifecycle, and cross-tab, with optional session intelligence and DX.",
    getStartedLink: "/packages/browser-lifecycle/overview",
    playgroundLink: "/playground/browser-lifecycle/",
    overviewLink: "/packages/browser-lifecycle/overview",
    highlights: [
      {
        title: "Unified Browser Lifecycle",
        detail:
          "One typed session for visibility, focus, connectivity, idle, page lifecycle, and cross-tab — instead of scattered listeners.",
      },
      {
        title: "Session Intelligence",
        detail:
          "Opt-in activity and page-local presence — current derived state for this browser session.",
      },
      {
        title: "Timeline & Session Insights",
        detail:
          "Chronological history plus metrics and reports. Nothing allocates until you call the factories.",
      },
      {
        title: "Developer Experience",
        detail:
          "Wait, Conditions, Resilience, plugins, and a playground — react with confidence.",
      },
    ],
    sampleTitle: "Pause work when the tab is hidden",
    sampleCode: `import { createBrowserLifecycle } from "@jayoncode/browser-lifecycle";

const lifecycle = createBrowserLifecycle({
  autoStart: true,
  idleTimeout: 60_000,
});

lifecycle.on("page:hidden", () => {
  pausePolling();
  pauseMedia();
});

lifecycle.on("page:visible", () => {
  resumePolling();
});

lifecycle.on("session:idle", () => {
  lockSensitiveScreen();
});

lifecycle.on("connection:reconnect", () => {
  flushOfflineQueue();
});`,
  },
  "form-intelligence": {
    id: "form-intelligence",
    name: "Form Intelligence",
    npmName: "@jayoncode/form-intelligence",
    accent: "amber",
    headline: "Forms that show, save, and submit — without effect spaghetti",
    description:
      "Validation, show/hide rules, draft restore, and safe submit in one createForm(). Your UI binds to state; the library owns the workflow.",
    getStartedLink: "/packages/form-intelligence/overview",
    playgroundLink: "/playground/form-intelligence/",
    overviewLink: "/packages/form-intelligence/overview",
    highlights: [
      {
        title: "when() instead of useEffect",
        detail: "Plan is enterprise? Show seats, require company, gate submit — declare it once.",
      },
      {
        title: "Drafts that survive refresh",
        detail: "Autosave and restore so long checkouts don’t disappear when the tab reloads.",
      },
      {
        title: "Submit without double-clicks",
        detail:
          "Built-in submitting state, duplicate-submit guard, cancel, and optional offline queue.",
      },
      {
        title: "Keep your markup",
        detail:
          "Enhance a normal <form>, or bind() into React / Vue / your own inputs — same engine.",
      },
    ],
    sampleTitle: "Checkout: show fields when needed + keep a draft",
    sampleCode: `import { createForm, when } from "@jayoncode/form-intelligence";

// Pain: enterprise fields, autosave, and submit guards
// usually mean 4 effects and a race on every keystroke.

createForm({
  target: "#checkout",
  schema: {
    plan: { required: true },
    seatCount: { required: true },
    companyName: { minLength: 2 },
    email: "email",
  },
  rules: [
    when("plan")
      .equals("enterprise")
      .show("seatCount", "companyName")
      .require("seatCount", "companyName"),
  ],
  workflow: {
    autosave: {
      enabled: true,
      debounceMs: 800,
      onSave: (values) => api.saveDraft(values),
    },
    draft: {
      enabled: true,
      storageKey: "checkout:draft",
    },
  },
  // Same store as form.subscribe() — fires once after create, then on every notify
  subscribe: (form) => {
    syncCheckoutChrome(form.state); // draft badge, plan label, …
  },
  async onSubmit(values) {
    await api.checkout(values); // isSubmitting + double-submit guard built in
  },
});`,
  },
  "object-diff": {
    id: "object-diff",
    name: "Object Diff",
    npmName: "@jayoncode/object-diff",
    accent: "blue",
    headline: "See what changed in an object — then sync it",
    description:
      "Compare two values, get a clear list of changes (with paths), check “anything dirty?”, and build patches you can apply or log.",
    getStartedLink: "/packages/object-diff/overview",
    playgroundLink: "/playground/object-diff/",
    overviewLink: "/packages/object-diff/overview",
    highlights: [
      {
        title: "Changes with paths",
        detail: "Every change points to where it happened — user.name, items[2], nested objects.",
      },
      {
        title: "hasChanges()",
        detail: "Quick yes/no dirty check when you don’t need the full diff yet.",
      },
      {
        title: "Patch + apply",
        detail: "Turn changes into patch ops and apply them to keep clients or stores in sync.",
      },
      {
        title: "Export for humans",
        detail: "Same diff → JSON, Markdown, or tables for logs and reviews.",
      },
    ],
    sampleTitle: "Spot the edit — log it — apply the patch",
    sampleCode: `import {
  diff,
  hasChanges,
  patch,
  applyPatch,
  serialize,
} from "@jayoncode/object-diff";

const saved = {
  profile: { name: "Ada", role: "admin" },
  prefs: { theme: "dark" },
};
const draft = {
  profile: { name: "Ada Lovelace", role: "admin" },
  prefs: { theme: "dark" },
};

if (hasChanges(saved, draft)) {
  const changes = diff(saved, draft);
  await audit.log(serialize(changes, "markdown"));
  const synced = applyPatch(saved, patch(changes));
}`,
  },
  storage: {
    id: "storage",
    name: "Storage",
    npmName: "@jayoncode/storage",
    accent: "emerald",
    headline: "Save app data in the browser — without the usual glue",
    description:
      "Pick where values live (memory, localStorage, or sessionStorage), keep keys under a clear name, and optionally add expiry or upgrades when your data shape changes.",
    getStartedLink: "/packages/storage/overview",
    playgroundLink: "/playground/storage/",
    overviewLink: "/packages/storage/overview",
    highlights: [
      {
        title: "createStorage()",
        detail: "One place to set a namespace, choose a backend, and save or load values.",
      },
      {
        title: "You choose the backend",
        detail:
          "Memory for tests, localStorage to survive reload, sessionStorage for the tab — no surprise picks.",
      },
      {
        title: "See what’s stored",
        detail: "peek() shows when something was saved, when it expires, and which version it is.",
      },
      {
        title: "Extra tools when you need them",
        detail:
          "Cleanup, backup, watchers, diagnostics, and transactions live on separate imports.",
      },
    ],
    sampleTitle: "Theme prefs that last — cache that doesn’t",
    sampleCode: `import { createStorage, createLocalStorageAdapter } from "@jayoncode/storage";

const storage = createStorage({
  namespace: "app",
  adapter: createLocalStorageAdapter(),
  policies: {
    preferences: { ttl: { days: 365 } },
    cache: { ttl: { minutes: 15 } },
  },
});

storage.set("theme", "dark", { policy: "preferences" });
storage.get("theme"); // "dark" | null
storage.peek("theme"); // envelope with expiresAt`,
  },
};

export function getPackageLanding(id: string): PackageLandingContent | undefined {
  return packageLandings[id];
}
