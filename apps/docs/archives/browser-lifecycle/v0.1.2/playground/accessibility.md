---
title: Accessibility
description: Interactive playground documentation for Accessibility.
---

# Accessibility Checklist — v1.0.0

## Verified

- [x] Semantic landmarks (`header`, `footer`, `nav`, `main`)
- [x] Keyboard-accessible theme toggle and mobile menu button with `aria-label`
- [x] Focusable interactive controls (buttons, inputs, links)
- [x] Color contrast via design tokens (light and dark themes)
- [x] Responsive typography and touch-friendly toolbar buttons
- [x] Progress bar on Idle page includes `role="progressbar"` and ARIA value attributes
- [x] Search inputs use `type="search"`

## Known limitations

- Event timelines use visual markers without live region announcements
- Module status uses color-coded badges without supplementary text in all cases
- No automated axe-core CI integration yet

## Recommendations

- Add `aria-live="polite"` to event log panels in a future release
- Run manual screen reader passes (VoiceOver, NVDA) before major releases
- Add reduced-motion media query support for animated transitions

## WCAG target

Aim for WCAG 2.1 Level AA for navigation, forms, and interactive module controls.
