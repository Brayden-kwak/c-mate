import type { ReactNode } from "react";
import type { SectionProgressBadge } from "@/app/_components/form/base-info/types";

type CardProps = { children: ReactNode };
type CardHeadProps = {
  tag: string;
  title: string;
  meta?: string;
  progress?: SectionProgressBadge;
};
type CardBodyProps = { children: ReactNode };

export function Card({ children }: CardProps) {
  return (
    <div className="bg-surface border border-border rounded-lg shadow-sm overflow-hidden">
      {children}
    </div>
  );
}

export function CardHead({ tag, title, meta, progress }: CardHeadProps) {
  const isComplete = progress
    ? (progress.statusComplete ?? progress.done >= progress.total)
    : false;
  const statusClass = isComplete
    ? "bg-success-light text-success"
    : "bg-subtle text-text-secondary";

  return (
    <div className="flex items-center gap-4 px-8 py-5 border-b border-border">
      <span className="text-xs font-bold text-text-secondary bg-subtle px-2 py-0.5 rounded-[6px] tracking-[0.08em]">
        {tag}
      </span>
      <h2 className="text-lg font-bold text-text m-0">{title}</h2>
      {meta && <span className="text-[13px] text-text-tertiary">{meta}</span>}
      <span className="flex-1" />
      {progress && (
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-pill text-xs font-semibold ${statusClass}`}
          aria-label={isComplete ? "완료" : "미완료"}
        >
          {progress.done}/{progress.total}
        </span>
      )}
    </div>
  );
}

export function CardBody({ children }: CardBodyProps) {
  return <div className="flex flex-col gap-5 px-8 pt-6 pb-8">{children}</div>;
}
