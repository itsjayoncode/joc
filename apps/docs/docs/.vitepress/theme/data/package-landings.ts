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
    headline: "One typed API for the browser session",
    description:
      "Visibility, focus, connectivity, idle, cross-tab, and session intelligence — without scattering document and window listeners across your app.",
    getStartedLink: "/packages/browser-lifecycle/overview",
    playgroundLink: "/playground/browser-lifecycle/",
    overviewLink: "/packages/browser-lifecycle/overview",
    highlights: [
      {
        title: "Unified session",
        detail:
          "One createBrowserLifecycle() replaces ad-hoc visibility, focus, and online handlers.",
      },
      {
        title: "Opt-in intelligence",
        detail:
          "Timeline, metrics, attention score, and reports — zero cost until you call a factory.",
      },
      {
        title: "Framework adapters",
        detail: "React, Vue, Svelte, Solid, and Angular packages wrap the same headless core.",
      },
      {
        title: "SSR-safe",
        detail: "Capability detection and client-only start keep Node and SSR environments calm.",
      },
    ],
    sampleTitle: "Stop wasting work when the tab is hidden",
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
  "form-intelligent": {
    id: "form-intelligent",
    name: "Form Intelligent",
    npmName: "@jayoncode/form-intelligent",
    accent: "amber",
    headline: "Headless forms with real workflow power",
    description:
      "Validation, submission, drafts, wizards, and rules — without owning your UI. Keep the markup; let the engine own the lifecycle.",
    getStartedLink: "/packages/form-intelligent/overview",
    playgroundLink: "/playground/form-intelligent/",
    overviewLink: "/packages/form-intelligent/overview",
    highlights: [
      {
        title: "Headless bind()",
        detail: "Wire any input layer — native HTML, React, or your own components.",
      },
      {
        title: "Workflow built in",
        detail: "Autosave, drafts, offline queue, and multi-step wizards as first-class APIs.",
      },
      {
        title: "when() rules",
        detail: "Show, hide, require, and populate fields from declarative conditions.",
      },
      {
        title: "Async-first submit",
        detail: "Loading, cancel, retry, and duplicate-submit guards without boilerplate.",
      },
    ],
    sampleTitle: "Conditional fields without useEffect",
    sampleCode: `import { createForm, when } from "@jayoncode/form-intelligent";

createForm({
  target: "#checkout",
  schema: {
    plan: { required: true },
    companyName: { minLength: 2 },
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
  },
  async onSubmit(values) {
    await api.checkout(values);
  },
});`,
  },
  "object-diff": {
    id: "object-diff",
    name: "Object Diff",
    npmName: "@jayoncode/object-diff",
    accent: "blue",
    headline: "Structured diffs and patches you can trust",
    description:
      "Deep comparison with typed change records, dirty checks, and RFC 6902-style patches — built for audit trails and optimistic UI.",
    getStartedLink: "/packages/object-diff/overview",
    playgroundLink: "/playground/object-diff/",
    overviewLink: "/packages/object-diff/overview",
    highlights: [
      {
        title: "Path-aware changes",
        detail: "Every change includes a clear path — user.name, items[2], and nested objects.",
      },
      {
        title: "hasChanges()",
        detail: "Fast dirty checks without paying for a full diff when you only need a boolean.",
      },
      {
        title: "Patch + apply",
        detail: "Generate and apply patch operations to sync clients and stores.",
      },
      {
        title: "Serialize",
        detail: "Export JSON, Markdown, or tables from the same diff for logs and reviews.",
      },
    ],
    sampleTitle: "Know exactly what changed — then patch it",
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
};

export function getPackageLanding(id: string): PackageLandingContent | undefined {
  return packageLandings[id];
}
