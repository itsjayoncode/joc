import { useEffect, useState } from "react";

import type { FormDevToolsInspector } from "@jayoncode/form-intelligent/devtools";

import { getFormDevTools } from "../lib/form-intelligent.js";

import type { FormInstance } from "../lib/form-intelligent.js";

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
