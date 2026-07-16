import {
  getDotPath,
  safeParseAsync,
  type BaseIssue,
  type GenericSchema,
  type GenericSchemaAsync,
} from "valibot";

import type { SchemaAdapter } from "@jayoncode/form-intelligent";

type ValibotSchema = GenericSchema | GenericSchemaAsync;

function formatValibotPath(issue: BaseIssue<unknown>): string {
  const path = getDotPath(issue);
  return path ?? "_form";
}

export function valibotAdapter(schema: ValibotSchema): SchemaAdapter {
  return {
    async validate(values) {
      const result = await safeParseAsync(schema, values);

      if (result.success) {
        return {};
      }

      const errors: Record<string, string> = {};
      for (const issue of result.issues) {
        const path = formatValibotPath(issue);
        if (!errors[path]) {
          errors[path] = issue.message;
        }
      }

      return errors;
    },
  };
}
