# JOC Roadmap

This roadmap describes the intended progression of the JOC ecosystem. It is intentionally phased so the repository grows from a stable foundation instead of accumulating tooling and packages without clear boundaries.

## Phase 1.1: Repository Foundation

- Establish the pnpm workspace and Turborepo layout.
- Create the package and app directory structure.
- Publish architecture, contribution, and governance documents.
- Define engineering principles before implementation begins.

## Phase 1.2: Developer Tooling Foundation

- Introduce linting, formatting, testing, and TypeScript build standards.
- Add local quality checks and contributor workflows.
- Define package-level script conventions.

## Phase 1.3: Engineering Automation

- Add GitHub Actions workflows for CI, pull request validation, scheduled quality checks, and CodeQL.
- Generate local coverage reports and upload them as CI artifacts.
- Prepare Dependabot, issue templates, pull request templates, and repository security guidance.
- Add workspace health and package integrity checks to support public collaboration.

## Phase 1.4: Developer Experience Platform

- Build the VitePress documentation application.
- Create the local Vite playground for future package exploration.
- Add package documentation templates and example placeholders.
- Establish a stable navigation system for future package growth.

## Phase 1.5: Release Engineering

- Add release workflows, versioning strategy, and pre-publication safeguards.
- Prepare the repository for package publication without releasing early.
- Refine validation around changelogs, packaging, and release quality gates.

## Phase 1.6: Package Engineering Standards

- Establish the blueprint that every future package implementation will inherit.
- Standardize package exports, file structure, and documentation requirements.
- Define implementation-ready conventions before feature work begins.

## Phase 2: Browser Lifecycle Manager v1

- Ship the first public JOC package.
- Use it to validate package conventions, release practices, and docs standards.
- Refine the ecosystem model before additional packages enter active release.

## Future Package Tracks

After the first release pipeline is proven, the ecosystem is expected to expand across:

- Request and networking
- Scroll and interaction primitives
- Keyboard tooling
- Responsive utilities
- Theme and styling support
- Form architecture
- Layering and overlays
- Object diffing
- Audit and diagnostics
- Permissions and authorization modeling
- Workflow orchestration
- Queueing
- Cache management
- Configuration
- Logging
- Doctor and environment diagnostics

Roadmap priorities may shift, but the repository foundation and package boundaries should remain stable.
