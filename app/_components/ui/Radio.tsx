import type { InputHTMLAttributes } from "react";
import type { Size } from "./types";

const radioSizeClass: Record<Size, string> = {
  sm: "w-3.5 h-3.5",
  md: "w-4 h-4",
  lg: "w-5 h-5",
};

type Props = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "style" | "type" | "size"
> & {
  label: string;
  size?: Size;
};

export const Radio = ({
  label,
  id,
  className,
  size = "md",
  ...rest
}: Props) => {
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
        className={["accent-primary cursor-pointer", radioSizeClass[size]].join(
          " ",
        )}
        {...rest}
      />
      <span className="text-sm text-text">{label}</span>
    </label>
  );
};
