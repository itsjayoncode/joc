---
title: Object Diff
description: Object Diff package overview.
---

# Object Diff

`@jayoncode/object-diff` compares structured data, reports detailed changes, and generates JSON Patch operations.

## Install

```bash
npm install @jayoncode/object-diff
```

## Quick start

```ts
import { diff } from "@jayoncode/object-diff";

const result = diff({ name: "John" }, { name: "Jane" });
console.log(result.changes);
```

## Playground

Explore comparisons live in the [Object Diff Playground](/packages/object-diff/playground/playground).

