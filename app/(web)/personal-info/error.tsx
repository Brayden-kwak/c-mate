"use client";

import type { ReactNode } from "react";
import { ErrorView } from "@/app/_components/ui/ErrorView";

export default function PersonalInfoError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}): ReactNode {
  return (
    <ErrorView
      message="정보를 불러오는 중 문제가 발생했습니다."
      onRetry={reset}
    />
  );
}
