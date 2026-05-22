import type { ProgressSection } from "@/app/_components/form/base-info/types";

type Props = {
  progress: ProgressSection;
  size?: "md" | "sm";
};

export function FormProgressBar({ progress, size = "md" }: Props) {
  const percent = progress.total === 0 ? 0 : (progress.done / progress.total) * 100;
  const trackClass = size === "sm" ? "h-[5px]" : "h-1.5";
  const countClass = size === "sm" ? "text-[11px]" : "text-[13px]";

  return (
    <div className={`flex items-center gap-3 ${size === "sm" ? "gap-2" : ""}`}>
      <div
        className={`flex-1 ${trackClass} bg-border-subtle rounded-pill overflow-hidden`}
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
      <span className={`${countClass} font-semibold text-text-secondary shrink-0`}>
        {progress.done} / {progress.total} 항목
      </span>
    </div>
  );
}
