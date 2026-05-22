export type MyPageNavLink = {
  label: string;
  href: string;
  active?: boolean;
};

export type MyPageNavGroup = {
  id: string;
  label: string;
  defaultOpen?: boolean;
  items: MyPageNavLink[];
};

export type MyPageNavEntry = MyPageNavGroup | MyPageNavLink;

export const MY_PAGE_NAV: MyPageNavEntry[] = [
  {
    id: "my-info",
    label: "내 정보",
    defaultOpen: true,
    items: [
      { label: "정보 수정", href: "#" },
      { label: "비밀번호 수정", href: "#" },
      { label: "프로필", href: "/personal-info/base-info", active: true },
      { label: "가입정보", href: "#" },
      { label: "온라인 계약", href: "#" },
      { label: "서류제출", href: "#" },
      { label: "회원 탈퇴", href: "#" },
    ],
  },
  {
    id: "matching-lounge",
    label: "매칭 라운지",
    defaultOpen: false,
    items: [
      { label: "매니저 추천", href: "#" },
      { label: "추가 프로필", href: "#" },
    ],
  },
  { label: "만남 캘린더", href: "#" },
  { label: "문의하기", href: "#" },
];

export const INITIAL_MY_PAGE_EXPANDED = MY_PAGE_NAV.reduce<Record<string, boolean>>((acc, entry) => {
  if ("items" in entry) acc[entry.id] = entry.defaultOpen ?? false;
  return acc;
}, {});

export function isMyPageNavGroup(entry: MyPageNavEntry): entry is MyPageNavGroup {
  return "items" in entry;
}
