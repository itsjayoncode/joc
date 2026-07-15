# Visibility Examples

These examples cover the Visibility Module introduced in Phase `2.2.3`.

## Basic Session

See [`basic-session.ts`](./basic-session.ts).

Creates a lifecycle instance, starts it, reads snapshot visibility, and disposes it.

## Visibility Events

See [`visibility-events.ts`](./visibility-events.ts).

Subscribes to `page:visible` and `page:hidden`.

## Pause Work When Hidden

See [`pause-when-hidden.ts`](./pause-when-hidden.ts).

Shows how an app can pause work in response to `page:hidden`.

## Resume Work When Visible

See [`resume-when-visible.ts`](./resume-when-visible.ts).

Shows how an app can resume work in response to `page:visible`.

## Framework-Agnostic Adapter Pattern

See [`framework-agnostic.ts`](./framework-agnostic.ts).

Demonstrates wrapping Browser Lifecycle in a small host-facing controller without assuming React, Vue, or another framework.
