const lines = [
  "Publishing is intentionally disabled in Phase 1.5.",
  "This repository is prepared for future npm publication, but no packages are published automatically yet.",
  "",
  "Before real publication, maintainers should confirm:",
  "- NPM_TOKEN is configured in repository secrets",
  "- the npm organization or scope is ready",
  "- package metadata and changelogs have been reviewed",
  "- GitHub draft releases are accurate",
  "",
  "See engineering/007-release-engineering.md for the full release process.",
];

for (const line of lines) {
  console.log(line);
}
