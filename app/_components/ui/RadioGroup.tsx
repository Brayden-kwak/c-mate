type Props = {
  name: string;
  options: string[];
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  "aria-required"?: boolean;
};

export function RadioGroup({
  name,
  options,
  value,
  onChange,
  disabled,
  "aria-required": ariaRequired,
}: Props) {
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
              "inline-flex items-center justify-center px-3 xl:px-3.5 h-9 xl:h-[38px] rounded-md border text-[13px] select-none transition-all duration-fast ease-standard",
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
}
