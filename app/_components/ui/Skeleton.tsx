import type { ReactNode } from "react";

import type { SkeletonVariant } from "./types";

interface SkeletonProps {
  variant?: SkeletonVariant;
  width?: string;
  height?: string;
  className?: string;
}

export const Skeleton = ({
  variant = "rect",
  width = "w-full",
  height = "h-4",
  className = "",
}: SkeletonProps): ReactNode => {
  const shapeClass =
    variant === "circle"
      ? "rounded-full"
      : variant === "line"
        ? "rounded-sm"
        : "rounded-md";

  return (
    <span
      role="presentation"
      aria-hidden="true"
      className={`block ${width} ${height} ${shapeClass} animate-skeleton ${className}`}
    />
  );
};

export const SkeletonRow = (): ReactNode => {
  return (
    <div
      role="presentation"
      aria-hidden="true"
      className="flex items-start gap-4 py-2"
    >
      <Skeleton
        variant="line"
        width="w-20"
        height="h-4"
        className="mt-1 shrink-0"
      />
      <div className="flex-1 flex flex-col gap-2">
        <Skeleton variant="rect" width="w-full" height="h-10" />
      </div>
    </div>
  );
};

interface SkeletonCardProps {
  rows?: number;
}

export const SkeletonCard = ({ rows = 3 }: SkeletonCardProps): ReactNode => {
  return (
    <div
      role="presentation"
      aria-hidden="true"
      className="bg-surface border border-border rounded-lg shadow-sm overflow-hidden"
    >
      {/* CardHead skeleton */}
      <div className="flex items-center gap-4 px-8 py-5 border-b border-border">
        <Skeleton variant="rect" width="w-10" height="h-5" />
        <Skeleton variant="line" width="w-32" height="h-5" />
      </div>
      {/* CardBody skeleton */}
      <div className="flex flex-col gap-5 px-8 pt-6 pb-8">
        {Array.from({ length: rows }).map((_, i) => (
          <SkeletonRow key={i} />
        ))}
      </div>
    </div>
  );
};
