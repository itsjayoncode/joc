# 004 Architecture Principles

## Why This Document Exists

This document captures the non-negotiable architectural rules that keep JOC scalable as package count and contributor count both increase.

## Principles

### 1. Independence Over Convenience

Public packages should remain decoupled wherever possible. Internal convenience should not become public dependency pressure.

### 2. Internal Reuse Has a Home

When shared code becomes necessary, it should be placed in `packages/shared` instead of being copied into many packages or exposed as an accidental public API.

### 3. Structure Communicates Intent

Repository organization is part of engineering quality. A contributor should learn a great deal simply by reading the tree and the docs.

### 4. Scale Must Stay Predictable

Choices made for the first few packages should still make sense when the repository contains dozens of packages.

### 5. Tooling Should Follow Architecture

Tooling is important, but it should reinforce repository decisions rather than define them prematurely.
