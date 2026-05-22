"use client";

import { useEffect, useState } from "react";
import { Button } from "@/app/_components/ui/Button";
import { CmLogo } from "@/app/_components/web-shell/CmLogo";
import { MyPageNavList } from "@/app/_components/web-shell/MyPageNavList";

const XL_BREAKPOINT = 1280;

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

export function MobileHeader() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= XL_BREAKPOINT) setDrawerOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setDrawerOpen(false);
    };

    window.addEventListener("resize", onResize);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return (
    <>
      {/* Topbar — 드로어 위에 유지 (mockup: drawer inset 44px 0 0) */}
      <div className="fixed top-0 left-0 right-0 xl:hidden z-(--z-header) h-14 bg-surface flex items-center px-4 gap-3">
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
          aria-label={drawerOpen ? "전체 메뉴 닫기" : "전체 메뉴 열기"}
          aria-expanded={drawerOpen}
          aria-controls="mobile-drawer"
          onClick={() => setDrawerOpen((open) => !open)}
          className="ml-auto w-[34px] h-[34px] rounded-full border border-border bg-surface inline-flex items-center justify-center text-text"
        >
          {drawerOpen ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" className="w-[18px] h-[18px]" aria-hidden="true">
              <path d="M6 6l12 12" />
              <path d="M18 6 6 18" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" className="w-[18px] h-[18px]" aria-hidden="true">
              <path d="M4 7h16" />
              <path d="M4 12h16" />
              <path d="M4 17h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Step chips — 드로어 백드롭 아래에서 음영 처리 */}
      <div className="fixed top-mobile-topbar-height left-0 right-0 xl:hidden z-(--z-sticky) bg-surface px-4 pt-3 pb-3.5">
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
                  step.current ? "bg-white/25" : "bg-black/5",
                ].join(" ")}
              >
                {step.num}
              </span>
              <span>{step.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="xl:hidden h-mobile-shell-header shrink-0" aria-hidden="true" />

      {drawerOpen && (
        <div
          id="mobile-drawer"
          role="presentation"
          className="fixed inset-x-0 bottom-0 top-mobile-topbar-height xl:hidden z-(--z-drawer-backdrop) flex justify-end bg-backdrop-drawer"
          onClick={(e) => e.target === e.currentTarget && setDrawerOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="전체 메뉴"
            className="w-[292px] h-full bg-surface flex flex-col shadow-drawer"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex-1 overflow-y-auto p-[18px]">
              <div className="mb-[18px]">
                <CmLogo />
              </div>

              <div className="py-3.5 border-t border-border-subtle">
                <h4 className="m-0 mb-2.5 text-xs text-text-tertiary tracking-[0.08em]">MAIN MENU</h4>
                <div className="grid grid-cols-2 gap-2">
                  {MAIN_MENU.map((item) => (
                    <a
                      key={item}
                      href="#"
                      className="text-text text-[13px] font-bold no-underline hover:text-primary transition-colors duration-fast ease-standard"
                    >
                      {item}
                    </a>
                  ))}
                </div>
              </div>

              <div className="py-3.5 border-t border-border-subtle">
                <h4 className="m-0 mb-2.5 text-xs text-text-tertiary tracking-[0.08em]">MY PAGE</h4>
                <MyPageNavList variant="drawer" />
              </div>
            </div>

            <div className="shrink-0 border-t border-border-subtle p-[18px]">
              <Button variant="primary" size="md" layout="full" type="button">
                업그레이드
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
