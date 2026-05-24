import Image from "next/image";
import type { ReactNode } from "react";

const QUICK_ICON_SM = "w-4 h-4 shrink-0 object-contain";
const QUICK_ICON_LG = "w-5 h-5 shrink-0 object-contain";

function QuickMenuImage({
  src,
  size,
}: {
  src: string;
  size: "sm" | "lg";
}) {
  const dim = size === "lg" ? 20 : 16;
  return (
    <Image
      src={src}
      alt=""
      width={dim}
      height={dim}
      className={size === "lg" ? QUICK_ICON_LG : QUICK_ICON_SM}
      priority
      aria-hidden
    />
  );
}

export type QuickMenuItem = {
  label: string;
  icon: ReactNode;
  action?: "consult";
};

export const QUICK_MENU_ITEMS: QuickMenuItem[] = [
  {
    label: "무료상담",
    action: "consult",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-4 h-4 shrink-0"
        aria-hidden="true"
      >
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    ),
  },
  {
    label: "자녀결혼",
    icon: <QuickMenuImage src="/images/quick-menu/quick-children.png" size="lg" />,
  },
  {
    label: "업그레이드",
    icon: <QuickMenuImage src="/images/quick-menu/quick-upgrade.png" size="sm" />,
  },
  {
    label: "오시는길",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 shrink-0" aria-hidden="true">
        <path d="M12 21s7-5.1 7-11a7 7 0 0 0-14 0c0 5.9 7 11 7 11Z" />
        <circle cx="12" cy="10" r="2.5" />
      </svg>
    ),
  },
  {
    label: "프로필컨설팅",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 shrink-0" aria-hidden="true">
        <rect x="4" y="4" width="16" height="16" rx="2" />
        <circle cx="12" cy="10" r="3" />
        <path d="M7 19c.8-2.4 2.5-3.6 5-3.6s4.2 1.2 5 3.6" />
      </svg>
    ),
  },
  {
    label: "33법칙",
    icon: <QuickMenuImage src="/images/quick-menu/quick-33.png" size="sm" />,
  },
];
