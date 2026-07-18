import { useEffect, useState } from "react";

import type { FormDevToolsInspector } from "@jayoncode/form-intelligence/devtools";

import { getFormDevTools } from "../lib/form-intelligence.js";

import type { FormInstance } from "../lib/form-intelligence.js";

export function useDevToolsInspector(
  forms: readonly FormInstance<Record<string, unknown>>[],
): FormDevToolsInspector {
  const [revision, setRevision] = useState(0);

  useEffect(() => {
    const unsubs = forms.map((form) =>
      form.subscribe(() => {
        setRevision((current) => current + 1);
      }),
    );

    return () => {
      for (const unsubscribe of unsubs) {
        unsubscribe();
      }
    };
  }, [forms]);

  void revision;
  return getFormDevTools();
}
