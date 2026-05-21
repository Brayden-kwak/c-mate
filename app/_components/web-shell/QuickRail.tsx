"use client";

import { useEffect, useState, type CSSProperties } from "react";

const QUICK_BUTTONS = [
  {
    label: "자녀결혼",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5" aria-hidden="true">
        <path d="M19 14c1.5-1.4 2-3.5 1.2-5.3A5 5 0 0 0 13 6.7L12 8l-1-1.3A5 5 0 0 0 3.8 8.7c-.8 1.8-.3 3.9 1.2 5.3l7 6 7-6Z" />
        <path d="M12 8v4" />
        <path d="M10 10h4" />
      </svg>
    ),
  },
  {
    label: "업그레이드",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5" aria-hidden="true">
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
      </svg>
    ),
  },
  {
    label: "오시는길",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5" aria-hidden="true">
        <path d="M12 21s7-5.1 7-11a7 7 0 0 0-14 0c0 5.9 7 11 7 11Z" />
        <circle cx="12" cy="10" r="2.5" />
      </svg>
    ),
  },
  {
    label: "프로필컨설팅",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5" aria-hidden="true">
        <rect x="4" y="4" width="16" height="16" rx="2" />
        <circle cx="12" cy="10" r="3" />
        <path d="M7 19c.8-2.4 2.5-3.6 5-3.6s4.2 1.2 5 3.6" />
      </svg>
    ),
  },
  {
    label: "33법칙",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5" aria-hidden="true">
        <path d="M21 12a9 9 0 1 1-3-6.7" />
        <path d="M21 3v6h-6" />
        <path d="M9 11h2v4H9z" />
        <path d="M14 9h2v6h-2z" />
      </svg>
    ),
  },
];

export function QuickRail() {
  const [railStyle, setRailStyle] = useState<CSSProperties>({
    right: "max(32px, calc((100vw - 1440px) / 2 + 30px))",
    width: "56px",
  });

  useEffect(() => {
    function syncRail() {
      const frame = document.querySelector<HTMLElement>("[data-cmate-frame]");
      const webMain = document.querySelector<HTMLElement>("[data-cmate-web-main]");

      if (!frame || !webMain || window.innerWidth < 1280) {
        setRailStyle({
          right: "max(32px, calc((100vw - 1440px) / 2 + 30px))",
          width: "56px",
        });
        return;
      }

      const frameRect = frame.getBoundingClientRect();
      const mainStyles = getComputedStyle(webMain);
      const gap = Number.parseFloat(mainStyles.columnGap || mainStyles.gap) || 28;
      const railWidth = 56;
      const viewportInset = 12;
      const outsideLeft = frameRect.right + gap;
      const maxVisibleLeft = window.innerWidth - railWidth - viewportInset;
      const minVisibleLeft = Math.max(viewportInset, frameRect.left + viewportInset);
      const left = Math.round(Math.max(minVisibleLeft, Math.min(outsideLeft, maxVisibleLeft)));
      const railStopBottom = 24;
      const dockedBottom = Math.round(window.innerHeight - frameRect.bottom + railStopBottom);
      const bottom = frameRect.bottom <= window.innerHeight - railStopBottom ? Math.max(railStopBottom, dockedBottom) : railStopBottom;

      setRailStyle({
        left: `${left}px`,
        bottom: `${bottom}px`,
        width: `${railWidth}px`,
      });
    }

    syncRail();
    window.addEventListener("resize", syncRail);
    window.addEventListener("scroll", syncRail, { passive: true });
    return () => {
      window.removeEventListener("resize", syncRail);
      window.removeEventListener("scroll", syncRail);
    };
  }, []);

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <aside
      className="hidden xl:flex flex-col gap-2 items-stretch fixed bottom-6 z-[var(--z-rail)]"
      style={railStyle}
      aria-label="퀵 메뉴"
    >
      {QUICK_BUTTONS.map((btn) => (
        <button
          key={btn.label}
          type="button"
          className="min-h-[54px] border border-border rounded-md bg-surface flex flex-col items-center justify-center gap-1 text-text-brand font-extrabold text-[10px] tracking-tight shadow-rail hover:bg-subtle transition-colors duration-fast ease-standard"
        >
          {btn.icon}
          <span className="leading-tight text-center">{btn.label}</span>
        </button>
      ))}
      <button
        type="button"
        onClick={scrollToTop}
        className="min-h-9 border border-border rounded-md bg-surface flex items-center justify-center text-text-brand font-extrabold text-[10px] shadow-rail hover:bg-subtle transition-colors duration-fast ease-standard"
      >
        맨위로
      </button>
    </aside>
  );
}
