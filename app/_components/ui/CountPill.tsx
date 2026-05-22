type Props = {
  done: number;
  total: number;
  size?: "sm" | "md";
};

export function CountPill({ done, total, size = "md" }: Props) {
  const isComplete = done >= total;
  const statusClass = isComplete
    ? "bg-success-light text-success"
    : "bg-subtle text-text-secondary";
  const sizeClass = size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs";

  return (
    <span className={`inline-flex items-center rounded-pill font-semibold ${sizeClass} ${statusClass}`}>
      {done}/{total}
    </span>
  );
}
