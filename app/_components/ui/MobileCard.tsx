"use client";

import { useState, type ReactNode } from "react";
import type { SectionProgressBadge } from "@/app/_components/form/base-info/types";
import { ChevronDown } from "@/app/_components/ui/icons";

type CardProps = {
  num: number;
  title: string;
  sub?: string;
  progress?: SectionProgressBadge;
  children: ReactNode;
  defaultOpen?: boolean;
  bodyClassName?: string;
};

export const MobileCard = ({
  num,
  title,
  sub,
  progress,
  children,
  defaultOpen = true,
  bodyClassName,
}: CardProps) => {
  const [open, setOpen] = useState(defaultOpen);
  const isComplete = progress
    ? (progress.statusComplete ?? progress.done >= progress.total)
    : false;
  const statusClass = isComplete
    ? "bg-success-light text-success"
    : "bg-subtle text-text-secondary";

  return (
    <div className="bg-surface border border-border rounded-lg shadow-sm overflow-hidden shrink-0">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="w-full text-left flex items-center gap-3 px-4 py-3.5 bg-surface"
      >
        <span className="w-7 h-7 rounded-lg bg-subtle text-text-secondary inline-flex items-center justify-center text-[13px] font-bold shrink-0">
          {num}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-[15px] font-bold text-text m-0 leading-tight">
            {title}
          </h3>
          {sub && (
            <div className="text-[11px] text-text-tertiary mt-0.5">{sub}</div>
          )}
        </div>
        {progress && (
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-pill text-[11px] font-semibold shrink-0 ${statusClass}`}
            aria-label={isComplete ? "완료" : "미완료"}
          >
            {progress.done}/{progress.total}
          </span>
        )}
        <ChevronDown
          className={`w-4 h-4 text-text-tertiary shrink-0 transition-transform duration-fast ease-standard ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div
          className={[
            "flex flex-col gap-5 border-t border-border-subtle px-4 pt-6 pb-8",
            bodyClassName,
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {children}
        </div>
      )}
    </div>
  );
};

type FieldProps = {
  label: ReactNode;
  required?: boolean;
  desc?: ReactNode;
  labelBadge?: ReactNode;
  children: ReactNode;
};

export const MobileField = ({
  label,
  required,
  desc,
  labelBadge,
  children,
}: FieldProps) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex w-full items-center gap-1.5 flex-wrap">
        <span className="text-sm font-semibold text-text">{label}</span>
        {required && (
          <span className="text-danger font-bold" aria-hidden="true">
            *
          </span>
        )}
        {labelBadge && <span className="ml-auto shrink-0">{labelBadge}</span>}
      </div>
      {desc && (
        <p className="text-xs text-text-secondary leading-normal m-0">{desc}</p>
      )}
      {children}
    </div>
  );
};
