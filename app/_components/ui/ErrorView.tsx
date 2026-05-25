"use client";

import type { ReactNode } from "react";
import { Button } from "@/app/_components/ui/Button";

type Props = {
  message: string;
  onRetry: () => void;
};

export function ErrorView({ message, onRetry }: Props): ReactNode {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      <h2 className="text-xl font-bold text-text mb-2">오류가 발생했습니다</h2>
      <p className="text-text-secondary mb-6 text-center">
        {message}
        <br />
        잠시 후 다시 시도해 주세요.
      </p>
      <Button variant="primary" size="lg" onClick={onRetry}>
        다시 시도
      </Button>
    </div>
  );
}
