# JOC ENGINEERING TASK
# Phase 3.9 — Cross Tab Playground
# Application: Browser Session Playground

===============================================================================
ROLE
===============================================================================

You are acting as a Principal Frontend Engineer,
Browser Platform Engineer,
React Architect,
Developer Experience Engineer,
Software Architect,
Distributed Systems Engineer,
Open Source Maintainer,
and Technical Documentation Engineer.

You are implementing the Cross Tab Playground.

This page demonstrates the Browser Session Cross Tab module.

Everything displayed must come from

@jayoncode/browser-session

No mocked tabs.

No simulated communication.

Everything should use real browser tabs.

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

✓ Cross Tab Module

===============================================================================
OBJECTIVE
===============================================================================

Implement the complete Cross Tab Playground.

The page should teach developers

• Cross-tab communication

• BroadcastChannel

• Storage Events

• Primary tab

• Secondary tabs

• Leader election

• Browser limitations

• Best practices

The Playground becomes the official Cross Tab documentation.

===============================================================================
OUTPUT
===============================================================================

Implement

src/pages/cross-tab

===============================================================================
3.9.1 BROADCAST CHANNEL
===============================================================================

Create a Broadcast Channel panel.

Display

BroadcastChannel Supported

Current Channel

Channel Status

Messages Sent

Messages Received

Last Message

Connected Tabs

Message Rate

Provide

Send Test Message

Broadcast JSON

Broadcast Ping

Broadcast Timestamp

Clear Messages

Display

Timestamp

Sender Tab

Receiver Tabs

Payload

Status

Messages must come from Browser Session.

===============================================================================
3.9.2 STORAGE EVENTS
===============================================================================

Create a Storage Events panel.

Display

Storage Events Supported

Current Storage Key

Messages Sent

Messages Received

Last Update

Storage Synchronization

Display

Timestamp

Storage Key

Previous Value

Current Value

Source Tab

Explain

Storage Event fallback

When BroadcastChannel is unavailable

Browser Session fallback strategy

===============================================================================
3.9.3 PRIMARY TAB
===============================================================================

Implement Primary Tab panel.

Display

Current Role

Primary

Secondary

Election Status

Primary Tab ID

Primary Since

Leadership Duration

Display

Status Badge

Leader Identifier

Election Timestamp

Heartbeat Status

If current tab is Primary

Clearly indicate it.

===============================================================================
3.9.4 SECONDARY TABS
===============================================================================

Create Secondary Tabs panel.

Display

Connected Tabs

Tab IDs

Current Role

Last Heartbeat

Last Message

Connection Status

Display

Current BrowserSession Tab

Other Tabs

Tab Count

Update in real time.

===============================================================================
3.9.5 TAB COMMUNICATION
===============================================================================

Implement live communication monitor.

Display

Messages

Commands

Synchronization Events

Leader Messages

Heartbeat

Broadcasts

Display

Timestamp

Message Type

Source

Destination

Payload Summary

Features

Pause

Resume

Clear

Search

Copy

Auto Scroll

Maximum

200 messages

===============================================================================
3.9.6 LEADER ELECTION
===============================================================================

Implement Leader Election visualization.

Display

Election State

Leader

Candidates

Election Count

Failover Count

Leader Lifetime

Election Timeline

Visualize

Primary

↓

Closed

↓

Election

↓

New Primary

↓

Running

Display

Transition

Timestamp

Duration

Leader ID

Explain

How Browser Session elects a leader.

How failover works.

How new tabs join.

===============================================================================
LIVE DEMO
===============================================================================

Create an interactive demonstration.

Instructions

Open this page.

Open another browser tab.

Open a third tab.

Observe

Leader Election

Connected Tabs

Broadcast Messages

Synchronization

Close the Primary Tab.

Observe automatic election.

Open additional tabs.

Observe automatic synchronization.

Everything should update live.

===============================================================================
BROWSER API INFORMATION
===============================================================================

Display browser APIs used.

Examples

BroadcastChannel

Storage Events

localStorage

sessionStorage

Display

Browser API

↓

Browser Session Capability

Explain

BroadcastChannel

Storage Event fallback

Cross-origin limitations

Same-origin requirements

Browser compatibility

===============================================================================
DEVELOPER EXAMPLES
===============================================================================

Provide production-ready examples.

Examples

Single WebSocket Owner

Cross-tab Logout

Authentication Sync

Shopping Cart Sync

Notification Sync

Theme Sync

Session Synchronization

Primary Polling

Shared Background Tasks

Leader Election

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

Primary Tab

Connected Tabs

Browser API Information

Middle

Broadcast Channel

Storage Events

Leader Election

Bottom

Tab Communication

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

Connect only through the Cross Tab module.

Do not create BroadcastChannel instances directly inside the Playground.

Do not listen to Storage Events directly.

Browser Session remains the single source of truth.

===============================================================================
SHARED COMPONENTS
===============================================================================

Reuse Playground UI components.

Examples

Card

Timeline

StatusBadge

StatisticCard

Table

JSONViewer

Toolbar

Panel

Alert

CodeBlock

Badge

Placeholder

ConnectionGraph

TabCard

Do not duplicate components.

===============================================================================
TESTING
===============================================================================

Create tests for

BroadcastChannel

Storage Events

Primary Tab

Secondary Tabs

Leader Election

Tab Communication

Browser Session integration

Developer Examples

Responsive layout

Coverage target

100%

===============================================================================
DOCUMENTATION
===============================================================================

Update

README.md

docs/cross-tab-playground.md

engineering/008-cross-tab-playground.md

Document

Architecture

Leader Election

Browser Session integration

BroadcastChannel

Storage Event fallback

Browser differences

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

Cross Tab Playground is complete only when

✓ Browser Session integrates successfully

✓ BroadcastChannel works

✓ Storage Event fallback demonstrated

✓ Primary Tab detection works

✓ Secondary Tabs displayed

✓ Leader Election works

✓ Live communication works

✓ Browser API information displayed

✓ Developer Examples complete

✓ Responsive layout complete

✓ Tests passing

✓ Documentation updated

===============================================================================
STOP CONDITION
===============================================================================

When Cross Tab Playground is complete

STOP.

Do NOT implement

Plugin Playground

Only complete the Cross Tab Playground.

===============================================================================
FINAL REVIEW
===============================================================================

Review

Developer Experience

Accessibility

Performance

Responsiveness

Maintainability

Educational Value

Browser Session Integration

Ensure developers understand

• BroadcastChannel

• Storage Event fallback

• Primary vs Secondary tabs

• Cross-tab messaging

• Leader Election

• Automatic failover

without requiring external documentation.