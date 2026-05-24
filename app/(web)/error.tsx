"use client";

import { Button } from "@/app/_components/ui/Button";

export default function WebError({
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      <h2 className="text-xl font-bold text-text mb-2">오류가 발생했습니다</h2>
      <p className="text-text-secondary mb-6 text-center">
        페이지를 불러오는 중 문제가 발생했습니다.
        <br />
        잠시 후 다시 시도해 주세요.
      </p>
      <Button variant="primary" size="lg" onClick={() => unstable_retry()}>
        다시 시도
      </Button>
    </div>
  );
}
