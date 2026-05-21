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

export function Sidebar() {
  return (
    <aside
      className="hidden xl:flex flex-col gap-2.5 text-[13px] text-text-brand pt-12 px-0"
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
}
