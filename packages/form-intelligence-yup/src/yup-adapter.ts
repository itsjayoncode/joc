import { ValidationError, type AnySchema } from "yup";

import type { SchemaAdapter } from "@jayoncode/form-intelligence";

/**
 * Yup uses `friends[0].name`; Form Intelligence field paths use `friends.0.name`.
 */
export function formatYupPath(path: string | undefined): string {
  if (!path) {
    return "_form";
  }

  return path.replace(/\[(\d+)\]/g, ".$1");
}

function mapYupErrors(error: ValidationError): Record<string, string> {
  const errors: Record<string, string> = {};
  const issues = error.inner.length > 0 ? error.inner : [error];

  for (const issue of issues) {
    const path = formatYupPath(issue.path);
    if (!errors[path]) {
      errors[path] = issue.message;
    }
  }

  return errors;
}

export function yupAdapter(schema: AnySchema): SchemaAdapter {
  return {
    async validate(values) {
      try {
        await schema.validate(values, { abortEarly: false, strict: false });
        return {};
      } catch (error) {
        if (!ValidationError.isError(error)) {
          throw error;
        }

        return mapYupErrors(error);
      }
    },
  };
}
