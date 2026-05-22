"use client";

import { useEffect, useId, useState } from "react";
import { FreeConsultModal } from "@/app/_components/web-shell/FreeConsultModal";
import { QUICK_MENU_ITEMS } from "@/app/_components/web-shell/quickMenuItems";

const XL_BREAKPOINT = 1280;

export function MobileQuickFab() {
  const [open, setOpen] = useState(false);
  const [consultOpen, setConsultOpen] = useState(false);
  const menuId = useId();

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= XL_BREAKPOINT) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    window.addEventListener("resize", onResize);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return (
    <div
      className="xl:hidden fixed right-4 bottom-mobile-fab-bottom z-(--z-rail) flex flex-col items-end gap-2"
      aria-label="퀵 메뉴"
    >
      {open && (
        <div
          id={menuId}
          role="menu"
          className="w-max rounded-lg border border-border bg-surface px-2 py-2.5 shadow-lg flex flex-col gap-mobile-fab-menu-gap"
        >
          {QUICK_MENU_ITEMS.map((item) => (
            <button
              key={item.label}
              type="button"
              role="menuitem"
              onClick={() => {
                if (item.action === "consult") {
                  setOpen(false);
                  setConsultOpen(true);
                }
              }}
              className="flex min-h-touch-min items-center gap-2 rounded-md px-2.5 text-left text-[13px] font-semibold text-text whitespace-nowrap hover:bg-subtle transition-colors duration-fast ease-standard"
            >
              <span className="text-text-secondary">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      )}

      <button
        type="button"
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={open ? "메뉴 닫기" : "퀵 메뉴 열기"}
        title={open ? "메뉴 닫기" : "퀵 메뉴 열기"}
        onClick={() => setOpen((prev) => !prev)}
        className={[
          "w-mobile-fab-size h-mobile-fab-size rounded-pill inline-flex items-center justify-center text-2xl font-light tracking-tight shadow-fab transition-colors duration-fast ease-standard",
          open ? "bg-text text-white" : "bg-primary text-white",
        ].join(" ")}
      >
        {open ? "✕" : "＋"}
      </button>

      <FreeConsultModal open={consultOpen} onClose={() => setConsultOpen(false)} />
    </div>
  );
}
