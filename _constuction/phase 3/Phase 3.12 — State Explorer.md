# JOC ENGINEERING TASK
# Phase 3.12 — State Explorer
# Application: Browser Session Playground

===============================================================================
ROLE
===============================================================================

You are acting as a Principal Frontend Engineer,
Software Architect,
TypeScript Engineer,
Developer Experience Engineer,
Browser Platform Engineer,
Open Source Maintainer,
and Runtime State Inspector Designer.

You are implementing the Browser Session State Explorer.

This page becomes the runtime state inspector
for Browser Session.

Everything displayed must come from

@jayoncode/browser-session

Do not mock state.

Do not simulate values.

Everything must represent the actual Browser Session runtime.

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

All implemented Browser Session modules.

===============================================================================
OBJECTIVE
===============================================================================

Implement a professional State Explorer.

Developers should be able to

• Inspect current session state

• Observe live state updates

• Inspect module state

• Compare previous/current state

• Explore nested state

• Export state snapshots

This page becomes the runtime inspector
for Browser Session.

===============================================================================
OUTPUT
===============================================================================

Implement

src/pages/state

===============================================================================
3.12.1 SESSION STATE
===============================================================================

Create Session State panel.

Display

Session Status

Session ID

Session Version

Session Start Time

Session Uptime

Current Lifecycle

Current Configuration

Module Count

Current BrowserSession State

Display

Cards

Tree View

Table

JSON

Automatically update when state changes.

===============================================================================
3.12.2 VISIBILITY
===============================================================================

Display Visibility State.

Examples

Current State

Previous State

Visible

Hidden

Last Change

Transition Count

Duration

Browser Visibility State

Current Module Status

Display

Timeline

Statistics

State Card

JSON

===============================================================================
3.12.3 FOCUS
===============================================================================

Display Focus State.

Examples

Focused

Blurred

Previous State

Current State

Transition Count

Focus Duration

Last Focus

Current Module Status

Display

Timeline

Statistics

JSON

===============================================================================
3.12.4 CONNECTIVITY
===============================================================================

Display Connectivity State.

Examples

Online

Offline

Reconnect Count

Last Offline

Last Online

Current Connection

Connection Duration

Current Module Status

Display

Timeline

Statistics

JSON

===============================================================================
3.12.5 IDLE
===============================================================================

Display Idle State.

Examples

Idle

Active

Idle Timeout

Elapsed Time

Last Activity

Remaining Time

Current Module Status

Display

Countdown

Timeline

Statistics

JSON

===============================================================================
3.12.6 LIFECYCLE
===============================================================================

Display Lifecycle State.

Examples

Running

Hidden

Frozen

Sleeping

Wake

Destroyed

Previous State

Current State

Transition Count

Current Module Status

Display

Lifecycle Timeline

Statistics

JSON

===============================================================================
3.12.7 JSON VIEWER
===============================================================================

Implement a professional JSON Viewer.

Support

Tree View

Pretty JSON

Raw JSON

Table View

Collapsible Nodes

Expand All

Collapse All

Search

Path Copy

Value Copy

Key Copy

Syntax Highlighting

Large object virtualization

Do not truncate large objects.

Allow

Download JSON

Copy JSON

Copy Path

Expand to depth

State updates should appear automatically.

===============================================================================
STATE HISTORY
===============================================================================

Maintain previous state snapshots.

Display

Current State

↓

Previous State

↓

Previous Previous State

Allow

Compare snapshots

Highlight changes

Diff view

State timestamp

Snapshot number

Maintain

100 snapshots

===============================================================================
STATE DIFF
===============================================================================

Implement State Diff.

Display

Added

Removed

Changed

Moved (if applicable)

Highlight modified values.

Display

Previous

↓

Current

Provide

Side-by-side comparison

Unified comparison

===============================================================================
LAYOUT
===============================================================================

Suggested layout

Top

Session Overview

Current State

Middle

Visibility

Focus

Connectivity

Idle

Lifecycle

Right Panel

JSON Viewer

Bottom

State History

State Diff

Responsive

Desktop

Tablet

Mobile

===============================================================================
BROWSER SESSION INTEGRATION
===============================================================================

Use

createBrowserSession()

Use Browser Session state only.

Do not maintain duplicate state.

Browser Session remains the single source of truth.

===============================================================================
SHARED COMPONENTS
===============================================================================

Reuse Playground UI components.

Examples

Card

StatisticCard

Timeline

StatusBadge

JSONViewer

TreeView

Table

Toolbar

Panel

Alert

Tabs

SplitPane

DiffViewer

CodeBlock

Placeholder

Do not duplicate UI.

===============================================================================
TESTING
===============================================================================

Create tests for

Session State

Visibility State

Focus State

Connectivity State

Idle State

Lifecycle State

JSON Viewer

Tree View

Search

Snapshot History

State Diff

Browser Session integration

Responsive layout

Coverage target

100%

===============================================================================
DOCUMENTATION
===============================================================================

Update

README.md

docs/state-explorer.md

engineering/011-state-explorer.md

Document

Architecture

State model

Snapshot history

Diff viewer

JSON viewer

Browser Session integration

Developer workflow

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

State Explorer is complete only when

✓ Session State displayed

✓ Visibility State updates live

✓ Focus State updates live

✓ Connectivity State updates live

✓ Idle State updates live

✓ Lifecycle State updates live

✓ JSON Viewer works

✓ State History works

✓ State Diff works

✓ Browser Session integrates successfully

✓ Responsive layout complete

✓ Tests passing

✓ Documentation updated

===============================================================================
STOP CONDITION
===============================================================================

When State Explorer is complete

STOP.

Do NOT implement

Configuration Playground

Performance Playground

Developer Tools

Those belong to later phases.

===============================================================================
FINAL REVIEW
===============================================================================

Review

Developer Experience

Accessibility

Performance

Maintainability

State Synchronization

Browser Session Integration

JSON Viewer

State History

Ensure developers can

• Inspect current runtime state

• Compare previous state

• Explore nested objects

• View JSON

• Track state changes

without opening browser developer tools.

The State Explorer should become the definitive runtime state inspector
for Browser Session.