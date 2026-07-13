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

When JOC is ready for real publication, add:

- `NPM_TOKEN` for npm publication
- any future registry-specific secrets only after publication strategy is finalized
