# JOC ENGINEERING TASK
# Phase 3.7 — Idle Playground
# Application: Browser Session Playground

===============================================================================
ROLE
===============================================================================

You are acting as a Principal Frontend Engineer,
Browser Platform Engineer,
Developer Experience Engineer,
React Architect,
Software Architect,
Open Source Maintainer,
and Technical Documentation Engineer.

You are implementing the Idle Playground.

This page demonstrates the Browser Session Idle module.

Everything displayed must come from

@jayoncode/browser-session

No mocked timers.

No fake activity.

Everything must reflect the real Browser Session runtime.

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

✓ Idle Module

===============================================================================
OBJECTIVE
===============================================================================

Implement the complete Idle Playground.

The page should teach developers

• What "Idle" means

• What "Active" means

• How Browser Session detects inactivity

• Idle timeout behavior

• Browser limitations

• Best practices

The Playground becomes the official reference for the Idle module.

===============================================================================
OUTPUT
===============================================================================

Implement

src/pages/idle

===============================================================================
3.7.1 IDLE TIMER
===============================================================================

Create an Idle Timer card.

Display

Current Status

Active

Idle

Current Idle Timeout

Elapsed Time

Remaining Time

Last Activity Time

Last Idle Time

Current BrowserSession State

Provide

Countdown

Progress Bar

Status Badge

Timestamp

Duration

Realtime updates

Display timer updates every second.

===============================================================================
3.7.2 USER ACTIVITY
===============================================================================

Create a User Activity panel.

Display recent activity

Mouse Move

Mouse Click

Keyboard

Touch

Scroll

Wheel

Pointer

Visibility

Focus

Timestamp

Activity Source

Maintain

Recent Activity History

Maximum

100 records

Provide

Pause

Resume

Clear

Search

Newest first

Data must come from Browser Session.

===============================================================================
3.7.3 ACTIVE STATE
===============================================================================

Display the current activity state.

Show

Current State

Previous State

State Duration

Transition Count

Idle Threshold

Configured Timeout

Display timeline

Active

↓

Idle

↓

Active

↓

Idle

Show

Transition Number

Timestamp

Duration

===============================================================================
3.7.4 LIVE EVENTS
===============================================================================

Implement a live event stream.

Display

session:active

session:idle

activity:detected

activity:reset

Timer reset

Idle threshold reached

Display

Timestamp

Event

Payload Summary

Source

Auto-scroll

Pause

Resume

Clear

Search

Events must come from Browser Session.

===============================================================================
3.7.5 DEVELOPER EXAMPLES
===============================================================================

Provide production-ready examples.

Examples

Auto logout

Pause polling

Pause expensive rendering

Away status

Pause analytics

Screen saver

Session timeout warning

Auto save before logout

Suspend animations

Reduce CPU usage

Each example includes

Syntax-highlighted code

Explanation

Expected behavior

Copy button

All examples use

createBrowserSession()

===============================================================================
BROWSER API INFORMATION
===============================================================================

Create an informational panel.

Display

Configured Idle Timeout

Idle Detection Strategy

Supported Activity Sources

Idle Detection API Support

requestIdleCallback Support

Browser Compatibility

Clearly explain

Browser Session primarily detects idle state using activity heuristics.

The native Idle Detection API is optional and experimental.

Display

Browser Feature

↓

Browser Session Capability

Explain limitations of

Idle Detection API

requestIdleCallback

===============================================================================
LIVE DEMO
===============================================================================

Create an interactive demonstration.

Instructions

Move your mouse.

Press keyboard keys.

Scroll.

Wait until idle timeout expires.

Observe

Countdown

Status

Events

State changes

Timeline

Allow developers to

Configure timeout

10 seconds

30 seconds

1 minute

5 minutes

Custom

Restart timer

Reset activity

===============================================================================
LAYOUT
===============================================================================

Suggested layout

Top

Idle Timer

Current State

Browser API Information

Middle

User Activity

Live Events

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

Connect to the Idle module.

Do not detect browser activity directly inside the Playground.

Browser Session remains the single source of truth.

===============================================================================
SHARED COMPONENTS
===============================================================================

Reuse existing Playground components.

Examples

Card

StatisticCard

Timeline

StatusBadge

ProgressBar

CodeBlock

Toolbar

JSONViewer

Table

Alert

Panel

Placeholder

Do not duplicate UI.

===============================================================================
TESTING
===============================================================================

Create tests for

Idle Timer

User Activity

State changes

Countdown

Live Events

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

docs/idle-playground.md

engineering/006-idle-playground.md

Document

Architecture

Idle detection

Activity tracking

Timeout configuration

Browser Session integration

Browser API mapping

Limitations

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

Idle Playground is complete only when

✓ Browser Session integrates successfully

✓ Idle Timer updates live

✓ User Activity updates live

✓ Active State updates correctly

✓ Live Events stream correctly

✓ Browser API information displayed

✓ Timeout configuration works

✓ Developer Examples complete

✓ Responsive layout complete

✓ Tests passing

✓ Documentation updated

===============================================================================
STOP CONDITION
===============================================================================

When Idle Playground is complete

STOP.

Do NOT implement

Lifecycle Playground

Cross Tab Playground

Plugin Playground

Only complete the Idle Playground.

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

Confirm developers can understand

• Idle detection

• Activity tracking

• Idle timeout

• State transitions

• Browser limitations

• Best practices

without needing external documentation.