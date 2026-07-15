# GitHub Automation

This directory contains the repository automation assets for the JOC monorepo.

## Workflows

| Workflow                    | Trigger                                       | Purpose                                                                 |
| --------------------------- | --------------------------------------------- | ----------------------------------------------------------------------- |
| **CI**                      | Push to `main` / `master` / `develop`, manual | Quality gates; on `main`/`master` also deploys docs and runs Changesets |
| **Pull Request Validation** | Pull requests                                 | Quality gates only                                                      |
| **CodeQL**                  | Push, pull requests, weekly schedule          | Security analysis                                                       |
| **Release**                 | Manual only                                   | Draft GitHub release for an existing tag                                |
| **Deploy Docs**             | Manual only                                   | Redeploy docs without a full CI run                                     |
| **Deploy Playground**       | Manual only                                   | Build playground artifact                                               |

On push to `master`, expect **2** workflow runs: **CI** and **CodeQL**.

Package publication is still intentionally disabled. The CI workflow prepares version pull requests via Changesets after quality gates pass.

## Also included

- Dependabot configuration
- Issue templates
- Pull request template
- Recommended labels and repository security settings documentation
