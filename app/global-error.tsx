"use client";

import { Button } from "@/app/_components/ui/Button";

export default function GlobalError({
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  return (
    <html lang="ko">
      <body className="min-h-screen flex items-center justify-center bg-page font-sans">
        <div className="text-center px-4">
          <h2 className="text-2xl font-bold text-text mb-2">
            오류가 발생했습니다
          </h2>
          <p className="text-text-secondary mb-6">
            예상치 못한 문제가 발생했습니다. 다시 시도해 주세요.
          </p>
          <Button variant="primary" size="lg" onClick={() => unstable_retry()}>
            다시 시도
          </Button>
        </div>
      </body>
    </html>
  );
}
