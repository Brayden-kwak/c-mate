import type { ReactNode } from "react";

type LabelWidth = "sm" | "md" | "lg";

const labelWidthClass: Record<LabelWidth, string> = {
  sm: "xl:grid-cols-[180px_1fr]",
  md: "xl:grid-cols-[260px_1fr]",
  lg: "xl:grid-cols-[320px_1fr]",
};

type Props = {
  label: string;
  required?: boolean;
  optional?: boolean;
  helper?: ReactNode;
  error?: string;
  labelAlign?: "start" | "center";
  labelBadge?: ReactNode;
  labelWidth?: LabelWidth;
  children: ReactNode;
};

export const Row = ({
  label,
  required,
  optional,
  helper,
  error,
  labelAlign,
  labelBadge,
  labelWidth = "md",
  children,
}: Props) => {
  const subtext = error ?? helper;
  const isError = !!error;
  const resolvedLabelAlign = labelAlign ?? (subtext ? "start" : "center");
  const labelColumnClass =
    resolvedLabelAlign === "center"
      ? "flex flex-col gap-1.5 xl:justify-center"
      : "flex flex-col gap-1.5";
  const rowClass = [
    "grid xl:gap-10 gap-3",
    labelWidthClass[labelWidth],
    resolvedLabelAlign !== "center" ? "" : "xl:items-center",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={rowClass}>
      <div className={labelColumnClass}>
        <div className="flex w-full items-center gap-1.5 flex-wrap">
          <span className="text-sm font-semibold text-text">{label}</span>
          {required && (
            <span className="text-danger font-bold" aria-hidden="true">
              *
            </span>
          )}
          {optional && (
            <span className="text-xs text-text-secondary font-medium">
              선택
            </span>
          )}
          {labelBadge && (
            <span className="ml-auto shrink-0 xl:hidden">{labelBadge}</span>
          )}
        </div>
        {labelBadge && <div className="hidden xl:block">{labelBadge}</div>}
        {subtext && (
          <p
            className={`text-[13px] leading-snug m-0 ${isError ? "text-danger" : "text-text-secondary"}`}
            role={isError ? "alert" : undefined}
          >
            {subtext}
          </p>
        )}
      </div>
      <div className="flex flex-col gap-2.5">{children}</div>
    </div>
  );
};
