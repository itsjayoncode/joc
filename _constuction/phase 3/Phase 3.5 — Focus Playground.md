# JOC ENGINEERING TASK
# Phase 3.5 — Focus Playground
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

You are implementing the Focus Playground.

This page demonstrates the Browser Session Focus module.

Everything displayed must come from

@jayoncode/browser-session

No mocked events.

No fake state.

Everything should reflect the actual browser window.

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

✓ Focus Module

===============================================================================
OBJECTIVE
===============================================================================

Implement the Focus Playground.

The page should teach developers

• What Focus means

• What Blur means

• Difference between Focus and Visibility

• How Browser Session normalizes focus events

The Playground should become the official documentation for the Focus module.

===============================================================================
OUTPUT
===============================================================================

Implement

src/pages/focus

===============================================================================
3.5.1 FOCUS STATUS
===============================================================================

Create a Focus Status card.

Display

Current Window Status

Focused

Blurred

Current Focus State

Previous Focus State

Last Focus Change

Session State

Current BrowserSession Status

Update immediately when focus changes.

Provide

Status Badge

Timestamp

Duration since last change

===============================================================================
3.5.2 BLUR EVENTS
===============================================================================

Create a Blur Event History.

Display

Timestamp

Event

Previous State

Current State

Source

Maximum

100 events

Features

Pause

Resume

Clear

Search

Copy Event

Newest first

Events must come from Browser Session.

===============================================================================
3.5.3 LIVE EVENT STREAM
===============================================================================

Implement a live event stream.

Display

window:focus

window:blur

FocusChanged

Each event should display

Timestamp

Event Name

Payload Summary

Session State

Scroll automatically.

Allow pause/resume.

===============================================================================
3.5.4 BROWSER API INFORMATION
===============================================================================

Display browser API information.

Show

window.focus support

window.blur support

document.hasFocus()

Current Browser Focus

Browser Compatibility

Event Source

Display mapping

Browser API

↓

Browser Session Event

Example

window.focus

↓

window:focus

window.blur

↓

window:blur

Explain

Difference between

Focus

Visibility

Use the Browser Session Focus module as the primary source of truth.

===============================================================================
3.5.5 DEVELOPER EXAMPLES
===============================================================================

Provide production-ready examples.

Examples

Pause keyboard shortcuts

Pause game controls

Lock secure actions

Resume application

Analytics

Presence detection

Window activity monitoring

Each example includes

Syntax-highlighted code

Explanation

Expected behavior

Copy button

Examples must use

createBrowserSession()

===============================================================================
LAYOUT
===============================================================================

Suggested layout

Top

Focus Status

Browser API Information

Middle

Live Event Stream

Bottom

Blur Events

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

Connect to the real Focus module.

Never implement browser event listeners directly inside the Playground.

Browser Session must remain the single source of truth.

===============================================================================
SHARED COMPONENTS
===============================================================================

Reuse existing Playground components.

Examples

Card

StatusBadge

StatisticCard

Timeline

Table

JSONViewer

CodeBlock

Toolbar

Panel

Alert

Placeholder

Do not duplicate components.

===============================================================================
TESTING
===============================================================================

Create tests for

Focus rendering

Live updates

Browser Session integration

Event stream

Focus Status

Blur history

Browser API Information

Developer Examples

Responsive layout

Coverage target

100%

===============================================================================
DOCUMENTATION
===============================================================================

Update

README.md

docs/focus-playground.md

engineering/004-focus-playground.md

Document

Architecture

Focus lifecycle

Browser Session integration

Browser API mapping

Difference between Focus and Visibility

Examples

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

Focus Playground is complete only when

✓ Browser Session integrates successfully

✓ Focus Status updates live

✓ Blur Event History updates live

✓ Live Event Stream works

✓ Browser API Information displayed

✓ Developer Examples complete

✓ Responsive layout complete

✓ Tests passing

✓ Documentation updated

===============================================================================
STOP CONDITION
===============================================================================

When Focus Playground is complete

STOP.

Do NOT implement

Connectivity Playground

Idle Playground

Lifecycle Playground

Cross Tab Playground

Plugin Playground

Only complete the Focus Playground.

===============================================================================
FINAL REVIEW
===============================================================================

Review

Developer Experience

Accessibility

Responsiveness

Performance

Maintainability

Educational Value

Browser Session Integration

Confirm the page clearly demonstrates

• Focus

• Blur

• Window focus lifecycle

• Difference between Focus and Visibility

A developer should understand the Focus module completely by using this page
without needing external documentation.