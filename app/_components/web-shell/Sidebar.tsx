"use client";

import { useEffect, useState } from "react";
import { MyPageNavList } from "@/app/_components/web-shell/MyPageNavList";

/** 메인 프레임(data-cmate-frame) top과 맞춤 · 스테퍼 sticky 시에는 스테퍼 아래에 고정 */
const useSidebarStickyTop = () => {
  const [stickyTop, setStickyTop] = useState(0);

  useEffect(() => {
    const sync = () => {
      if (window.innerWidth < 1280) {
        setStickyTop(0);
        return;
      }

      const stepper = document.querySelector<HTMLElement>(
        "[data-desktop-stepper]",
      );
      const frame = document.querySelector<HTMLElement>("[data-cmate-frame]");
      if (!stepper && !frame) return;

      const stepperRect = stepper?.getBoundingClientRect();
      const frameRect = frame?.getBoundingClientRect();

      if (stepperRect && stepperRect.top <= 0) {
        setStickyTop(Math.round(stepperRect.height));
        return;
      }

      const alignTop = frameRect?.top ?? stepperRect?.top ?? 0;
      setStickyTop(Math.max(0, Math.round(alignTop)));
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
      className="hidden xl:flex sticky z-(--z-sticky) w-max -translate-x-1/2 ml-sidebar-nav-center flex-col gap-3 self-start overflow-y-auto overscroll-y-contain px-0 text-text-brand"
      style={{
        top: stickyTop,
        maxHeight: stickyTop > 0 ? `calc(100vh - ${stickyTop}px)` : "100vh",
      }}
      aria-label="마이페이지 메뉴"
    >
      <h2 className="text-lg font-extrabold m-0 mb-1">마이페이지</h2>
      <MyPageNavList variant="sidebar" />
    </aside>
  );
};
