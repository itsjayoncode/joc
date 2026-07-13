# Release Engineering

JOC now includes the release-engineering foundation needed for independent package versioning and future publication.

## What is configured

- Changesets for independent versioning
- release pull request preparation through GitHub Actions
- draft GitHub release support
- changelog preparation and SemVer guidance

## What is intentionally not active yet

- package publication to npm
- npm authentication in automation
- real package release tags from implemented libraries

## Contributor workflow

1. Make a change to a future publishable package.
2. Run `pnpm changeset`.
3. Select the affected package and the correct SemVer bump.
4. Write release notes focused on user impact.
5. Commit the changeset with the pull request.

## Maintainer workflow

After changesets merge to the default branch, the release workflow prepares a versioning pull request. That PR becomes the review point for version bumps and generated changelog updates before any future publication step.
