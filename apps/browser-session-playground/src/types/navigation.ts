import type { ComponentType, ReactNode } from "react";

export type NavigationBadgeTone = "accent" | "default" | "info" | "warning";
export type NavigationIntent = "current" | "planned";

export interface NavigationBadge {
  readonly label: string;
  readonly tone: NavigationBadgeTone;
}

export interface NavigationItem {
  readonly badge?: NavigationBadge;
  readonly children?: readonly NavigationItem[];
  readonly description: string;
  readonly disabled?: boolean;
  readonly groupId: string;
  readonly icon: ComponentType<{ readonly className?: string }>;
  readonly id: string;
  readonly intent: NavigationIntent;
  readonly keywords?: readonly string[];
  readonly label: string;
  readonly path?: string;
  readonly shortLabel?: string;
}

export interface NavigationGroup {
  readonly description: string;
  readonly id: string;
  readonly items: readonly NavigationItem[];
  readonly label: string;
  readonly order: number;
}

export interface RouteDefinition {
  readonly description: string;
  readonly element: ReactNode;
  readonly groupId: string;
  readonly id: string;
  readonly index?: boolean;
  readonly keywords?: readonly string[];
  readonly label: string;
  readonly path?: string;
}
