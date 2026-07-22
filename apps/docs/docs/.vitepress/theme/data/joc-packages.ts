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
    tagline: "Observe browser state. Derive session intelligence. React with confidence.",
    purpose: "Tab & session signals",
    problem: "Visibility, idle, and online checks end up as one-off listeners in every app",
    status: "live",
    statusLabel: "Released",
    docsLink: "/packages/browser-lifecycle/",
    accent: "cyan",
    icon: "◎",
    capabilities: ["Observe", "Understand", "React", "Timeline", "Insights"],
    featured: true,
    versionLabel: "v0.3.2",
  },
  {
    id: "form-intelligence",
    name: "Form Intelligence",
    npmName: "@jayoncode/form-intelligence",
    tagline: "Declare the workflow. Keep the markup. Submit with confidence.",
    purpose: "Form workflows",
    problem: "Conditional fields, drafts, and submit races turn into effect spaghetti in every app",
    status: "live",
    statusLabel: "Released",
    docsLink: "/packages/form-intelligence/",
    accent: "amber",
    icon: "▤",
    capabilities: ["Declare", "Orchestrate", "Submit", "Rules", "Drafts"],
    featured: true,
    versionLabel: "v3.9.1",
  },
  {
    id: "object-diff",
    name: "Object Diff",
    npmName: "@jayoncode/object-diff",
    tagline: "Stop guessing what changed. Get paths, patches, and review-ready output.",
    purpose: "What changed?",
    problem: "Hand-rolled deep compares and patches are easy to get wrong",
    status: "live",
    statusLabel: "Released",
    docsLink: "/packages/object-diff/",
    accent: "blue",
    icon: "≠",
    capabilities: ["Compare", "Review", "Patch", "Merge", "DiffView"],
    featured: true,
    versionLabel: "v0.3.3",
  },
  {
    id: "storage",
    name: "Storage",
    npmName: "@jayoncode/storage",
    tagline: "Namespace it. Expire it. Upgrade it — without localStorage glue.",
    purpose: "Save in the browser",
    problem: "Apps re-build namespaced keys, expiry, and upgrades on top of Web Storage",
    status: "live",
    statusLabel: "Released",
    docsLink: "/packages/storage/",
    accent: "emerald",
    icon: "▣",
    capabilities: ["Adapters", "TTL", "IndexedDB", "Quota", "Transforms"],
    featured: true,
    versionLabel: "v0.3.0",
  },
];

export const featuredPackages = jocPackages.filter((pkg) => pkg.featured);
export const livePackages = jocPackages.filter((pkg) => pkg.status === "live");
export const livePackageCount = livePackages.length;
