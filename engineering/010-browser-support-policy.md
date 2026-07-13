# 010 Browser Support Policy

## Why This Document Exists

This document defines the supported execution environments for JOC packages and explains how compatibility should be validated.

## Baseline Support Philosophy

JOC packages should target modern, actively maintained environments first. Compatibility should be intentional, documented, and verified.

## Expected Environment Categories

- modern browsers
- Node.js
- Electron where browser-compatible behavior makes sense
- PWAs when the package runs in browser contexts
- Deno in the future where practical
- Bun in the future where practical

## Browser Policy

Unless a package explicitly documents stronger constraints, browser-oriented JOC packages should target:

- the current generation of evergreen browsers
- modern JavaScript and DOM APIs supported by those browsers

Packages should not silently depend on niche or unstable browser behavior.

## Node Policy

Node support should align with the repository engine policy. If a package is browser-only or Node-only, that must be documented clearly in its README and package metadata.

## Environment Documentation

Every package should state:

- which environments it supports
- whether it is browser-only, server-only, or universal
- any required platform APIs
- any known environment limitations

## Compatibility Testing

Compatibility should be validated through:

- unit tests for platform-agnostic behavior
- integration tests when environment differences matter
- documentation review for environment constraints
- future browser matrix testing when package behavior depends on browser APIs
