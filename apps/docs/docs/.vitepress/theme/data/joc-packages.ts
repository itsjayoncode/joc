export type JocPackageStatus = "live" | "internal";

export type JocPackageAccent = "cyan" | "violet" | "blue" | "amber" | "emerald";

export interface JocPackage {
  id: string;
  name: string;
  npmName: string;
  tagline: string;
  purpose: string;
  problem: string;
  status: JocPackageStatus;
  /** Short label for comparison tables */
  statusLabel: string;
  docsLink: string;
  accent: JocPackageAccent;
  icon: string;
  /** Capability chips for package showcase */
  capabilities: string[];
  /** Featured on the homepage ecosystem grid */
  featured: boolean;
  versionLabel?: string;
}

export const jocPackages: JocPackage[] = [
  {
    id: "browser-lifecycle",
    name: "Browser Lifecycle",
    npmName: "@jayoncode/browser-lifecycle",
    tagline:
      "Know when the tab is hidden, idle, offline, or back — one API, not scattered listeners.",
    purpose: "Tab & session signals",
    problem: "Visibility, idle, and online checks end up as one-off listeners in every app",
    status: "live",
    statusLabel: "Released",
    docsLink: "/packages/browser-lifecycle/",
    accent: "cyan",
    icon: "◎",
    capabilities: ["Visibility", "Focus", "Idle", "Cross-tab", "Lifecycle"],
    featured: true,
    versionLabel: "v0.3.0",
  },
  {
    id: "form-intelligence",
    name: "Form Intelligence",
    npmName: "@jayoncode/form-intelligence",
    tagline:
      "Show/hide fields, keep drafts, and submit safely — without rebuilding form logic each time.",
    purpose: "Form workflows",
    problem: "Conditional fields, drafts, and submit races turn into effect spaghetti in every app",
    status: "live",
    statusLabel: "Released",
    docsLink: "/packages/form-intelligence/",
    accent: "amber",
    icon: "▤",
    capabilities: ["Validation", "Workflow", "Wizard", "Autosave", "Offline"],
    featured: true,
    versionLabel: "v3.3.1",
  },
  {
    id: "object-diff",
    name: "Object Diff",
    npmName: "@jayoncode/object-diff",
    tagline: "Compare two objects, see what changed, and build patches you can apply or log.",
    purpose: "What changed?",
    problem: "Hand-rolled deep compares and patches are easy to get wrong",
    status: "live",
    statusLabel: "Released",
    docsLink: "/packages/object-diff/",
    accent: "blue",
    icon: "≠",
    capabilities: ["Diff", "Patch", "Serialize", "Snapshots"],
    featured: true,
    versionLabel: "v0.3.0",
  },
  {
    id: "storage",
    name: "Storage",
    npmName: "@jayoncode/storage",
    tagline: "Save prefs and cache in the browser — with names, expiry, and clear backends.",
    purpose: "Save in the browser",
    problem: "Apps re-build namespaced keys, expiry, and upgrades on top of Web Storage",
    status: "live",
    statusLabel: "Released",
    docsLink: "/packages/storage/",
    accent: "emerald",
    icon: "▣",
    capabilities: ["Adapters", "TTL", "Snapshots", "Transactions"],
    featured: true,
    versionLabel: "v0.1.0",
  },
];

export const featuredPackages = jocPackages.filter((pkg) => pkg.featured);
export const livePackages = jocPackages.filter((pkg) => pkg.status === "live");
export const livePackageCount = livePackages.length;
