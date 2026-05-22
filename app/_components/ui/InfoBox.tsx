import type { ReactNode } from "react";
import { InfoBoxIcon } from "@/app/_components/ui/InfoBoxIcon";

type Variant = "info" | "warning" | "success" | "danger";

type Props = {
  variant?: Variant;
  children: ReactNode;
};

const variantClass: Record<Variant, string> = {
  info: "bg-info-light text-info",
  warning: "bg-warning-light text-warning",
  success: "bg-success-light text-success",
  danger: "bg-danger-light text-danger",
};

const icon: Record<Exclude<Variant, "info">, string> = {
  warning: "⚠",
  success: "✓",
  danger: "!",
};

export function InfoBox({ variant = "info", children }: Props) {
  return (
    <div
      className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-md text-[13px] leading-[1.5] ${variantClass[variant]}`}
    >
      {variant === "info" ? (
        <InfoBoxIcon />
      ) : (
        <span
          className="inline-flex size-4 shrink-0 items-center justify-center font-bold leading-none"
          aria-hidden="true"
        >
          {icon[variant]}
        </span>
      )}
      <span className="min-w-0 flex-1">{children}</span>
    </div>
  );
}
