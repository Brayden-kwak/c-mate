import type { InputHTMLAttributes } from "react";

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, "style" | "type"> & {
  label: string;
};

export function Radio({ label, id, className, ...rest }: Props) {
  const inputId = id ?? label;
  return (
    <label
      htmlFor={inputId}
      className={[
        "inline-flex items-center gap-2 cursor-pointer select-none",
        rest.disabled ? "opacity-50 cursor-not-allowed" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <input
        type="radio"
        id={inputId}
        className="accent-primary w-4 h-4 cursor-pointer"
        {...rest}
      />
      <span className="text-sm text-text">{label}</span>
    </label>
  );
}
