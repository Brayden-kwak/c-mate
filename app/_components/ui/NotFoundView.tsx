import type { ReactNode } from "react";
import { Button } from "@/app/_components/ui/Button";

export const NotFoundView = (): ReactNode => {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      <h2 className="text-5xl font-bold text-primary mb-4">404</h2>
      <p className="text-lg font-semibold text-text mb-2">
        페이지를 찾을 수 없습니다
      </p>
      <p className="text-text-secondary mb-6 text-center">
        요청하신 페이지가 존재하지 않거나 이동되었습니다.
      </p>
      <Button href="/" variant="primary" size="lg">
        홈으로 돌아가기
      </Button>
    </div>
  );
};
