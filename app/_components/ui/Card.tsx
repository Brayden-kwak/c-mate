import type { ReactNode } from "react";

type CardProps = { children: ReactNode };
type CardHeadProps = {
  tag: string;
  title: string;
  meta?: string;
  statusPill?: string;
};
type CardBodyProps = { children: ReactNode };

export function Card({ children }: CardProps) {
  return (
    <div className="bg-surface border border-border rounded-lg shadow-sm overflow-hidden">
      {children}
    </div>
  );
}

export function CardHead({ tag, title, meta, statusPill }: CardHeadProps) {
  return (
    <div className="flex items-center gap-4 px-8 py-5 border-b border-border">
      <span className="text-xs font-bold text-text-secondary bg-subtle px-2 py-0.5 rounded-[6px] tracking-[0.08em]">
        {tag}
      </span>
      <h2 className="text-lg font-bold text-text m-0">{title}</h2>
      {meta && <span className="text-[13px] text-text-tertiary">{meta}</span>}
      <span className="flex-1" />
      {statusPill && (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-pill bg-success-light text-success text-xs font-semibold before:content-[''] before:w-1.5 before:h-1.5 before:rounded-full before:bg-success">
          {statusPill}
        </span>
      )}
    </div>
  );
}

export function CardBody({ children }: CardBodyProps) {
  return <div className="px-8 pt-5 pb-7 divide-y divide-border-subtle">{children}</div>;
}
