import { onScopeDispose, ref } from "vue";

import { useBrowserLifecycle } from "./useBrowserLifecycle.js";

export function useVisibility() {
  const lifecycle = useBrowserLifecycle();
  const visibility = ref(lifecycle.value.getSnapshot().visibility);

  const unsubs = [
    lifecycle.value.on("page:visible", () => {
      visibility.value = "visible";
    }),
    lifecycle.value.on("page:hidden", () => {
      visibility.value = "hidden";
    }),
  ];

  onScopeDispose(() => {
    for (const unsub of unsubs) unsub();
  });

  return visibility;
}
