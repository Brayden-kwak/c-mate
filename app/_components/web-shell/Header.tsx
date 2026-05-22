"use client";

import Link from "next/link";
import { useState } from "react";
import { CmLogo } from "@/app/_components/web-shell/CmLogo";
import { LogoutIcon } from "@/app/_components/web-shell/LogoutIcon";

const NAV_ITEMS = [
  "크리스천메이트",
  "서비스 안내",
  "공개 프로필",
  "커뮤니티",
  "오프라인 모임",
  "문의하기",
];

const MEGA_COLS = [
  ["회사 소개", "메이트 뉴스", "동역하는 사람들", "법률 보호 제도", "오시는 길"],
  ["이용 절차", "매칭 시스템", "서비스 종류", "자녀 결혼 컨설팅", "프로필 컨설팅"],
  ["남성 메이트", "여성 메이트", "성혼 회원 분석"],
  ["회원 후기", "매니저 후기", "연애 칼럼", "제휴 파트너"],
  ["모임 참석 안내", "모임 공고", "현장 스케치"],
  ["자주 묻는 질문", "불편/건의 접수", "상담 신청", "제휴/광고 문의", "채용 문의"],
];

const navLinkBaseClass =
  "relative inline-block py-2 text-sm font-semibold text-text-brand whitespace-nowrap transition-colors duration-fast ease-standard after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary after:origin-center after:scale-x-0 after:transition-transform after:duration-fast after:ease-standard";

const navLinkActiveClass = "text-primary after:scale-x-100";

/** 프로필·로그아웃 세로 스택 공통 높이 */
const headerActionStackClass =
  "flex h-9 flex-col items-center justify-center gap-0.5 text-xs font-bold leading-tight";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeCol, setActiveCol] = useState<number | null>(null);

  function closeMenu() {
    setMenuOpen(false);
    setActiveCol(null);
  }

  function highlightCol(col: number) {
    setActiveCol(col);
  }

  return (
    <div
      className="relative z-(--z-header) hidden xl:block"
      onMouseEnter={() => setMenuOpen(true)}
      onMouseLeave={closeMenu}
    >
      <header className="h-16 bg-surface grid grid-cols-[210px_minmax(0,1fr)_260px] items-center px-7 gap-5">
        <Link href="/" className="inline-flex h-9 min-w-0 items-center no-underline">
          <CmLogo priority className="h-5 w-auto" />
        </Link>

        <nav aria-label="주요 메뉴" className="grid grid-cols-6 items-center text-center gap-1">
          {NAV_ITEMS.map((item, i) => (
            <a
              key={item}
              href="#"
              onMouseEnter={() => highlightCol(i)}
              className={[
                navLinkBaseClass,
                activeCol === i ? navLinkActiveClass : "",
              ].join(" ")}
            >
              {item}
            </a>
          ))}
        </nav>

        <div className="flex items-center justify-end gap-3.5 whitespace-nowrap text-text-brand">
          <div className={`min-w-0 ${headerActionStackClass}`}>
            <span className="w-5 h-5 rounded-full bg-avatar-accent text-white inline-flex items-center justify-center text-[10px] font-bold shrink-0">
              C
            </span>
            <span className="text-primary">임승리</span>
          </div>
          <button
            type="button"
            className={`${headerActionStackClass} text-text-brand hover:text-text transition-colors duration-fast ease-standard`}
            aria-label="로그아웃"
          >
            <LogoutIcon />
            <span>로그아웃</span>
          </button>
        </div>
      </header>

      <div
        className={[
          "absolute left-0 right-0 top-16 -mt-2 pt-2 bg-surface grid-cols-[210px_minmax(0,1fr)_260px] gap-5 px-7 pt-6 pb-7 shadow-mega",
          menuOpen ? "grid" : "hidden",
        ].join(" ")}
        aria-label="열린 헤더 메뉴"
        aria-hidden={!menuOpen}
      >
        <div className="col-start-2 grid grid-cols-6 gap-1 text-center">
          {MEGA_COLS.map((col, i) => (
            <div
              key={i}
              className="flex flex-col gap-3.5 items-center"
              onMouseEnter={() => highlightCol(i)}
            >
              {col.map((item) => (
                <a
                  key={item}
                  href="#"
                  className="text-sm font-medium text-text-brand whitespace-nowrap hover:text-primary transition-colors duration-fast ease-standard"
                >
                  {item}
                </a>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
