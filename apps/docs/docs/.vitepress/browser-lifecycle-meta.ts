import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../../..");

const pkg = JSON.parse(
  readFileSync(path.join(repoRoot, "packages/browser-lifecycle/package.json"), "utf8"),
) as { version: string };

export const browserLifecycleMeta = {
  version: pkg.version,
  versionLabel: `v${pkg.version}`,
  npmName: "@jayoncode/browser-lifecycle",
} as const;
