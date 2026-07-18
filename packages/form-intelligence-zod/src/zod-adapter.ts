import type { SchemaAdapter } from "@jayoncode/form-intelligence";

import type { ZodType } from "zod";

function formatZodPath(path: readonly PropertyKey[]): string {
  if (path.length === 0) {
    return "_form";
  }

  return path.map((segment) => String(segment)).join(".");
}

export function zodAdapter(schema: ZodType): SchemaAdapter {
  return {
    async validate(values) {
      const result = await schema.safeParseAsync(values);
      if (result.success) {
        return {};
      }

      const errors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const path = formatZodPath(issue.path);
        if (!errors[path]) {
          errors[path] = issue.message;
        }
      }

      return errors;
    },
  };
}
