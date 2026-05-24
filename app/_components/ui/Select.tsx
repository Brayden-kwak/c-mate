import type { SelectHTMLAttributes } from "react";
import type { FieldState, Size } from "./types";

type Props = Omit<SelectHTMLAttributes<HTMLSelectElement>, "style" | "size"> & {
  size?: Size;
  state?: FieldState;
  layout?: "full" | "auto";
  fieldWidth?: "salary";
  wrapperClassName?: string;
};

const sizeClass: Record<Size, string> = {
  sm: "h-8 pl-2.5 pr-9 text-sm",
  md: "h-10 pl-3 pr-10 text-sm",
  lg: "h-12 pl-4 pr-11 text-base",
};

const stateClass: Record<FieldState, string> = {
  default:
    "border-border bg-surface text-text focus:border-primary focus:outline-2 focus:outline-primary focus:outline-offset-1",
  error:
    "border-danger bg-surface text-text focus:border-danger focus:outline-2 focus:outline-danger focus:outline-offset-1",
  disabled: "border-border bg-disabled text-text-tertiary cursor-not-allowed",
};

const layoutClass: Record<NonNullable<Props["layout"]>, string | undefined> = {
  full: "w-full",
  auto: undefined,
};

const fieldWidthClass: Record<NonNullable<Props["fieldWidth"]>, string> = {
  salary: "w-[var(--spacing-field-salary)]",
};

export function Select({
  size = "md",
  state = "default",
  layout = "full",
  fieldWidth,
  disabled,
  className,
  wrapperClassName,
  children,
  ...rest
}: Props) {
  const resolvedState: FieldState = disabled ? "disabled" : state;
  return (
    <div
      className={[
        "relative",
        fieldWidth ? fieldWidthClass[fieldWidth] : layoutClass[layout],
        wrapperClassName,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <select
        className={[
          "block w-full appearance-none border rounded-md transition-colors duration-fast ease-standard",
          sizeClass[size],
          stateClass[resolvedState],
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        aria-invalid={resolvedState === "error" || undefined}
        disabled={disabled}
        {...rest}
      >
        {children}
      </select>
      <svg
        className={[
          "pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2",
          resolvedState === "disabled"
            ? "text-text-tertiary"
            : "text-text-secondary",
        ].join(" ")}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </div>
  );
}
