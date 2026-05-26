"use client";

import Link from "next/link";
import { useState } from "react";
import {
  HeaderLogoutButton,
  HeaderUserProfile,
} from "@/app/_components/web-shell/HeaderAccount";
import { CmLogo } from "@/app/_components/web-shell/CmLogo";
import { NAV_ITEMS } from "@/app/_components/web-shell/navItems";

const MEGA_COLS = [
  [
    "회사 소개",
    "메이트 뉴스",
    "동역하는 사람들",
    "법률 보호 제도",
    "오시는 길",
  ],
  [
    "이용 절차",
    "매칭 시스템",
    "서비스 종류",
    "자녀 결혼 컨설팅",
    "프로필 컨설팅",
  ],
  ["남성 메이트", "여성 메이트", "성혼 회원 분석"],
  ["회원 후기", "매니저 후기", "연애 칼럼", "제휴 파트너"],
  ["모임 참석 안내", "모임 공고", "현장 스케치"],
  [
    "자주 묻는 질문",
    "불편/건의 접수",
    "상담 신청",
    "제휴/광고 문의",
    "채용 문의",
  ],
];

/** 상단 nav · mega 하위 메뉴 열 정렬 공통 */
const MAIN_NAV_GRID_CLASS =
  "mx-auto grid w-full max-w-(--spacing-header-nav-width) min-w-0 justify-self-center grid-cols-6 items-center gap-0 text-center";

const navLinkBaseClass =
  "relative block w-full px-1 py-2 text-sm font-semibold text-text-brand whitespace-nowrap transition-colors duration-fast ease-standard after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary after:origin-center after:scale-x-0 after:transition-transform after:duration-fast after:ease-standard";

const navLinkActiveClass = "text-primary after:scale-x-100";

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
      <header className="h-16 bg-surface grid grid-cols-[var(--spacing-header-logo-col)_minmax(0,1fr)_auto] items-center px-7 gap-5">
        <div className="flex min-w-0 items-center justify-center">
          <Link
            href="/"
            className="inline-flex h-9 min-w-0 items-center no-underline"
          >
            <CmLogo priority className="h-5 w-auto" />
          </Link>
        </div>

        <nav aria-label="주요 메뉴" className={MAIN_NAV_GRID_CLASS}>
          {NAV_ITEMS.map((item, i) => (
            <Link
              key={item}
              href="#"
              onMouseEnter={() => highlightCol(i)}
              className={[
                navLinkBaseClass,
                activeCol === i ? navLinkActiveClass : "",
              ].join(" ")}
            >
              {item}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-5 whitespace-nowrap text-text-brand justify-self-end">
          <HeaderUserProfile />
          <HeaderLogoutButton />
        </div>
      </header>

      <div
        className={[
          "absolute left-0 right-0 top-16 -mt-2 bg-surface grid-cols-[var(--spacing-header-logo-col)_minmax(0,1fr)_auto] gap-5 px-7 pt-6 pb-7 shadow-mega",
          menuOpen ? "grid" : "hidden",
        ].join(" ")}
        aria-label="열린 헤더 메뉴"
        aria-hidden={!menuOpen}
      >
        <div aria-hidden="true" />
        <div className={MAIN_NAV_GRID_CLASS}>
          {MEGA_COLS.map((col, i) => (
            <div
              key={i}
              className="flex min-w-0 w-full flex-col items-center gap-3"
              onMouseEnter={() => highlightCol(i)}
            >
              {col.map((item) => (
                <Link
                  key={item}
                  href="#"
                  className="block w-full px-1 text-sm font-medium text-text-brand whitespace-nowrap hover:text-primary transition-colors duration-fast ease-standard"
                >
                  {item}
                </Link>
              ))}
            </div>
          ))}
        </div>
        <div
          aria-hidden="true"
          className="invisible flex items-center gap-5 whitespace-nowrap justify-self-end"
        >
          <HeaderUserProfile />
          <HeaderLogoutButton />
        </div>
      </div>
    </div>
  );
}
