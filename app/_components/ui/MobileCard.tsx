"use client";

import { useState, type ReactNode } from "react";

type CardProps = {
  num: number;
  title: string;
  sub?: string;
  statusPill?: boolean;
  children: ReactNode;
  defaultOpen?: boolean;
};

export function MobileCard({ num, title, sub, statusPill, children, defaultOpen = true }: CardProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="bg-surface border border-border rounded-lg shadow-sm overflow-hidden flex-shrink-0">
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
          <h3 className="text-[15px] font-bold text-text m-0 leading-tight">{title}</h3>
          {sub && <div className="text-[11px] text-text-tertiary mt-0.5">{sub}</div>}
        </div>
        {statusPill && (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-pill bg-success-light text-success text-[11px] font-semibold before:content-[''] before:w-1.5 before:h-1.5 before:rounded-full before:bg-success shrink-0">
            완료
          </span>
        )}
        <svg
          className={`w-4 h-4 text-text-tertiary shrink-0 transition-transform duration-fast ease-standard ${open ? "rotate-180" : ""}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {open && (
        <div className="px-4 pt-5 pb-6 flex flex-col gap-4 border-t border-border-subtle">
          {children}
        </div>
      )}
    </div>
  );
}

type FieldProps = {
  label: ReactNode;
  required?: boolean;
  desc?: ReactNode;
  children: ReactNode;
};

export function MobileField({ label, required, desc, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="text-sm font-semibold text-text">{label}</span>
        {required && (
          <span className="text-danger font-bold" aria-hidden="true">
            *
          </span>
        )}
      </div>
      {desc && <p className="text-xs text-text-secondary leading-normal m-0">{desc}</p>}
      {children}
    </div>
  );
}
