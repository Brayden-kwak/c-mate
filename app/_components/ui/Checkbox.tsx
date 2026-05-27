import type { InputHTMLAttributes } from "react";
import type { Size } from "./types";

const boxSizeClass: Record<Size, string> = {
  sm: "w-4 h-4",
  md: "w-[18px] h-[18px]",
  lg: "w-5 h-5",
};

const checkSizeClass: Record<Size, string> = {
  sm: "w-2.5 h-2.5",
  md: "w-[11px] h-[11px]",
  lg: "w-3 h-3",
};

type Props = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "style" | "type" | "size"
> & {
  label: string;
  size?: Size;
};

export const Checkbox = ({
  label,
  id,
  className,
  checked,
  disabled,
  size = "md",
  onChange,
  ...rest
}: Props) => {
  const inputId = id ?? label;
  return (
    <label
      htmlFor={inputId}
      className={[
        "inline-flex items-center gap-2 select-none",
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <input
        type="checkbox"
        id={inputId}
        className="sr-only"
        checked={checked}
        disabled={disabled}
        onChange={onChange}
        {...rest}
      />
      <span
        className={[
          "shrink-0 inline-flex items-center justify-center border rounded-[4px] transition-colors duration-fast ease-standard",
          boxSizeClass[size],
          checked
            ? "bg-primary border-primary"
            : "bg-surface border-border-strong",
        ].join(" ")}
        aria-hidden="true"
      >
        {checked && (
          <svg
            viewBox="0 0 24 24"
            className={checkSizeClass[size] + " text-white"}
            fill="none"
            stroke="currentColor"
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </span>
      <span className="text-sm text-text">{label}</span>
    </label>
  );
};
