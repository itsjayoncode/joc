# JOC ENGINEERING TASK
# Phase 3.1 — Playground Foundation
# Package: @jayoncode/browser-session

===============================================================================
ROLE
===============================================================================

You are acting as a Principal Frontend Architect,
Developer Experience Engineer,
Software Architect,
React Engineer,
Open Source Maintainer,
UI System Designer,
and Documentation Engineer.

You are NOT building a demo.

You are building the official Browser Session Playground.

This application will become

• Development Environment

• Integration Test Environment

• Interactive Documentation

• Product Showcase

• Manual QA Environment

• Future Documentation Website Demo

Assume this application will live alongside Browser Session for many years.

Everything should be production quality.

===============================================================================
PROJECT
===============================================================================

Create a standalone Playground application inside the JOC monorepo.

This Playground will be used to test every Browser Session module as it is built.

Every future module must plug into this Playground.

===============================================================================
OBJECTIVE
===============================================================================

Implement ONLY the Playground Foundation.

Do NOT implement Visibility pages.

Do NOT implement Focus pages.

Do NOT implement Connectivity pages.

Do NOT implement browser-specific demonstrations yet.

Only build the Playground infrastructure.

===============================================================================
OUTPUT
===============================================================================

Create

apps/

browser-session-playground/

===============================================================================
3.1.1 PRODUCT VISION
===============================================================================

Design the Playground as an engineering tool.

Goals

• Fast development

• Excellent developer experience

• Modular

• Easy to extend

• Interactive

• Production quality

The Playground must become the single source of truth for manually testing
Browser Session.

===============================================================================
3.1.2 ARCHITECTURE
===============================================================================

Design a scalable application architecture.

Separate

Application

UI

Playground Logic

Browser Session Integration

Shared Components

Routing

Services

Hooks

Utilities

Future modules must plug into this architecture without modification.

===============================================================================
3.1.3 FOLDER STRUCTURE
===============================================================================

Create a scalable folder structure.

Example

src/

    app/

    pages/

    layouts/

    components/

    hooks/

    services/

    providers/

    contexts/

    routes/

    assets/

    styles/

    utils/

    types/

    lib/

    constants/

    icons/

public/

Document every folder.

Each folder must have one responsibility.

===============================================================================
3.1.4 TECHNOLOGY STACK
===============================================================================

Use

• React

• TypeScript

• Vite

• React Router

• CSS Modules OR Tailwind (choose one and justify)

• Vitest

• ESLint

• Prettier

• pnpm workspace

Avoid unnecessary dependencies.

Prefer native browser APIs.

Keep the application lightweight.

===============================================================================
3.1.5 ROUTING
===============================================================================

Implement routing.

Initial pages

/

Dashboard

/about

/settings

/not-found

Create a routing architecture that easily supports

/visibility

/focus

/connectivity

/idle

/lifecycle

/cross-tab

/plugins

/events

/configuration

without future restructuring.

Use React Router with a maintainable route organization.  [oai_citation:1‡React Router](https://reactrouter.com/tutorials/quickstart?utm_source=chatgpt.com)

===============================================================================
3.1.6 STATE MANAGEMENT
===============================================================================

Implement Playground state.

This is NOT Browser Session state.

This is application UI state.

Examples

Theme

Sidebar

Developer Preferences

Current Playground

Navigation

Recent Activity

Do NOT introduce Redux.

Use React Context where appropriate.

Keep state simple.

===============================================================================
3.1.7 THEME SYSTEM
===============================================================================

Implement a theme foundation.

Support

Light

Dark

System

Create

ThemeProvider

Theme Context

Theme Toggle

Persistent preference

Design tokens

The UI should be clean and modern.

===============================================================================
3.1.8 LAYOUT
===============================================================================

Create the application layout.

Components

AppShell

Header

Sidebar

Content

Footer

PageContainer

StatusBar

The layout must support future module pages without redesign.

Responsive by default.

===============================================================================
3.1.9 COMPONENT STANDARDS
===============================================================================

Define component standards.

Requirements

Reusable

Accessible

Composable

Strongly Typed

Small

Single Responsibility

Naming conventions

Folder conventions

File conventions

Export conventions

Create shared UI primitives for future use.

===============================================================================
3.1.10 DEVELOPMENT ROADMAP
===============================================================================

Document the implementation roadmap.

Phase 3.2

Core Playground

↓

Phase 3.3

Dashboard

↓

Phase 3.4

Visibility

↓

Phase 3.5

Focus

↓

Phase 3.6

Connectivity

↓

Phase 3.7

Idle

↓

Phase 3.8

Lifecycle

↓

Phase 3.9

Cross Tab

↓

Phase 3.10

Plugins

↓

Phase 3.11

Event Explorer

↓

Phase 3.12

State Explorer

↓

Phase 3.13

Configuration

↓

Phase 3.14

Performance

↓

Phase 3.15

Developer Tools

↓

Phase 3.16

Framework Examples

↓

Phase 3.17

Documentation Integration

===============================================================================
DOCUMENTATION
===============================================================================

Create

README.md

docs/playground.md

engineering/

000-playground-foundation.md

Document

Architecture

Folder Structure

Technology Choices

Routing

Theme

Layout

Component Standards

Development Workflow

===============================================================================
QUALITY REQUIREMENTS
===============================================================================

Every file must satisfy

✓ Strict TypeScript

✓ React Best Practices

✓ ESLint Clean

✓ Prettier Clean

✓ Responsive

✓ Accessible

✓ No Circular Dependencies

✓ Strong Folder Organization

✓ Fully Documented

===============================================================================
ACCEPTANCE CRITERIA
===============================================================================

The Playground Foundation is complete only when

✓ Vite application created

✓ React configured

✓ TypeScript configured

✓ Routing implemented

✓ Layout implemented

✓ Theme system implemented

✓ Folder structure complete

✓ Shared components scaffolded

✓ Documentation written

✓ Engineering documentation complete

✓ Ready for future Browser Session modules

===============================================================================
STOP CONDITION
===============================================================================

When Playground Foundation is complete

STOP.

Do NOT build

Dashboard

Visibility

Focus

Connectivity

Idle

Lifecycle

Cross Tab

Plugins

Only deliver the Playground Foundation.

===============================================================================
FINAL REVIEW
===============================================================================

Review the Playground architecture.

Verify

• Scalability

• Maintainability

• Developer Experience

• Responsiveness

• Accessibility

• Future extensibility

The resulting Playground should be capable of supporting every future Browser
Session module without architectural changes.