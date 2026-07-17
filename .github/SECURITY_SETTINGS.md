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

- Disable auto-merge until release automation exists
- Require conversations to be resolved before merge
- Restrict direct pushes to the default branch

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

On each package (e.g. `@jayoncode/form-intelligent`) → **Settings** → **Trusted Publisher**:

| Field                | Value          |
| -------------------- | -------------- |
| Provider             | GitHub Actions |
| Organization or user | `itsjayoncode` |
| Repository           | `joc`          |
| Workflow filename    | `ci.yml`       |

CI already requests `id-token: write` for the version/publish job.
