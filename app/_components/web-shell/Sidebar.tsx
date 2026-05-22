"use client";

import { useEffect, useState } from "react";
import { MyPageNavList } from "@/app/_components/web-shell/MyPageNavList";

/** Stepper(기본정보·나의소개…) 하단이 뷰포트에 닿을 때부터 sticky — 살짝 가려진 뒤 메뉴 고정 */
const useSidebarStickyTop = () => {
  const [stickyTop, setStickyTop] = useState(0);

  useEffect(() => {
    const sync = () => {
      if (window.innerWidth < 1280) {
        setStickyTop(0);
        return;
      }

      const stepper = document.querySelector<HTMLElement>("[data-desktop-stepper]");
      if (!stepper) return;

      const rect = stepper.getBoundingClientRect();
      const height = rect.height;

      if (rect.top <= 0) {
        setStickyTop(Math.round(height));
        return;
      }

      setStickyTop(Math.max(0, Math.round(rect.bottom)));
    };

    sync();
    window.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);
    return () => {
      window.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
    };
  }, []);

  return stickyTop;
};

export const Sidebar = () => {
  const stickyTop = useSidebarStickyTop();

  return (
    <aside
      className="hidden xl:flex sticky z-(--z-sticky) flex-col gap-2.5 self-start overflow-y-auto overscroll-y-contain px-0 pt-12 text-[13px] text-text-brand"
      style={{
        top: stickyTop,
        maxHeight: stickyTop > 0 ? `calc(100vh - ${stickyTop}px)` : "100vh",
      }}
      aria-label="마이페이지 메뉴"
    >
      <h2 className="text-[15px] font-extrabold m-0 mb-2.5">마이페이지</h2>
      <MyPageNavList variant="sidebar" />
    </aside>
  );
};
