import type { ProgressSection } from "@/app/_components/form/base-info/types";
import type { Size } from "@/app/_components/ui/types";

const trackClass: Record<Size, string> = {
  sm: "h-[5px]",
  md: "h-1.5",
  lg: "h-2",
};

const countClass: Record<Size, string> = {
  sm: "text-[11px]",
  md: "text-[13px]",
  lg: "text-sm",
};

const gapClass: Record<Size, string> = {
  sm: "gap-2",
  md: "gap-3",
  lg: "gap-4",
};

type Props = {
  progress: ProgressSection;
  size?: Size;
};

export const FormProgressBar = ({ progress, size = "md" }: Props) => {
  const percent =
    progress.total === 0 ? 0 : (progress.done / progress.total) * 100;

  return (
    <div className={`flex items-center ${gapClass[size]}`}>
      <div
        className={`flex-1 ${trackClass[size]} bg-border-subtle rounded-pill overflow-hidden`}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={progress.total}
        aria-valuenow={progress.done}
        aria-label={`기본정보 진행 ${progress.done} / ${progress.total}`}
      >
        <div
          className="h-full bg-primary rounded-pill transition-[width] duration-slow ease-emphasized"
          style={{ width: `${percent}%` }}
        />
      </div>
      <span
        className={`${countClass[size]} font-semibold text-text-secondary shrink-0`}
      >
        {progress.done} / {progress.total} 항목
      </span>
    </div>
  );
};
