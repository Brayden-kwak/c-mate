type Step = {
  num: number;
  label: string;
  state: "current" | "done" | "pending";
};

const STEPS: Step[] = [
  { num: 1, label: "기본정보", state: "current" },
  { num: 2, label: "나의소개", state: "pending" },
  { num: 3, label: "매력어필", state: "pending" },
  { num: 4, label: "라이프스타일", state: "pending" },
  { num: 5, label: "이상형정보", state: "pending" },
];

export function Stepper() {
  return (
    <div
      data-desktop-stepper
      className="sticky top-0 z-(--z-sticky) flex rounded-t-lg border-b border-border bg-surface px-8"
    >
      {STEPS.map((step) => {
        const isCurrent = step.state === "current";
        const isDone = step.state === "done";
        return (
          <div
            key={step.num}
            className={[
              "flex-1 min-w-0 pt-4-5 flex flex-col items-center gap-3 cursor-pointer",
              isCurrent
                ? "text-text font-semibold"
                : "text-text-tertiary font-medium",
              "text-sm",
            ].join(" ")}
          >
            <div className="flex items-center gap-2.5">
              <span
                className={[
                  "w-5-5 h-5-5 rounded-full inline-flex items-center justify-center text-[11px] font-bold",
                  isCurrent
                    ? "bg-primary text-white"
                    : isDone
                      ? "bg-success text-white"
                      : "bg-subtle text-text-tertiary",
                ].join(" ")}
              >
                {isDone ? "✓" : step.num}
              </span>
              <span>{step.label}</span>
            </div>
            <div
              className={[
                "w-full h-[3px]",
                isCurrent ? "bg-primary" : "bg-transparent",
              ].join(" ")}
            />
          </div>
        );
      })}
    </div>
  );
}
