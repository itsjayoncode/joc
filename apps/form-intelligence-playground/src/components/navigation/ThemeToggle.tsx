import { useTheme } from "../../hooks/useTheme.js";
import { ThemeIcon } from "../../icons/AppIcons.js";

export interface ThemeToggleProps {
  readonly className?: string;
  readonly iconClassName?: string;
}

export function ThemeToggle({ className, iconClassName }: ThemeToggleProps) {
  const { preference, togglePreference } = useTheme();

  return (
    <button
      aria-label={`Cycle theme mode. Current mode: ${preference}.`}
      className={className}
      onClick={togglePreference}
      type="button"
    >
      <ThemeIcon className={iconClassName} />
    </button>
  );
}
