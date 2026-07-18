import type { PropsWithChildren, ReactElement, SVGProps } from "react";

type IconProps = PropsWithChildren<Omit<SVGProps<SVGSVGElement>, "children">>;

function BaseIcon(props: IconProps): ReactElement {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
      width="1.25em"
      height="1.25em"
      {...props}
    />
  );
}

export function DashboardIcon(props: IconProps): ReactElement {
  return (
    <BaseIcon {...props}>
      <path d="M4.75 4.75h6.5v6.5h-6.5zM12.75 4.75h6.5v10.5h-6.5zM4.75 13.25h6.5v6h-6.5zM12.75 16.75h6.5v2.5h-6.5z" />
    </BaseIcon>
  );
}

export function InfoIcon(props: IconProps): ReactElement {
  return (
    <BaseIcon {...props}>
      <circle cx="12" cy="12" r="8.25" />
      <path d="M12 10.25v5.25M12 8.15h.01" />
    </BaseIcon>
  );
}

export function SettingsIcon(props: IconProps): ReactElement {
  return (
    <BaseIcon {...props}>
      <path d="M12 8.25a3.75 3.75 0 1 0 0 7.5 3.75 3.75 0 0 0 0-7.5Z" />
      <path d="M19.25 13.25v-2.5l-1.88-.54a5.89 5.89 0 0 0-.52-1.24l.96-1.72-1.76-1.77-1.73.96c-.4-.22-.81-.39-1.24-.52L12.75 3.75h-2.5l-.54 1.88c-.43.13-.84.3-1.24.52l-1.72-.96-1.77 1.77.96 1.72c-.22.4-.39.81-.52 1.24l-1.88.54v2.5l1.88.54c.13.43.3.84.52 1.24l-.96 1.72 1.77 1.77 1.72-.96c.4.22.81.39 1.24.52l.54 1.88h2.5l.54-1.88c.43-.13.84-.3 1.24-.52l1.73.96 1.76-1.77-.96-1.72c.22-.4.39-.81.52-1.24l1.88-.54Z" />
    </BaseIcon>
  );
}

export function ThemeIcon(props: IconProps): ReactElement {
  return (
    <BaseIcon {...props}>
      <path d="M12 3.75a8.25 8.25 0 1 0 8.25 8.25A6.5 6.5 0 0 1 12 3.75Z" />
    </BaseIcon>
  );
}

export function MenuIcon(props: IconProps): ReactElement {
  return (
    <BaseIcon {...props}>
      <path d="M4.75 7.25h14.5M4.75 12h14.5M4.75 16.75h14.5" />
    </BaseIcon>
  );
}

export function CloseIcon(props: IconProps): ReactElement {
  return (
    <BaseIcon {...props}>
      <path d="m7.25 7.25 9.5 9.5M16.75 7.25l-9.5 9.5" />
    </BaseIcon>
  );
}

export function CompassIcon(props: IconProps): ReactElement {
  return (
    <BaseIcon {...props}>
      <circle cx="12" cy="12" r="8.25" />
      <path d="m14.85 9.15-4 1.95-1.7 3.75 4-1.95 1.7-3.75Z" />
    </BaseIcon>
  );
}

export function FocusIcon(props: IconProps): ReactElement {
  return (
    <BaseIcon {...props}>
      <circle cx="12" cy="12" r="3.5" />
      <path d="M12 4v2.5M12 17.5V20M4 12h2.5M17.5 12H20M6.35 6.35l1.8 1.8M15.85 15.85l1.8 1.8M17.65 6.35l-1.8 1.8M8.15 15.85l-1.8 1.8" />
    </BaseIcon>
  );
}

export function WifiIcon(props: IconProps): ReactElement {
  return (
    <BaseIcon {...props}>
      <path d="M4.75 9.5a11.25 11.25 0 0 1 14.5 0M7.5 12.25a7.5 7.5 0 0 1 9 0M10 15a3.75 3.75 0 0 1 4 0" />
      <circle cx="12" cy="18" r="0.9" fill="currentColor" stroke="none" />
    </BaseIcon>
  );
}

export function ActivityIcon(props: IconProps): ReactElement {
  return (
    <BaseIcon {...props}>
      <path d="M4.5 12h3.5l2-4.75L13.5 17l2.25-5h3.75" />
      <path d="M4.5 5.5h15M4.5 18.5h15" opacity="0.35" />
    </BaseIcon>
  );
}

export function LifecycleIcon(props: IconProps): ReactElement {
  return (
    <BaseIcon {...props}>
      <path d="M7.5 7.25h8.25l-1.75-1.75M16.5 16.75H8.25l1.75 1.75" />
      <path d="M16 7.5a5.75 5.75 0 0 1 0 9M8 16.5a5.75 5.75 0 0 1 0-9" />
    </BaseIcon>
  );
}

export function PluginsIcon(props: IconProps): ReactElement {
  return (
    <BaseIcon {...props}>
      <path d="M8.5 7.5V5.75a2.25 2.25 0 1 1 4.5 0V7.5" />
      <path d="M15.5 16.5v1.75a2.25 2.25 0 1 1-4.5 0V16.5" />
      <path d="M7.75 8.25h8.5v7.5h-8.5z" />
    </BaseIcon>
  );
}

export function EventsIcon(props: IconProps): ReactElement {
  return (
    <BaseIcon {...props}>
      <circle cx="6.5" cy="7" r="1.25" fill="currentColor" stroke="none" />
      <circle cx="17.5" cy="12" r="1.25" fill="currentColor" stroke="none" />
      <circle cx="8.5" cy="17" r="1.25" fill="currentColor" stroke="none" />
      <path d="M7.75 7.6 16.2 11.4M16.65 13.1 9.35 15.9" />
    </BaseIcon>
  );
}

export function PerformanceIcon(props: IconProps): ReactElement {
  return (
    <BaseIcon {...props}>
      <path d="M6.5 17.5a7.8 7.8 0 1 1 11 0" />
      <path d="m12 12 4.5-3.25" />
      <circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none" />
    </BaseIcon>
  );
}

export function ToolsIcon(props: IconProps): ReactElement {
  return (
    <BaseIcon {...props}>
      <path d="m14.75 5.25 4 4-8.9 8.9-4.6.6.6-4.6 8.9-8.9Z" />
      <path d="m13.25 6.75 4 4" />
    </BaseIcon>
  );
}

export function SupportIcon(props: IconProps): ReactElement {
  return (
    <BaseIcon {...props}>
      <path d="M12 18.25v-.25c0-1.9 2.75-2.3 2.75-5a2.75 2.75 0 1 0-5.5 0" />
      <path d="M9.25 18.25h5.5" />
      <circle cx="12" cy="6.75" r="3.25" />
    </BaseIcon>
  );
}
