import { existsSync } from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");

const run = (command, args) =>
  spawnSync(command, args, {
    cwd: rootDir,
    stdio: "pipe",
    encoding: "utf8",
  });

const gitDirExists = existsSync(path.join(rootDir, ".git"));
const gitRepoCheck = gitDirExists ? run("git", ["rev-parse", "--is-inside-work-tree"]) : null;
const hasGitRepo = gitRepoCheck?.status === 0 && gitRepoCheck.stdout.includes("true");

let hasMainRef = false;

if (hasGitRepo) {
  const localMain = run("git", ["show-ref", "--verify", "--quiet", "refs/heads/main"]);
  const remoteMain = run("git", ["show-ref", "--verify", "--quiet", "refs/remotes/origin/main"]);

  hasMainRef = localMain.status === 0 || remoteMain.status === 0;
}

if (!hasGitRepo || !hasMainRef) {
  console.log("Changesets configuration is installed and ready.");
  console.log("Detailed changeset status requires a git repository with a main branch reference.");
  console.log("Run `pnpm release:readiness` for structural validation in non-git environments.");
  process.exit(0);
}

const result = spawnSync("changeset", ["status", "--verbose"], {
  cwd: rootDir,
  stdio: "inherit",
  shell: true,
});

process.exit(result.status ?? 1);
