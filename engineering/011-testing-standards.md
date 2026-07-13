# 011 Testing Standards

## Why This Document Exists

This document defines how JOC packages should be tested so quality expectations stay consistent across the ecosystem.

## Required Test Layers

### Unit Tests

Every package should include unit tests for isolated behavior, pure functions, and core logic.

### Integration Tests

Add integration tests when:

- multiple modules interact
- adapters or plugins are involved
- environment-specific behavior matters

### Future Performance Testing

Performance testing is not mandatory for every initial package version, but packages with meaningful runtime sensitivity should plan for it.

## Test Structure

- `tests/unit/` for isolated checks
- `tests/integration/` for combined behavior
- `tests/fixtures/` for deterministic sample data
- `tests/helpers/` for test-only utilities

## Coverage Expectations

Coverage is a quality signal, not a substitute for good tests. Packages should aim for strong coverage on meaningful public and critical internal behavior, with special focus on:

- public APIs
- error handling
- branching logic
- environment guards

## Mocking Strategy

- mock only what is expensive, unstable, or external
- prefer real behavior over deep mocking when possible
- do not mock internal logic that should be tested directly

## Naming Conventions

- test files should mirror the subject they verify
- test names should describe observable behavior
- prefer `it("does X")` style statements that explain user-visible expectations

## Browser Testing Policy

Packages that depend on browser APIs should include browser-oriented coverage, whether through jsdom-level tests or future real-browser validation.
