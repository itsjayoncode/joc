# JOC ENGINEERING TASK
# Phase 3.2 — Playground Core (Application Shell)
# Application: Browser Session Playground

===============================================================================
ROLE
===============================================================================

You are acting as a Principal Frontend Architect,
Senior React Engineer,
Developer Experience Engineer,
Design System Engineer,
Software Architect,
Open Source Maintainer,
Accessibility Specialist,
and Performance Engineer.

You are implementing the Browser Session Playground.

This is NOT a demo.

This is the permanent Playground application that will evolve together with
Browser Session.

Every future Browser Session module will integrate into this application.

Assume this project will be maintained for many years.

Everything must be production quality.

===============================================================================
DEPENDENCIES
===============================================================================

Read and follow

Phase 3.1 Playground Foundation

Do not redesign the architecture.

Follow every engineering decision.

===============================================================================
OBJECTIVE
===============================================================================

Build the complete Playground Application Shell.

After this milestone finishes developers should be able to run

pnpm dev

and immediately have

• Navigation

• Layout

• Routing

• Theme

• Sidebar

• Header

• Placeholder Pages

Everything should be ready for Browser Session modules.

Do NOT implement Browser Session features yet.

===============================================================================
OUTPUT
===============================================================================

Implement

apps/browser-session-playground

===============================================================================
3.2.1 VITE APPLICATION
===============================================================================

Configure the application.

Requirements

• React

• TypeScript

• Vite

• pnpm Workspace

• React Router

• Vitest

• ESLint

• Prettier

• Absolute imports

• Environment variables

• Build configuration

• Development configuration

• Production configuration

• Hot Module Replacement

Configure the Playground to consume the local workspace package

@jayoncode/browser-session

Never install the package from npm.

===============================================================================
3.2.2 APPLICATION SHELL
===============================================================================

Implement AppShell.

Responsibilities

Application Layout

Route Rendering

Global Providers

Theme Provider

Playground Provider

Error Boundary

Loading Boundary

Status Bar

Footer

Browser Session Version

AppShell becomes the permanent root layout.

Future pages must never duplicate layout code.

===============================================================================
3.2.3 NAVIGATION
===============================================================================

Implement a configuration-driven navigation system.

Do NOT hardcode menu items.

Navigation should support

Dashboard

Visibility

Focus

Connectivity

Idle

Lifecycle

Cross Tab

Plugins

Events

Configuration

Performance

Developer Tools

Settings

About

Support

Icons

Groups

Ordering

Badges

Disabled pages

Future nested navigation

Only Dashboard should contain actual content.

Everything else should use placeholders.

===============================================================================
3.2.4 SIDEBAR
===============================================================================

Implement Sidebar.

Features

Collapsible

Expandable

Responsive

Search (placeholder)

Navigation groups

Active page

Module grouping

Pinned footer

Future version display

Desktop

Persistent

Tablet

Collapsible

Mobile

Drawer

===============================================================================
3.2.5 HEADER
===============================================================================

Implement Header.

Include

Application Logo

Application Name

Current Page

Breadcrumbs

Theme Toggle

Browser Session Version

Playground Version

Toolbar Slot

Future Search Slot

Future Action Slot

Header should remain reusable.

===============================================================================
3.2.6 THEME SYSTEM
===============================================================================

Implement a complete theme system.

Support

Light

Dark

System

Implement

ThemeProvider

ThemeContext

ThemeToggle

Persistent preferences

Use CSS variables.

Create design tokens.

No hardcoded colors.

Prepare for future custom themes.

===============================================================================
3.2.7 LAYOUT COMPONENTS
===============================================================================

Create reusable layout components.

Examples

AppShell

Page

PageHeader

PageContent

Card

Panel

Section

Toolbar

Divider

Badge

StatusIndicator

EmptyState

Placeholder

LoadingState

ErrorState

Container

Grid

Stack

Flex

These become the Playground design system.

===============================================================================
3.2.8 PLAYGROUND CONTEXT
===============================================================================

Implement Playground Context.

Responsibilities

Current Page

Developer Preferences

Debug Mode

Sidebar State

Theme

Notifications

Recent Activity

Future Browser Session Instance

This context manages the Playground.

NOT Browser Session.

===============================================================================
3.2.9 SHARED UI COMPONENTS
===============================================================================

Create reusable UI components.

Examples

Button

IconButton

Badge

Chip

Tag

Alert

Banner

Card

StatisticCard

Tabs

Accordion

CodeBlock

JSONViewer

Table

Tooltip

Popover

Dialog

Toast

Spinner

Skeleton

StatusBadge

EmptyState

Placeholder

These should remain generic.

No Browser Session logic.

===============================================================================
3.2.10 RESPONSIVE LAYOUT
===============================================================================

Implement responsive behavior.

Support

Desktop

Tablet

Mobile

Sidebar

Desktop

Persistent

Tablet

Collapsible

Mobile

Drawer

Ensure

No horizontal scrolling

Good spacing

Responsive typography

Responsive navigation

Accessible touch targets

===============================================================================
ROUTING
===============================================================================

Implement routing.

Routes

/

Dashboard

/visibility

/focus

/connectivity

/idle

/lifecycle

/cross-tab

/plugins

/events

/configuration

/performance

/developer-tools

/settings

/about

Unknown routes

404

Dashboard should display

Browser Session Playground

Everything else should display

Coming Soon

using a shared Placeholder component.

Organize routes for future nested layouts.

===============================================================================
DESIGN SYSTEM
===============================================================================

Design language

Modern

Minimal

Developer-focused

Professional

Fast

Accessible

No heavy UI framework.

No Material UI.

No Ant Design.

Build lightweight reusable components.

===============================================================================
TESTING
===============================================================================

Create tests for

Routing

Theme

Sidebar

Header

Navigation

Context

Responsive utilities

Shared components

Error Boundary

Coverage target

100%

===============================================================================
DOCUMENTATION
===============================================================================

Update

README.md

docs/playground-core.md

engineering/001-playground-core.md

Document

Architecture

Routing

Layout

Theme

Component Standards

Folder Structure

Developer Workflow

===============================================================================
QUALITY REQUIREMENTS
===============================================================================

Every file must satisfy

✓ Strict TypeScript

✓ React Best Practices

✓ ESLint Clean

✓ Prettier Clean

✓ Accessible

✓ Responsive

✓ Small Components

✓ No Circular Dependencies

✓ Tree Shakeable

✓ Well Documented

===============================================================================
ACCEPTANCE CRITERIA
===============================================================================

Playground Core is complete only when

✓ Playground launches successfully

✓ Routing works

✓ AppShell complete

✓ Sidebar complete

✓ Header complete

✓ Theme system works

✓ Playground Context implemented

✓ Shared UI library created

✓ Responsive layout complete

✓ Placeholder pages created

✓ Tests passing

✓ Documentation updated

===============================================================================
STOP CONDITION
===============================================================================

When Playground Core is complete

STOP.

Do NOT implement

Dashboard widgets

Visibility UI

Focus UI

Connectivity UI

Idle UI

Lifecycle UI

Cross Tab UI

Plugin UI

Browser Session integration

These belong to later phases.

===============================================================================
FINAL REVIEW
===============================================================================

Review

Architecture

Folder Structure

Developer Experience

Accessibility

Responsiveness

Performance

Component Reusability

Maintainability

Scalability

The Playground should now feel like a professional developer tool rather than a
demo application.

Future Browser Session modules should integrate without requiring any
architectural changes.