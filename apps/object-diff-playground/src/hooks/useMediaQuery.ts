import { useEffect, useState } from "react";

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => getInitialValue(query));

  useEffect(() => {
    if (typeof globalThis.matchMedia !== "function") {
      return undefined;
    }

    const mediaQuery = globalThis.matchMedia(query);
    const update = (event: MediaQueryListEvent | MediaQueryList): void => {
      setMatches(event.matches);
    };

    update(mediaQuery);
    mediaQuery.addEventListener("change", update);

    return (): void => {
      mediaQuery.removeEventListener("change", update);
    };
  }, [query]);

  return matches;
}

function getInitialValue(query: string): boolean {
  if (typeof globalThis.matchMedia !== "function") {
    return false;
  }

  return globalThis.matchMedia(query).matches;
}
