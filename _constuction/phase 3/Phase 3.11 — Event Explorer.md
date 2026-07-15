# JOC ENGINEERING TASK
# Phase 3.11 — Event Explorer
# Application: Browser Session Playground

===============================================================================
ROLE
===============================================================================

You are acting as a Principal TypeScript Engineer,
React Architect,
Developer Experience Engineer,
Browser Platform Engineer,
Software Architect,
Open Source Maintainer,
and Debugging Tool Designer.

You are implementing the Browser Session Event Explorer.

This page becomes the primary debugging console for Browser Session.

Everything displayed must come from

@jayoncode/browser-session

Do not mock events.

Do not generate fake logs.

Everything must display the real event stream.

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

===============================================================================
OBJECTIVE
===============================================================================

Implement a professional Event Explorer.

Developers should be able to

• Observe live events

• Inspect payloads

• View metadata

• Search events

• Filter events

• Export event history

This page should become the primary debugging tool
for Browser Session.

===============================================================================
OUTPUT
===============================================================================

Implement

src/pages/events

===============================================================================
3.11.1 LIVE EVENT STREAM
===============================================================================

Create a realtime Event Stream.

Display

Timestamp

Event Name

Category

Source Module

Priority

Sequence Number

Status

Payload Summary

Features

Live Streaming

Pause

Resume

Clear

Auto Scroll

Newest First

Maximum

1000 events

Display realtime statistics

Events Per Second

Total Events

Dropped Events

Stream Status

Events must update immediately.

===============================================================================
3.11.2 EVENT DETAILS
===============================================================================

Selecting an event should open an Event Details panel.

Display

Event Name

Category

Timestamp

Module

Sequence Number

Session ID

Event ID

Source

Target

Execution Duration

Propagation Status

Previous State

Current State

Display formatted information.

Support

Expand

Collapse

Copy

===============================================================================
3.11.3 EVENT METADATA
===============================================================================

Display metadata.

Examples

Event ID

Correlation ID

Source Module

Dispatch Time

Created Time

Received Time

Priority

Version

Internal Flags

Propagation Path

Display metadata as

Table

JSON

Raw

Support

Copy Metadata

Download Metadata

===============================================================================
3.11.4 PAYLOAD VIEWER
===============================================================================

Implement a Payload Viewer.

Display payload as

Tree View

JSON Viewer

Raw JSON

Pretty Printed

Support

Expand All

Collapse All

Copy

Download

Syntax Highlighting

Search inside payload

Large payload virtualization

Payload should never be truncated.

===============================================================================
3.11.5 SEARCH
===============================================================================

Implement powerful search.

Search by

Event Name

Payload

Module

Category

Timestamp

Correlation ID

Session ID

Sequence Number

Support

Partial Match

Exact Match

Case Sensitive

Regex (optional)

Highlight matches

Incremental search

Search history

Search should update results instantly.

===============================================================================
3.11.6 FILTERS
===============================================================================

Implement advanced filtering.

Filter by

Module

Event Type

Category

Time Range

Priority

Status

Source

Target

Browser Feature

Visibility

Focus

Connectivity

Idle

Lifecycle

Cross Tab

Support

Multiple filters

Reset filters

Saved filters

Filter badges

Display active filter count.

Filtering should be performed client-side.

===============================================================================
3.11.7 EXPORT
===============================================================================

Allow exporting event history.

Supported formats

JSON

CSV

TXT

NDJSON

Copy to Clipboard

Export Current View

Export Filtered Results

Export Selected Event

Export All Events

Allow

Pretty JSON

Compact JSON

Timestamp formatting

File naming

Downloaded files should include

Timestamp

Version

Browser Session Version

===============================================================================
LAYOUT
===============================================================================

Suggested layout

Top

Search

Filters

Statistics

Middle

Live Event Stream

Right Panel

Event Details

Metadata

Payload Viewer

Bottom

Export Toolbar

Responsive

Desktop

Tablet

Mobile

===============================================================================
BROWSER SESSION INTEGRATION
===============================================================================

Use

createBrowserSession()

Subscribe to all Browser Session events.

Do not create a parallel event system.

Browser Session remains the single source of truth.

===============================================================================
SHARED COMPONENTS
===============================================================================

Reuse Playground components.

Examples

Card

Toolbar

SearchBox

FilterPanel

Table

Timeline

StatusBadge

JSONViewer

CodeBlock

Panel

Tabs

Badge

TreeView

SplitPane

EmptyState

LoadingState

Do not duplicate components.

===============================================================================
TESTING
===============================================================================

Create tests for

Live streaming

Event selection

Metadata rendering

Payload rendering

Search

Filtering

Export

Browser Session integration

Responsive layout

Coverage target

100%

===============================================================================
DOCUMENTATION
===============================================================================

Update

README.md

docs/event-explorer.md

engineering/010-event-explorer.md

Document

Architecture

Streaming

Search

Filtering

Export

Metadata

Payload inspection

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

Event Explorer is complete only when

✓ Live Event Stream works

✓ Event Details panel works

✓ Metadata panel works

✓ Payload Viewer works

✓ Search works

✓ Filters work

✓ Export works

✓ Browser Session integrates successfully

✓ Responsive layout complete

✓ Tests passing

✓ Documentation updated

===============================================================================
STOP CONDITION
===============================================================================

When Event Explorer is complete

STOP.

Do NOT implement

State Explorer

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

Responsiveness

Maintainability

Debugging Experience

Browser Session Integration

Ensure developers can

• Watch events in real time

• Search events

• Filter events

• Inspect payloads

• View metadata

• Export logs

without using browser developer tools.

The Event Explorer should become the primary debugging interface
for Browser Session.