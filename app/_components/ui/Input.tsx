import type { InputHTMLAttributes, ReactNode } from "react";
import type { FieldState, Size } from "./types";

type Props = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "style" | "size" | "prefix"
> & {
  size?: Size;
  state?: FieldState;
  layout?: "full" | "fill" | "auto";
  fieldWidth?: "height" | "heightCompact" | "major" | "photobook";
  suffix?: string;
  prefix?: ReactNode;
  wrapperClassName?: string;
};

const sizeClass: Record<Size, string> = {
  sm: "h-9 px-2.5 text-sm gap-1.5",
  md: "h-[42px] px-3 text-sm gap-2",
  lg: "h-12 px-4 text-base gap-2",
};

const stateClass: Record<FieldState, string> = {
  default:
    "border-border bg-surface focus-within:border-primary focus-within:shadow-[0_0_0_3px_var(--color-primary-50)]",
  error:
    "border-danger bg-surface focus-within:border-danger focus-within:shadow-[0_0_0_3px_var(--color-danger-light)]",
  disabled: "border-border bg-disabled",
};

const layoutClass: Record<NonNullable<Props["layout"]>, string | undefined> = {
  full: "w-full",
  fill: "flex-1 min-w-0",
  auto: undefined,
};

const fieldWidthClass: Record<NonNullable<Props["fieldWidth"]>, string> = {
  height: "w-[var(--spacing-field-height)]",
  heightCompact: "max-w-[var(--spacing-field-height-compact)]",
  major: "w-[var(--spacing-field-major)] shrink-0",
  photobook: "w-full",
};

export function Input({
  size = "md",
  state = "default",
  layout = "full",
  fieldWidth,
  suffix,
  prefix,
  wrapperClassName,
  className,
  disabled,
  ...rest
}: Props) {
  const resolvedState: FieldState = disabled ? "disabled" : state;

  return (
    <div
      className={[
        "flex items-center border rounded-md transition-colors duration-fast ease-standard",
        fieldWidth ? fieldWidthClass[fieldWidth] : layoutClass[layout],
        sizeClass[size],
        stateClass[resolvedState],
        wrapperClassName,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {prefix}
      <input
        className={[
          "flex-1 min-w-0 border-none outline-none bg-transparent font-sans text-text placeholder:text-text-tertiary disabled:text-text-tertiary",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        aria-invalid={resolvedState === "error" || undefined}
        disabled={disabled}
        {...rest}
      />
      {suffix && (
        <span className="shrink-0 text-sm text-text-secondary font-medium">
          {suffix}
        </span>
      )}
    </div>
  );
}
