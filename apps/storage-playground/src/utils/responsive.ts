export const PLAYGROUND_BREAKPOINTS = {
  desktop: 1280,
  mobile: 768,
  tablet: 1024,
} as const;

export type ViewportCategory = "desktop" | "mobile" | "tablet";

export function getViewportCategory(width: number): ViewportCategory {
  if (width < PLAYGROUND_BREAKPOINTS.mobile) {
    return "mobile";
  }

  if (width < PLAYGROUND_BREAKPOINTS.desktop) {
    return "tablet";
  }

  return "desktop";
}
