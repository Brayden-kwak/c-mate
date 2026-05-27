"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { FreeConsultModal } from "@/app/_components/web-shell/FreeConsultModal";
import { QUICK_MENU_ITEMS } from "@/app/_components/web-shell/quickMenuItems";

export const QuickRail = () => {
  const [consultOpen, setConsultOpen] = useState(false);
  const [railStyle, setRailStyle] = useState<CSSProperties>({
    right: "max(32px, calc((100vw - 1440px) / 2 + 30px))",
    width: "56px",
  });

  useEffect(() => {
    const syncRail = () => {
      const frame = document.querySelector<HTMLElement>("[data-cmate-frame]");
      const webMain = document.querySelector<HTMLElement>(
        "[data-cmate-web-main]",
      );

      if (!frame || !webMain || window.innerWidth < 1280) {
        setRailStyle({
          right: "max(32px, calc((100vw - 1440px) / 2 + 30px))",
          width: "56px",
        });
        return;
      }

      const frameRect = frame.getBoundingClientRect();

      // 레이아웃이 아직 계산되지 않은 경우 건너뜀 (Tailwind bottom-6가 폴백으로 작동)
      if (frameRect.bottom <= 0) return;

      const mainStyles = getComputedStyle(webMain);
      const gap =
        Number.parseFloat(mainStyles.columnGap || mainStyles.gap) || 28;
      const railWidth = 56;
      const viewportInset = 12;
      const outsideLeft = frameRect.right + gap;
      const maxVisibleLeft = window.innerWidth - railWidth - viewportInset;
      const minVisibleLeft = Math.max(
        viewportInset,
        frameRect.left + viewportInset,
      );
      const left = Math.round(
        Math.max(minVisibleLeft, Math.min(outsideLeft, maxVisibleLeft)),
      );
      const railStopBottom = 24;
      const dockedBottom = Math.round(
        window.innerHeight - frameRect.bottom + railStopBottom,
      );
      const bottom =
        frameRect.bottom <= window.innerHeight - railStopBottom
          ? Math.max(railStopBottom, dockedBottom)
          : railStopBottom;

      setRailStyle({
        left: `${left}px`,
        bottom: `${bottom}px`,
        width: `${railWidth}px`,
      });
    };

    const rafId = requestAnimationFrame(syncRail);

    // 프레임 크기 변화(hydration 후 콘텐츠 로드 등) 감지
    const ro = new ResizeObserver(syncRail);
    const frame = document.querySelector<HTMLElement>("[data-cmate-frame]");
    const webMain = document.querySelector<HTMLElement>(
      "[data-cmate-web-main]",
    );
    if (frame) ro.observe(frame);
    if (webMain) ro.observe(webMain);

    window.addEventListener("resize", syncRail);
    window.addEventListener("scroll", syncRail, { passive: true });
    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      window.removeEventListener("resize", syncRail);
      window.removeEventListener("scroll", syncRail);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <aside
      className="hidden xl:flex flex-col gap-2 items-stretch fixed bottom-6 z-[var(--z-rail)]"
      style={railStyle}
      aria-label="퀵 메뉴"
    >
      {QUICK_MENU_ITEMS.map((btn) => (
        <button
          key={btn.label}
          type="button"
          onClick={
            btn.action === "consult" ? () => setConsultOpen(true) : undefined
          }
          className="min-h-[54px] border border-border rounded-md bg-surface flex flex-col items-center justify-center gap-1 text-text-brand font-extrabold text-[10px] tracking-tight shadow-rail hover:bg-subtle transition-colors duration-fast ease-standard"
        >
          <span className="w-5 h-5 flex items-center justify-center">
            {btn.icon}
          </span>
          <span className="leading-tight text-center">{btn.label}</span>
        </button>
      ))}
      <FreeConsultModal
        open={consultOpen}
        onClose={() => setConsultOpen(false)}
      />
      <button
        type="button"
        onClick={scrollToTop}
        className="min-h-9 border border-border rounded-md bg-surface flex items-center justify-center text-text-brand font-extrabold text-[10px] shadow-rail hover:bg-subtle transition-colors duration-fast ease-standard"
      >
        맨위로
      </button>
    </aside>
  );
};
