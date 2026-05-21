import type { ButtonHTMLAttributes, ReactNode } from "react";
import type { ButtonVariant, Size } from "./types";

type Props = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "style"> & {
  variant?: ButtonVariant;
  size?: Size;
  layout?: "auto" | "full" | "fill";
  children: ReactNode;
};

const variantClass: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-white hover:bg-primary-hover disabled:bg-disabled disabled:text-text-tertiary",
  secondary:
    "bg-surface text-text border border-border-strong hover:bg-subtle hover:border-border-strong disabled:bg-disabled disabled:text-text-tertiary",
  tertiary:
    "bg-transparent text-text-secondary hover:bg-subtle hover:text-text disabled:text-text-tertiary",
  danger:
    "bg-danger text-white hover:bg-danger-hover disabled:bg-disabled disabled:text-text-tertiary",
  icon: "bg-surface border border-border w-9 h-9 p-0 rounded-[6px] hover:bg-subtle hover:border-border-strong",
};

const sizeClass: Record<Size, string> = {
  sm: "text-[13px] h-8 px-3 rounded-md",
  md: "text-sm h-10 px-4 rounded-md",
  lg: "text-[15px] h-11 px-5 rounded-md",
};

const layoutClass: Record<NonNullable<Props["layout"]>, string | undefined> = {
  auto: undefined,
  full: "w-full",
  fill: "flex-1",
};

export function Button({
  variant = "primary",
  size = "md",
  layout = "auto",
  className,
  children,
  ...rest
}: Props) {
  const base =
    "inline-flex items-center justify-center font-semibold transition-colors duration-base ease-standard focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 disabled:cursor-not-allowed";
  return (
    <button
      className={[base, variantClass[variant], sizeClass[size], layoutClass[layout], className]
        .filter(Boolean)
        .join(" ")}
      {...rest}
    >
      {children}
    </button>
  );
}
