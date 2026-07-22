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
        detail: "Wait, Conditions, Resilience, plugins, and a playground — react with confidence.",
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
    headline: "Declare the workflow. Keep the markup. Submit with confidence.",
    description:
      "Headless form engine — validation, when() rules, drafts, wizards, and safe submit in one createForm(). Your UI binds to state; the library owns the workflow.",
    getStartedLink: "/packages/form-intelligence/overview",
    playgroundLink: "/playground/form-intelligence/",
    overviewLink: "/packages/form-intelligence/overview",
    highlights: [
      {
        title: "Validation",
        detail: "Modes and schema adapters — you choose when fields validate.",
      },
      {
        title: "Rules (when())",
        detail: "Show / hide / require without scattered useEffect copies.",
      },
      {
        title: "Drafts & autosave",
        detail: "Survive refresh; debounce saves you own.",
      },
      {
        title: "Submit safety",
        detail:
          "Built-in submitting state, duplicate-submit guard, cancel, and optional offline queue — not a payment SDK.",
      },
      {
        title: "Keep your markup",
        detail:
          "Enhance a normal <form>, or bind() into React / Vue / your own inputs — same engine, not a form builder.",
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
    headline: "Stop guessing what changed. Get paths, patches, and review-ready output.",
    description:
      "Typed deep comparison with path-aware records, fast dirty checks, DiffView explain, RFC 6902 patches, and optional snapshot merge — not a CRDT runtime.",
    getStartedLink: "/packages/object-diff/overview",
    playgroundLink: "/playground/object-diff/",
    overviewLink: "/packages/object-diff/overview",
    highlights: [
      {
        title: "Typed deep diff",
        detail:
          "Path-aware records for objects, arrays, Dates, Maps, and Sets — plus ignore / include.",
      },
      {
        title: "Intuitive moves & dirty checks",
        detail:
          "detectMoves for reorders; hasChanges for cheap dirty flags without a full DiffResult.",
      },
      {
        title: "DiffView toolbox",
        detail:
          "createDiffView(result).explain() turns moves and edits into review-ready structured or human text.",
      },
      {
        title: "RFC 6902 patches",
        detail:
          "Generate, validate, apply, and inverse patches for optimistic UI and audit trails.",
      },
      {
        title: "Snapshot merge",
        detail:
          "Optional /merge with identity-aware lists and structured conflicts — not live collab.",
      },
    ],
    sampleTitle: "Spot the edit — explain it — apply the patch",
    sampleCode: `import { diff, hasChanges, patch, applyPatch } from "@jayoncode/object-diff";
import { createDiffView } from "@jayoncode/object-diff/view";

const saved = {
  profile: { name: "Ada", role: "admin" },
  prefs: { theme: "dark" },
};
const draft = {
  profile: { name: "Ada Lovelace", role: "admin" },
  prefs: { theme: "dark" },
};

if (hasChanges(saved, draft)) {
  const view = createDiffView(diff(saved, draft));
  await audit.log(view.explain({ format: "human" }));
  const synced = applyPatch(saved, view.patch());
}`,
  },
  storage: {
    id: "storage",
    name: "Storage",
    npmName: "@jayoncode/storage",
    accent: "emerald",
    headline: "Namespace it. Expire it. Upgrade it — without localStorage glue.",
    description:
      "A small policy layer for browser persistence — namespaces, envelopes, TTL, migrations — on adapters you choose: memory, localStorage, sessionStorage, and IndexedDB.",
    getStartedLink: "/packages/storage/overview",
    playgroundLink: "/playground/storage/",
    overviewLink: "/packages/storage/overview",
    highlights: [
      {
        title: "createStorage()",
        detail: "Namespace + adapter + optional TTL / schema version in one place.",
      },
      {
        title: "Explicit adapters",
        detail:
          "Memory · localStorage · sessionStorage · IndexedDB — the library never auto-picks a backend.",
      },
      {
        title: "Peek & TTL",
        detail: "peek() shows when something was saved, when it expires, and which version it is.",
      },
      {
        title: "Migrations",
        detail: "Schema upgrades without ad-hoc key rewrites across releases.",
      },
      {
        title: "Extra tools (opt-in)",
        detail:
          "Soft quota, transforms hooks, cleanup, backup, and watchers — only when you import them.",
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
