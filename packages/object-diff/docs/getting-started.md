# Getting Started

```bash
npm install @jayoncode/object-diff
```

```ts
import { diff } from "@jayoncode/object-diff";

const result = diff({ name: "John" }, { name: "Jane" });
console.log(result.changes);
```
