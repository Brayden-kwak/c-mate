"use client";

import { useEffect, useState } from "react";

type SideItem = {
  label: string;
  href: string;
  active?: boolean;
  sub?: { label: string; href: string; active?: boolean }[];
};

const SIDE_ITEMS: SideItem[] = [
  {
    label: "내 정보",
    href: "#",
    active: true,
    sub: [
      { label: "정보 수정", href: "#" },
      { label: "비밀번호 수정", href: "#" },
      { label: "프로필", href: "/personal-info/base-info", active: true },
      { label: "가입정보", href: "#" },
      { label: "온라인 계약", href: "#" },
      { label: "서류제출", href: "#" },
      { label: "회원 탈퇴", href: "#" },
    ],
  },
  { label: "매칭 라운지", href: "#" },
  { label: "만남 캘린더", href: "#" },
  { label: "문의하기", href: "#" },
];

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
      <div className="flex flex-col gap-0.5">
        {SIDE_ITEMS.map((item) => (
          <div key={item.label}>
            <div
              className={[
                "flex items-center justify-between min-h-[31px] px-2 py-1.5 rounded-[6px] font-semibold",
                item.active ? "text-primary bg-primary-bg" : "text-text-brand-muted",
              ].join(" ")}
            >
              <span>{item.label}</span>
              {item.sub && <span className="text-xs">{item.active ? "⌃" : "⌄"}</span>}
            </div>
            {item.active && item.sub && (
              <div className="mt-0.5 mb-2 ml-3 flex flex-col gap-0.5">
                {item.sub.map((sub) => (
                  <a
                    key={sub.label}
                    href={sub.href}
                    className={[
                      "block px-[7px] py-[5px] text-xs font-medium no-underline",
                      sub.active ? "text-primary font-bold" : "text-text-brand-muted",
                    ].join(" ")}
                  >
                    {sub.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
};
