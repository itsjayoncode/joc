# 009 API Design Guidelines

## Why This Document Exists

This document defines how public APIs should feel across the JOC ecosystem so packages are readable, predictable, and easy to learn.

## API Principles

- prefer readable names over short names
- avoid abbreviations unless they are industry-standard
- avoid hidden side effects
- prefer composition over inheritance
- avoid global mutable state
- make configuration explicit and minimal
- design for common use first, advanced use second

## Naming Rules

- use full descriptive names for exported functions and types
- choose verbs for actions and nouns for values
- avoid overloaded names that mean different things in different contexts
- prefer one primary mental model per package

## TypeScript Expectations

- every public API should have intentional types
- prefer narrow input and output types over overly permissive unions
- avoid `any`
- use generics only when they genuinely improve the API
- public error and event shapes should be typed if the package exposes them

## Behavior Rules

- public APIs should not mutate user input unless the name makes that behavior obvious
- avoid configuration objects with too many unrelated options
- prefer small composable functions over large "do everything" entrypoints
- avoid boolean parameters when an options object or separate function name would be clearer

## Breaking Change Rule

Do not change public API behavior in a backward-incompatible way without:

- a major version
- changelog coverage
- migration guidance when needed

## Internal API Guidance

Internal APIs may move faster than public APIs, but they should still:

- remain clearly separated from the public export surface
- use readable naming
- avoid leaking unstable contracts through public barrels
