---
title: Introduction to the JOC Ecosystem
description: What JayOnCode and the JOC Ecosystem are — independent, headless TypeScript libraries with docs and playgrounds — and where to start.
---

# Introduction

**[JayOnCode](https://www.jayoncode.com/)** builds the **JOC Ecosystem**: an ecosystem of independent, headless TypeScript libraries engineered for modern web applications. Every package is framework-agnostic, thoroughly documented, and backed by interactive playgrounds for a consistent developer experience.

Each `@jayoncode/*` package solves one hard frontend problem well — forms, browser session lifecycle, object diffing, client storage, and more — then gets out of your way. You pick what you need; you never adopt a monolith.

## The pitch in one paragraph

Modern apps keep reinventing the same infrastructure: when a tab hides, how a form validates and autosaves, what changed between two objects, how prefs survive a reload. The JOC Ecosystem ships those building blocks as small, typed cores you compose in React, Vue, Angular, Svelte, or vanilla JS — with docs and playgrounds that match production APIs.

## Vision

JOC aims to be a **trusted home for focused developer libraries**:

- Clear package boundaries — install one without dragging the rest
- Production-grade TypeScript contracts and predictable errors
- Docs, playgrounds, and release practices that scale with the ecosystem
- Long-term maintainability over “ship everything in one SDK”

What we deliberately avoid: a grab bag of unrelated utilities, hidden cross-package coupling, and tooling sprawl that outruns standards.

Read the full [philosophy](/getting-started/philosophy) and [vision on GitHub](https://github.com/itsjayoncode/joc/blob/master/VISION.md).

## Live packages today

| Package                                                        | What it solves                                                       | Start here                                                                          |
| -------------------------------------------------------------- | -------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| [`@jayoncode/browser-lifecycle`](/packages/browser-lifecycle/) | Visibility, focus, idle, connectivity, cross-tab session signals     | [Docs](/packages/browser-lifecycle/) · [Playground](/playground/browser-lifecycle/) |
| [`@jayoncode/form-intelligence`](/packages/form-intelligence/) | Headless form workflows — validation, rules, drafts, wizards, submit | [Docs](/packages/form-intelligence/) · [Playground](/playground/form-intelligence/) |
| [`@jayoncode/object-diff`](/packages/object-diff/)             | Deep comparison, change records, JSON Patch                          | [Docs](/packages/object-diff/) · [Playground](/playground/object-diff/)             |
| [`@jayoncode/storage`](/packages/storage/)                     | Save prefs and cache in the browser — adapters, TTL, migrations      | [Docs](/packages/storage/) · [Playground](/playground/storage/)                     |

Browse the full [package catalog](/packages/). New libraries will be announced as they enter development.

## Who this is for

- **Application developers** who want battle-tested primitives without UI lock-in
- **Library authors** looking for patterns for headless, adapter-friendly APIs
- **Contributors** who care about monorepo standards, docs, and release hygiene

## What you should do next

1. Skim [Philosophy](/getting-started/philosophy) — the rules that keep packages independent.
2. Open the [package catalog](/packages/) and pick a live library.
3. Try it in the [playground](/playground/) before you install.
4. Check the [roadmap](/roadmap/) for what’s shipping next — and [contribute](/guides/contribution) if you want to help shape it.
