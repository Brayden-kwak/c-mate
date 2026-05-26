import Image from "next/image";
import type { ReactNode } from "react";

const QUICK_ICON_SM = "w-4 h-4 shrink-0 object-contain max-w-none";
const QUICK_ICON_LG = "w-5 h-5 shrink-0 object-contain max-w-none";

function QuickMenuImage({
  src,
  size,
  priority = true,
}: {
  src: string;
  size: "sm" | "lg";
  priority?: boolean;
}) {
  const dim = size === "lg" ? 20 : 16;
  return (
    <Image
      src={src}
      alt=""
      width={dim}
      height={dim}
      className={size === "lg" ? QUICK_ICON_LG : QUICK_ICON_SM}
      priority={priority}
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
    icon: <QuickMenuImage src="/images/quick-menu/quick-call.png" size="sm" />,
  },
  {
    label: "자녀결혼",
    icon: (
      <QuickMenuImage src="/images/quick-menu/quick-children.png" size="lg" />
    ),
  },
  {
    label: "업그레이드",
    icon: (
      <QuickMenuImage src="/images/quick-menu/quick-upgrade.png" size="sm" />
    ),
  },
  {
    label: "오시는길",
    icon: (
      <QuickMenuImage src="/images/quick-menu/quick-location.png" size="sm" />
    ),
  },
  {
    label: "프로필컨설팅",
    icon: (
      <QuickMenuImage
        src="/images/quick-menu/quick-profile-consulting.png"
        size="sm"
      />
    ),
  },
  {
    label: "33법칙",
    icon: <QuickMenuImage src="/images/quick-menu/quick-33.png" size="sm" />,
  },
];
