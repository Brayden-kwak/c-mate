import type { ReactNode } from "react";

type Props = {
  label: string;
  required?: boolean;
  optional?: boolean;
  helper?: ReactNode;
  error?: string;
  children: ReactNode;
};

export function Row({ label, required, optional, helper, error, children }: Props) {
  const subtext = error ?? helper;
  const isError = !!error;

  return (
    <div className="grid xl:grid-cols-[260px_1fr] xl:gap-10 gap-3 py-2.5">
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-sm font-semibold text-text">{label}</span>
          {required && (
            <span className="text-danger font-bold" aria-hidden="true">
              *
            </span>
          )}
          {optional && (
            <span className="text-xs text-text-secondary font-medium">선택</span>
          )}
        </div>
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
