# JOC ENGINEERING TASK
# Phase 3.6 — Connectivity Playground
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

You are implementing the Connectivity Playground.

This page demonstrates the Browser Session Connectivity module.

Everything displayed must come from

@jayoncode/browser-session

No mocked network state.

No fake connectivity events.

Everything should reflect the real browser.

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

✓ Connectivity Module

===============================================================================
OBJECTIVE
===============================================================================

Implement the complete Connectivity Playground.

The page should teach developers

• Online detection

• Offline detection

• Reconnect events

• Browser limitations

• Network Information API

• Best practices

The Playground becomes the official Connectivity documentation.

===============================================================================
OUTPUT
===============================================================================

Implement

src/pages/connectivity

===============================================================================
3.6.1 ONLINE STATUS
===============================================================================

Create an Online Status card.

Display

Current Status

Online

Offline

Current Connectivity State

Previous Connectivity State

Last Connectivity Change

Session Status

Current BrowserSession State

Provide

Status Badge

Timestamp

Duration

Realtime updates

The state should automatically update.

===============================================================================
3.6.2 OFFLINE STATUS
===============================================================================

Create an Offline History panel.

Display

Timestamp

Previous State

Current State

Reason (if available)

Source

Maximum

100 entries

Features

Pause

Resume

Clear

Search

Copy

Newest first

Data must come from Browser Session.

===============================================================================
3.6.3 RECONNECT EVENTS
===============================================================================

Implement a live reconnect timeline.

Display

connection:online

connection:offline

connection:reconnect

Session events

Reconnect count

Reconnect duration

Time since reconnect

Display every reconnect cycle.

Provide timeline visualization.

===============================================================================
3.6.4 NETWORK INFORMATION
===============================================================================

Display browser network information.

Show

navigator.onLine

Network Information API Support

Connection Type

Effective Type

Downlink

RTT

Save Data Preference

Browser Compatibility

Display

Browser API

↓

Browser Session Event

Example

online event

↓

connection:online

offline event

↓

connection:offline

Explain

Limitations of navigator.onLine

Difference between

Browser connectivity

Internet availability

Server availability

If Network Information API is unavailable

Gracefully indicate

Not Supported

Do not fail.

===============================================================================
3.6.5 DEVELOPER EXAMPLES
===============================================================================

Provide production-ready examples.

Examples

Pause API polling

Retry failed requests

Offline notification banner

Sync queued data

Disable network actions

Offline-first application

PWA synchronization

Reconnect analytics

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

Online Status

Network Information

Middle

Reconnect Timeline

Offline History

Bottom

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

Use the Connectivity module.

Never read browser events directly except when displaying
educational Browser API information.

Browser Session remains the source of truth.

===============================================================================
SHARED COMPONENTS
===============================================================================

Reuse Playground UI components.

Card

StatisticCard

StatusBadge

Timeline

CodeBlock

JSONViewer

Panel

Toolbar

Alert

Table

Badge

Placeholder

Do not duplicate UI.

===============================================================================
TESTING
===============================================================================

Create tests for

Connectivity rendering

Online updates

Offline updates

Reconnect events

Network Information

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

docs/connectivity-playground.md

engineering/005-connectivity-playground.md

Document

Architecture

Connectivity lifecycle

Browser Session integration

Browser API mapping

Network Information API

navigator.onLine limitations

Reconnect strategy

Best practices

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

Connectivity Playground is complete only when

✓ Browser Session integrates successfully

✓ Online Status updates live

✓ Offline History updates live

✓ Reconnect timeline works

✓ Network Information displayed

✓ Developer Examples complete

✓ Responsive layout complete

✓ Tests passing

✓ Documentation updated

===============================================================================
STOP CONDITION
===============================================================================

When Connectivity Playground is complete

STOP.

Do NOT implement

Idle Playground

Lifecycle Playground

Cross Tab Playground

Plugin Playground

Only complete the Connectivity Playground.

===============================================================================
FINAL REVIEW
===============================================================================

Review

Developer Experience

Responsiveness

Accessibility

Performance

Maintainability

Educational Value

Browser Session Integration

Ensure developers understand

• Online detection

• Offline detection

• Browser limitations

• Network Information API

• Why navigator.onLine should not be treated as an
Internet availability guarantee

The completed page should become the definitive reference for the
Browser Session Connectivity module.