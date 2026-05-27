import type { ReactNode } from "react";
import Link from "next/link";

const NotFound = (): ReactNode => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-page">
      <div className="text-center px-4">
        <h2 className="text-6xl font-bold text-primary mb-4">404</h2>
        <p className="text-xl font-semibold text-text mb-2">
          페이지를 찾을 수 없습니다
        </p>
        <p className="text-text-secondary mb-6">
          요청하신 페이지가 존재하지 않거나 이동되었습니다.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors"
        >
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
