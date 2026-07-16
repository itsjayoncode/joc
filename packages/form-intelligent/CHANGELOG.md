# Changelog

## 0.1.1

### Patch Changes

- 1745931: Improve npm README title formatting and docs playground sidebar links (open in new tab).

## 0.1.0

Initial public release of the headless form workflow engine for the JOC ecosystem.

### Added

- `createForm()` with field registration and headless bindings
- Validation pipeline with built-in validators (`required`, `email`, `url`, `minLength`, `regex`)
- Submission orchestration with double-submit guard
- Workflow primitives: autosave, drafts, multi-step wizard
- Formatters: `phone`, `currency`, `slug`, `trim`, `uppercase`, `lowercase`
- Plugin registry and adapter interfaces
- Interactive playground and package documentation on the JOC docs site

All notable changes to `@jayoncode/form-intelligent` are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Modular engines: fields, validation, state, submission, workflow, format, plugins, adapters
- Plugin hook API (`beforeValidate`, `beforeSubmit`, …) and middleware helpers
- Core adapter interfaces (`SchemaAdapter`, `PersistenceAdapter`, `FrameworkAdapter`, `SubmitTransportAdapter`)
- Documentation: migration guide and common patterns
- Examples: `vanilla-html`, `basic-validation`, `wizard-workflow` (+ framework stubs)

## 0.1.1
