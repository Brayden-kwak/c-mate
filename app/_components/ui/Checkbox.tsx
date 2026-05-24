import type { InputHTMLAttributes } from "react";

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, "style" | "type"> & {
  label: string;
};

export function Checkbox({
  label,
  id,
  className,
  checked,
  disabled,
  onChange,
  ...rest
}: Props) {
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
          "w-[18px] h-[18px] shrink-0 inline-flex items-center justify-center border rounded-[4px] transition-colors duration-fast ease-standard",
          checked
            ? "bg-primary border-primary"
            : "bg-surface border-border-strong",
        ].join(" ")}
        aria-hidden="true"
      >
        {checked && (
          <svg
            viewBox="0 0 24 24"
            className="w-[11px] h-[11px] text-white"
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
}
