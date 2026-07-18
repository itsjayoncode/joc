import styles from "./IconButton.module.css";
import { classNames } from "../../utils/class-names.js";

import type { ButtonHTMLAttributes, PropsWithChildren } from "react";

export interface IconButtonProps
  extends PropsWithChildren, Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  readonly isActive?: boolean;
}

export function IconButton({
  children,
  className,
  isActive = false,
  type = "button",
  ...props
}: IconButtonProps) {
  return (
    <button
      className={classNames(styles.button, isActive && styles.active, className)}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
}
