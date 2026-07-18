---
title: Changelog
description: "Release history for @jayoncode/object-diff."
---

# Changelog

## 0.3.0

### Minor Changes

- 8c0a09f: Evolved object-diff from a small core into a full engine suite, then filled the post-phase gaps (RFC ops, moves, slim entrypoints). Root APIs stay compatible.
- 8c0a09f: Add DiffOptions for identityKey, ignore/include path filters, and make detectMoves throw NotImplementedError instead of silently no-oping.
- 8c0a09f: Add createDiffView on @jayoncode/object-diff/view, DX docs, and playground/README coverage for optional engines.
- 8c0a09f: Add html/console/human serialize formats, createSerializer plugin contract, and `@jayoncode/object-diff/formatter` subpath (root serialize kept for compatibility).
- 8c0a09f: Add `@jayoncode/object-diff/merge` with two- and three-way merge, conflict objects, and latest-wins / manual / custom strategies.
- 8c0a09f: Harden the patch engine: validatePatch, optimizePatch, applyPatchWithInverse, optional patch optimize flag, and stricter apply validation by default.
- 8c0a09f: Add `@jayoncode/object-diff/plugins` with createEngine, ObjectDiffPlugin contracts, lifecycle hooks, and PluginError.
- 8c0a09f: Add `@jayoncode/object-diff/query` with find/filter/exclude/paths/summary/ofType and fluent query() over DiffResult.
- 8c0a09f: Add RFC 6902 move/copy/test patch ops, real detectMoves (moved records), and slim @jayoncode/object-diff/core plus /patch subpath exports.
- 8c0a09f: Add `@jayoncode/object-diff/stats` with DiffStatistics (ratios, depths, hot prefixes, estimated patch size).

### Patch Changes

- 8c0a09f: Document integrations (forms, session, audit, merge, plugins) with package guide, examples, and contract tests — no new peer deps.
- 8c0a09f: Speed up hasChanges (single-walk / filtered early exit), add performance budget tests, and lock tree-shaken bundle size gates.

## 0.2.0

### Minor Changes

- 926fd56: JOC Docs v1.3.0 — Form Intelligence, playground hub, per-package changelogs

## 0.1.0

Initial public release of the Object Difference Engine for the JOC ecosystem.

### Added

- `diff`, `compare`, `hasChanges`, and filtered helpers (`added`, `removed`, `updated`, `unchanged`)
- JSON Patch generation and application (`patch`, `applyPatch`, `revertPatch`)
- Serializers for `json`, `pretty`, `markdown`, and `table` output formats
- Interactive playground and package documentation on the JOC docs site

All notable changes to `@jayoncode/object-diff` are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

