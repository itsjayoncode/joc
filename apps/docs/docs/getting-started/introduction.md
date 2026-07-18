---
title: Introduction to JOC and JayOnCode
description: What JOC is, the JayOnCode vision, live @jayoncode/* packages, and where to start as a consumer or contributor.
---

# Introduction

**JOC** (JayOnCode) is an open-source ecosystem of **headless TypeScript libraries** for the web. Each `@jayoncode/*` package solves one hard frontend problem well — forms, browser session lifecycle, object diffing, and more — then gets out of your way.

Packages are **independently installable**, **framework-agnostic**, and **tree-shakeable**. You pick what you need; you never adopt a monolith.

## The pitch in one paragraph

Modern apps keep reinventing the same infrastructure: when a tab hides, how a form validates and autosaves, what changed between two objects. JOC ships those building blocks as small, typed cores you compose in React, Vue, Angular, Svelte, or vanilla JS — with docs and playgrounds that match production APIs.

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

Browse the full [package catalog](/packages/) (including planned libraries).

## Who this is for

- **Application developers** who want battle-tested primitives without UI lock-in
- **Library authors** looking for patterns for headless, adapter-friendly APIs
- **Contributors** who care about monorepo standards, docs, and release hygiene

## What you should do next

1. Skim [Philosophy](/getting-started/philosophy) — the rules that keep packages independent.
2. Open the [package catalog](/packages/) and pick a live library.
3. Try it in the [playground](/playground/) before you install.
4. Check the [roadmap](/roadmap/) for what’s shipping next — and [contribute](/guides/contribution) if you want to help shape it.
