# 007 Release Engineering

## Why This Document Exists

This document explains how JOC prepares independent package releases, versioning, changelog generation, and future npm publication without publishing packages prematurely.

## Release Philosophy

JOC is an ecosystem, not a single package. That means:

- public packages version independently
- release notes should describe package-level impact
- maintainers should review releases before anything is published
- automation should reduce manual work without hiding important decisions

## Semantic Versioning Strategy

JOC follows Semantic Versioning for public packages.

### Patch

Use a patch release for bug fixes, internal corrections, documentation clarifications tied to behavior, and safe improvements that do not change the expected public API.

### Minor

Use a minor release for backward-compatible new capabilities, new options, new utilities, or additive API surface.

### Major

Use a major release for breaking changes, incompatible behavior shifts, removals, renamed APIs, or any change that requires consumer migration work.

## Changesets Workflow

JOC uses Changesets to prepare release review in the monorepo.

### Contributor Flow

1. Make a change to a publishable package.
2. Run `pnpm changeset`.
3. Select the affected package or packages.
4. Choose the correct SemVer bump.
5. Write a concise summary focused on user impact.
6. Commit the generated changeset file with the rest of the work.

### Maintainer Flow

1. Review incoming changesets in pull requests.
2. Merge approved changes into the default branch.
3. Let the release workflow open or update the versioning pull request.
4. Review generated changelog and version updates.
5. Merge the versioning pull request when ready.
6. Draft a GitHub release from the resulting tag before any future npm publication step.

## Independent Versioning

Changesets is configured for independent versioning, which means packages are not forced to share one repository-wide version number.

Examples of the intended model:

- `@jayoncode/browser-lifecycle` can become `1.0.0`
- `/request` can become `0.4.2`
- `/theme` can become `2.1.0`

Private workspace apps and internal packages are excluded from publishable release planning.

## Changelog Strategy

JOC uses two changelog layers:

- the root `CHANGELOG.md` for repository-level milestones and foundational shifts
- package-level changelogs generated through Changesets for publishable package changes

Release notes should also capture:

- breaking changes
- deprecations
- migration notes
- package-specific highlights

## GitHub Release Strategy

The GitHub Actions release workflow supports two jobs:

- automatic version pull request preparation on pushes to the default branch
- manual draft GitHub release creation from an existing tag

The intended release flow is:

Developer  
↓  
Commit  
↓  
Pull Request  
↓  
CI  
↓  
Merge  
↓  
Changeset Version Pull Request  
↓  
Git Tag  
↓  
Draft GitHub Release  
↓  
Future npm Publish

## npm Publishing

Publication is enabled through Changesets and the release workflow.

### Required Repository Secrets

- `NPM_TOKEN` for package publication
- default `GITHUB_TOKEN` for release workflow operations

### Required npm Settings

- reserve and configure the intended npm scope or organization
- ensure public packages use the correct access level
- confirm package ownership and organization membership before the first publish

### Publish Command

The root `release:publish` script builds typed packages and runs `changeset publish`.

## Package Metadata Strategy

Future public packages should eventually include:

- `exports`
- `types`
- `repository`
- `homepage`
- `bugs`
- `funding` when appropriate
- `keywords`
- `license`
- `author`
- `publishConfig`

Not every field is required during the placeholder phase, but the release engineering model assumes they will be completed before first publication.

## Rollback and Hotfix Guidance

### Rollback

- stop publication work immediately
- diagnose whether the issue is in package code, metadata, or release notes
- avoid republishing over the same version
- follow SemVer with a corrective release after the problem is understood

### Hotfix

- create a focused patch change
- add a patch changeset
- review the generated version PR carefully
- call out the user-facing fix clearly in release notes

## Contributor Guidance

Contributors should:

- choose the smallest honest SemVer bump
- explain impact from a consumer perspective
- call out breaking changes directly
- include migration notes when behavior changes
- avoid hidden breaking changes packaged as minors or patches
