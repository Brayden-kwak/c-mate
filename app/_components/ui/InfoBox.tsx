import type { ReactNode } from "react";

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

const icon: Record<Variant, string> = {
  info: "ⓘ",
  warning: "⚠",
  success: "✓",
  danger: "!",
};

export function InfoBox({ variant = "info", children }: Props) {
  return (
    <div
      className={`flex items-start gap-2.5 px-3.5 py-2.5 rounded-md text-[13px] leading-relaxed ${variantClass[variant]}`}
    >
      <span className="shrink-0 font-bold mt-px">{icon[variant]}</span>
      <span>{children}</span>
    </div>
  );
}
