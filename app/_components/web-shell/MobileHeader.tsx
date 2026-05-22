"use client";

import { useState } from "react";

const STEPS = [
  { num: 1, label: "기본정보", current: true },
  { num: 2, label: "나의소개" },
  { num: 3, label: "매력어필" },
  { num: 4, label: "라이프" },
  { num: 5, label: "이상형" },
];

const MAIN_MENU = [
  "크리스천메이트", "서비스 안내",
  "공개 프로필", "커뮤니티",
  "오프라인 모임", "문의하기",
];

const MY_PAGE = [
  "내 정보 · 프로필",
  "정보 수정",
  "비밀번호 수정",
  "가입정보",
  "온라인 계약",
  "서류제출",
  "매칭 라운지",
  "만남 캘린더",
];

export function MobileHeader() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <div className="fixed top-0 left-0 right-0 xl:hidden z-(--z-header) bg-surface border-b border-border">
      {/* Topbar */}
      <div className="h-14 bg-surface border-b border-border flex items-center px-4 gap-3">
        <button
          type="button"
          aria-label="이전 화면으로"
          className="w-11 h-11 min-w-11 -ml-2.5 flex items-center justify-center text-text text-lg font-semibold rounded-md hover:bg-subtle transition-colors duration-fast ease-standard"
        >
          ←
        </button>
        <span className="text-[17px] font-bold">기본정보</span>
        <button
          type="button"
          aria-label="전체 메뉴 열기"
          aria-expanded={drawerOpen}
          aria-controls="mobile-drawer"
          onClick={() => setDrawerOpen(true)}
          className="ml-auto w-[34px] h-[34px] rounded-full border border-border bg-surface inline-flex items-center justify-center text-text"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" className="w-[18px] h-[18px]" aria-hidden="true">
            <path d="M4 7h16" />
            <path d="M4 12h16" />
            <path d="M4 17h16" />
          </svg>
        </button>
      </div>

      <div className="bg-surface px-4 pt-3 pb-3.5">
        <div className="flex gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
          {STEPS.map((step) => (
            <div
              key={step.num}
              className={[
                "inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-pill text-xs whitespace-nowrap",
                step.current
                  ? "bg-primary text-white font-semibold"
                  : "bg-subtle text-text-secondary font-medium",
              ].join(" ")}
            >
              <span
                className={[
                  "w-4 h-4 rounded-full inline-flex items-center justify-center text-[10px] font-bold",
                  step.current
                    ? "bg-white/25"
                    : "bg-black/5",
                ].join(" ")}
              >
                {step.num}
              </span>
              <span>{step.label}</span>
            </div>
          ))}
        </div>
      </div>

      </div>

      <div className="xl:hidden h-mobile-shell-header shrink-0" aria-hidden="true" />

      {/* Drawer */}
      {drawerOpen && (
        <div
          id="mobile-drawer"
          className="fixed inset-0 top-mobile-shell-header z-(--z-drawer-backdrop) flex justify-end bg-backdrop-drawer"
          onClick={(e) => e.target === e.currentTarget && setDrawerOpen(false)}
        >
          <div className="w-[292px] h-full bg-surface overflow-y-auto p-[18px] shadow-drawer">
            <div className="flex items-center justify-between mb-[18px]">
              <div className="inline-flex items-center gap-2 text-text-brand font-extrabold tracking-tight leading-[0.9]">
                <span
                  className="w-7 h-7 shrink-0 border-[3px] border-primary border-r-text-brand border-b-text-brand rounded-[9px_9px_12px_9px] rotate-[-45deg]"
                  aria-hidden="true"
                />
                <span className="text-[15px] leading-tight">CHRISTIAN<br />MATE</span>
              </div>
              <button
                type="button"
                aria-label="전체 메뉴 닫기"
                onClick={() => setDrawerOpen(false)}
                className="w-8 h-8 rounded-full bg-subtle text-text flex items-center justify-center text-lg"
              >
                ×
              </button>
            </div>

            <div className="py-3.5 border-t border-border-subtle">
              <h4 className="m-0 mb-2.5 text-xs text-text-tertiary tracking-[0.08em]">MAIN MENU</h4>
              <div className="grid grid-cols-2 gap-2">
                {MAIN_MENU.map((item) => (
                  <a key={item} href="#" className="text-text text-[13px] font-bold no-underline hover:text-primary transition-colors duration-fast ease-standard">
                    {item}
                  </a>
                ))}
              </div>
            </div>

            <div className="py-3.5 border-t border-border-subtle">
              <h4 className="m-0 mb-2.5 text-xs text-text-tertiary tracking-[0.08em]">MY PAGE</h4>
              <div className="flex flex-col gap-2.5">
                {MY_PAGE.map((item, i) => (
                  <span
                    key={item}
                    className={`text-[13px] font-bold cursor-pointer ${i === 0 ? "text-primary" : "text-text"}`}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
