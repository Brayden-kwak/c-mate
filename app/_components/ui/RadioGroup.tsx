import type { Size } from "./types";

const sizeClass: Record<Size, string> = {
  sm: "h-8 px-2.5 text-xs",
  md: "h-9 xl:h-[38px] px-3 xl:px-3.5 text-[13px]",
  lg: "h-11 px-4 text-sm",
};

type Props = {
  name: string;
  options: string[];
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  size?: Size;
  "aria-required"?: boolean;
};

export const RadioGroup = ({
  name,
  options,
  value,
  onChange,
  disabled,
  size = "md",
  "aria-required": ariaRequired,
}: Props) => {
  return (
    <div
      role="radiogroup"
      aria-required={ariaRequired}
      className="flex flex-wrap gap-2"
    >
      {options.map((opt) => {
        const selected = value === opt;
        return (
          <label
            key={opt}
            className={[
              "inline-flex items-center justify-center rounded-md border select-none transition-all duration-fast ease-standard",
              sizeClass[size],
              selected
                ? "bg-primary border-primary text-white font-semibold hover:bg-primary-hover"
                : "bg-surface border-border text-text font-medium hover:bg-subtle hover:border-border-strong",
              disabled ? "opacity-50 pointer-events-none" : "cursor-pointer",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            <input
              type="radio"
              name={name}
              value={opt}
              checked={selected}
              onChange={() => onChange?.(opt)}
              disabled={disabled}
              className="sr-only"
            />
            {opt}
          </label>
        );
      })}
    </div>
  );
};
