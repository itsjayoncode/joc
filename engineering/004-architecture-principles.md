# 004 Architecture Principles

## Why This Document Exists

This document captures the non-negotiable architectural rules that keep JOC scalable as package count and contributor count both increase.

## Principles

### 1. Independence Over Convenience

Public packages should remain decoupled wherever possible. Internal convenience should not become public dependency pressure.

### 2. Internal Reuse Has a Home

When shared code becomes necessary **and** Architecture Convergence marks **Extract**, place it in `packages/shared` instead of copying it across packages or exposing an accidental public API. Until then, intentional duplication (Keep Local / Defer) is allowed. See [`engineering/ecosystem/`](./ecosystem/).

### 3. Structure Communicates Intent

Repository organization is part of engineering quality. A contributor should learn a great deal simply by reading the tree and the docs.

### 4. Scale Must Stay Predictable

Choices made for the first few packages should still make sense when the repository contains dozens of packages.

### 5. Tooling Should Follow Architecture

Tooling is important, but it should reinforce repository decisions rather than define them prematurely.
