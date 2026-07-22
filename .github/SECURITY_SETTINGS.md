# Recommended Repository Security Settings

To prepare JOC for public collaboration, enable the following repository settings in GitHub:

## Security Features

- Dependabot alerts
- Dependabot security updates
- Secret scanning
- Push protection for secrets
- Code scanning with CodeQL

## Branch Protection

- Require pull request approval before merge
- Require status checks for CI, pull-request validation, and CodeQL
- Block force pushes to protected branches
- Require branches to be up to date before merge

## Collaboration Defaults

- Auto-merge remains off by default; only the Changesets Version Packages PR is **auto-approved** (see below)
- Require conversations to be resolved before merge
- Restrict direct pushes to the default branch

## Auto-approve: `chore(release): version packages`

Workflow: [`.github/workflows/auto-approve-release-pr.yml`](./workflows/auto-approve-release-pr.yml).

GitHub does **not** allow `GITHUB_TOKEN` / `github-actions[bot]` to approve a PR it opened (the Changesets version PR from CI). Add a second identity:

1. Create a **fine-grained PAT** (or classic) from a maintainer account with **Pull requests: Read and write** on `itsjayoncode/joc`
2. Repo → **Settings → Secrets and variables → Actions** → New secret  
   Name: `RELEASE_APPROVE_TOKEN`  
   Value: that PAT
3. Optional: ensure the PAT owner is allowed to approve under branch protection (not blocked by “dismiss stale reviews” / CODEOWNERS-only rules you do not want)

Pull Request Validation and CodeQL still run on the PR normally. This workflow only submits an approving review so you do not have to press Approve by hand. It does **not** merge the PR.

## Release Secrets / npm publish from CI

There is **no “Automation” token** anymore (classic tokens were revoked). Use one of these:

### Option A — Granular access token (fastest fix for `EOTP`)

1. npmjs.com → profile → **Access Tokens** → **Generate New Token** → **Granular Access Token**
2. Permissions: **Read and write**
3. Packages: **All packages** (or add `@jayoncode` scope / each package including `form-intelligent`)
4. **Check “Bypass two-factor authentication”** ← this is what removes `EOTP` in CI
5. Set expiration (write tokens are time-limited)
6. Paste into GitHub → Settings → Secrets → `NPM_TOKEN`

### Option B — Trusted Publishing (recommended, no long-lived publish token)

On each package (e.g. `@jayoncode/form-intelligence`) → **Settings** → **Trusted Publisher**:

| Field                | Value          |
| -------------------- | -------------- |
| Provider             | GitHub Actions |
| Organization or user | `itsjayoncode` |
| Repository           | `joc`          |
| Workflow filename    | `ci.yml`       |

CI already requests `id-token: write` for the version/publish job.
