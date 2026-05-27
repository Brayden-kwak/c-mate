import type { ReactNode } from "react";

type Props = {
  title: string;
  optional?: boolean;
  note?: string;
  children: ReactNode;
};

export const HighlightBox = ({ title, optional, note, children }: Props) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <span className="text-[13px] font-semibold text-text">{title}</span>
        {optional && (
          <span className="text-xs text-text-secondary font-medium">선택</span>
        )}
        <span className="flex-1" />
      </div>
      {children}
      {note && (
        <p className="text-xs text-text-secondary leading-snug m-0">{note}</p>
      )}
    </div>
  );
};
