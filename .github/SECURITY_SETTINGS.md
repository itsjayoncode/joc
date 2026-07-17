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

## Release Secrets

For Changesets publish on `master`/`main` (see `.github/workflows/ci.yml`):

- `NPM_TOKEN` — npm Automation or Granular Access token with **read + write** for every package under `@jayoncode` (not only packages that already exist on the token allow-list).
- The publish job maps this secret to both `NPM_TOKEN` and `NODE_AUTH_TOKEN` (required by `actions/setup-node` `registry-url`).

If publish fails with `E404 Not Found - PUT .../@jayoncode%2f...`, treat it as an **auth/permission** problem (npm hides 403 as 404). Rotate the token and ensure `@jayoncode/form-intelligent` (and any new adapters) are included in the token’s package scope, or scope the token to the whole `@jayoncode` org.
