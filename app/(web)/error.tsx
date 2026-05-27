"use client";

import type { ReactNode } from "react";
import { ErrorView } from "@/app/_components/ui/ErrorView";

const WebError = ({
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}): ReactNode => {
  return (
    <ErrorView
      message="페이지를 불러오는 중 문제가 발생했습니다."
      onRetry={unstable_retry}
    />
  );
};

export default WebError;
