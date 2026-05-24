import type { ReactNode } from "react";
import Link from "next/link";

export default function WebNotFound(): ReactNode {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      <h2 className="text-5xl font-bold text-primary mb-4">404</h2>
      <p className="text-lg font-semibold text-text mb-2">
        페이지를 찾을 수 없습니다
      </p>
      <p className="text-text-secondary mb-6 text-center">
        요청하신 페이지가 존재하지 않거나 이동되었습니다.
      </p>
      <Link
        href="/"
        className="inline-flex items-center justify-center font-semibold text-mobile-menu h-11 px-5 rounded-md bg-primary text-white hover:bg-primary-hover transition-colors duration-base ease-standard"
      >
        홈으로 돌아가기
      </Link>
    </div>
  );
}
