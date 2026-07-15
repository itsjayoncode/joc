# JOC ENGINEERING TASK
# Phase 3.8 — Lifecycle Playground
# Application: Browser Session Playground

===============================================================================
ROLE
===============================================================================

You are acting as a Principal Frontend Engineer,
Browser Platform Engineer,
React Architect,
Developer Experience Engineer,
Software Architect,
Open Source Maintainer,
and Technical Documentation Engineer.

You are implementing the Lifecycle Playground.

This page demonstrates the Browser Session Lifecycle module.

Everything displayed must come from

@jayoncode/browser-session

Do not mock lifecycle events.

Display real browser lifecycle information whenever available.

Gracefully handle browsers that do not support specific lifecycle events.

===============================================================================
DEPENDENCIES
===============================================================================

Requires

✓ Playground Foundation

✓ Playground Core

✓ Dashboard

✓ Browser Session Core

✓ Event Infrastructure

✓ Session Core

✓ Lifecycle Module

===============================================================================
OBJECTIVE
===============================================================================

Implement the complete Lifecycle Playground.

The page should teach developers

• Browser lifecycle

• Freeze

• Resume

• Sleep

• Wake

• Page Lifecycle API

• Browser compatibility

• Best practices

The Lifecycle Playground becomes the official documentation
for the Browser Session Lifecycle module.

===============================================================================
OUTPUT
===============================================================================

Implement

src/pages/lifecycle

===============================================================================
3.8.1 FREEZE
===============================================================================

Create a Freeze panel.

Display

Current Lifecycle State

Freeze Supported

Current Freeze Status

Last Freeze Time

Freeze Count

Session State

Display

Status Badge

Timestamp

Duration

Show instructions

Hide browser tab

Wait

Observe Freeze

Explain

What Freeze means

Why browsers freeze pages

How Browser Session detects it

===============================================================================
3.8.2 RESUME
===============================================================================

Create a Resume panel.

Display

Last Resume Time

Resume Count

Time Frozen

Previous Lifecycle State

Current Lifecycle State

Display transitions

Frozen

↓

Resume

↓

Active

Display

Timestamp

Duration

===============================================================================
3.8.3 SLEEP
===============================================================================

Implement Sleep visualization.

Display

Sleep State

Sleep Duration

Last Sleep

Wake Source

Sleep Count

Explain

Difference between

Hidden

Frozen

Sleep

Browser Session abstraction

===============================================================================
3.8.4 WAKE
===============================================================================

Create Wake panel.

Display

Wake Events

Wake Count

Wake Duration

Previous State

Current State

Display timeline

Sleep

↓

Wake

↓

Running

Show every wake cycle.

===============================================================================
3.8.5 LIFECYCLE EVENTS
===============================================================================

Implement a live lifecycle event stream.

Display

page:freeze

page:resume

page:sleep

page:wake

pagehide

pageshow

visibilitychange

Display

Timestamp

Event

Source

Payload Summary

Session State

Provide

Pause

Resume

Clear

Search

Auto Scroll

Maximum

100 events

Events must come from Browser Session.

===============================================================================
3.8.6 BROWSER DIFFERENCES
===============================================================================

Create a Browser Compatibility panel.

Display support for

Chrome

Edge

Firefox

Safari

Electron

PWA

For every browser display

Freeze Support

Resume Support

Page Lifecycle API

Page Visibility API

pagehide

pageshow

Document

Known limitations

Fallback behavior

Unsupported features

Browser Session strategy

Clearly distinguish

Native browser events

↓

Browser Session normalized events

===============================================================================
LIFECYCLE TIMELINE
===============================================================================

Implement a visual timeline.

Example

Running

↓

Hidden

↓

Frozen

↓

Resume

↓

Visible

↓

Running

Display

Current State

Previous State

Transition Time

Duration

Transition Number

===============================================================================
BROWSER API INFORMATION
===============================================================================

Display browser APIs used.

Examples

Page Lifecycle API

Page Visibility API

pagehide

pageshow

freeze

resume

Display mapping

Browser Event

↓

Browser Session Event

Explain

How Browser Session normalizes browser differences.

===============================================================================
LIVE DEMO
===============================================================================

Create an interactive demonstration.

Instructions

Open another tab

Minimize browser

Restore browser

Navigate away

Navigate back

Observe

Lifecycle Timeline

Event Stream

State Changes

Current Lifecycle State

No page refresh required.

===============================================================================
DEVELOPER EXAMPLES
===============================================================================

Provide production-ready examples.

Examples

Pause expensive work

Save application state

Suspend timers

Release resources

Restore application

Resume polling

Resume rendering

Handle BFCache

Prevent resource leaks

Each example includes

Syntax-highlighted code

Explanation

Expected behavior

Copy button

All examples use

createBrowserSession()

===============================================================================
LAYOUT
===============================================================================

Suggested layout

Top

Lifecycle Status

Browser API Information

Browser Compatibility

Middle

Freeze

Resume

Sleep

Wake

Lifecycle Timeline

Bottom

Lifecycle Events

Developer Examples

Responsive

Desktop

Tablet

Mobile

===============================================================================
BROWSER SESSION INTEGRATION
===============================================================================

Use

createBrowserSession()

Connect only through the Lifecycle module.

Never register browser lifecycle listeners directly inside the Playground.

Browser Session remains the source of truth.

===============================================================================
SHARED COMPONENTS
===============================================================================

Reuse Playground components.

Examples

Card

Timeline

StatusBadge

StatisticCard

CodeBlock

JSONViewer

Toolbar

Panel

Alert

Badge

Table

Placeholder

ProgressIndicator

Do not duplicate components.

===============================================================================
TESTING
===============================================================================

Create tests for

Lifecycle rendering

Freeze state

Resume state

Sleep state

Wake state

Timeline

Lifecycle Events

Browser compatibility

Browser Session integration

Developer examples

Responsive layout

Coverage target

100%

===============================================================================
DOCUMENTATION
===============================================================================

Update

README.md

docs/lifecycle-playground.md

engineering/007-lifecycle-playground.md

Document

Architecture

Lifecycle model

Browser Session integration

Browser API mapping

Browser differences

Best practices

Common pitfalls

===============================================================================
QUALITY REQUIREMENTS
===============================================================================

Every file must satisfy

✓ Strict TypeScript

✓ ESLint clean

✓ Prettier clean

✓ Responsive

✓ Accessible

✓ Small reusable components

✓ No circular dependencies

✓ Fully documented

===============================================================================
ACCEPTANCE CRITERIA
===============================================================================

Lifecycle Playground is complete only when

✓ Browser Session integrates successfully

✓ Freeze panel works

✓ Resume panel works

✓ Sleep panel works

✓ Wake panel works

✓ Lifecycle timeline updates live

✓ Lifecycle Events stream works

✓ Browser compatibility displayed

✓ Browser API information displayed

✓ Developer Examples complete

✓ Responsive layout complete

✓ Tests passing

✓ Documentation updated

===============================================================================
STOP CONDITION
===============================================================================

When Lifecycle Playground is complete

STOP.

Do NOT implement

Cross Tab Playground

Plugin Playground

Only complete the Lifecycle Playground.

===============================================================================
FINAL REVIEW
===============================================================================

Review

Developer Experience

Performance

Accessibility

Maintainability

Educational Value

Browser Session Integration

Browser Compatibility

Ensure developers understand

• Browser lifecycle

• Freeze vs Hidden

• Resume vs Visible

• Sleep vs Frozen

• Browser differences

• Browser Session normalization

without requiring external documentation.