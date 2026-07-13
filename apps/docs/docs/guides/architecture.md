# Architecture

JOC is meant to support many independently installable libraries over time.

## Architectural priorities

- strong package boundaries
- internal shared code stays private
- documentation scales alongside packages
- automation and quality checks stay repository-wide

## Documentation and playground role

This phase adds two first-party apps:

- a VitePress documentation site for public understanding and contributor onboarding
- a Vite playground for local workspace package exploration and manual validation

These apps support package development without becoming package implementations themselves.
