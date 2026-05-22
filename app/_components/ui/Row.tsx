import type { ReactNode } from "react";

type Props = {
  label: string;
  required?: boolean;
  optional?: boolean;
  helper?: ReactNode;
  error?: string;
  labelAlign?: "start" | "center";
  labelBadge?: ReactNode;
  children: ReactNode;
};

export function Row({ label, required, optional, helper, error, labelAlign, labelBadge, children }: Props) {
  const subtext = error ?? helper;
  const isError = !!error;
  const resolvedLabelAlign = labelAlign ?? (subtext ? "start" : "center");
  const labelColumnClass =
    resolvedLabelAlign === "center"
      ? "flex flex-col gap-1.5 xl:justify-center"
      : "flex flex-col gap-1.5";
  const rowClass =
    resolvedLabelAlign === "center"
      ? "grid xl:grid-cols-[260px_1fr] xl:gap-10 xl:items-center gap-3"
      : "grid xl:grid-cols-[260px_1fr] xl:gap-10 gap-3";

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
            <span className="text-xs text-text-secondary font-medium">선택</span>
          )}
          {labelBadge && <span className="ml-auto shrink-0 xl:hidden">{labelBadge}</span>}
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
}
