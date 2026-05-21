import Link from "next/link";

const NAV_ITEMS = [
  "크리스천메이트",
  "서비스 안내",
  "공개 프로필",
  "커뮤니티",
  "오프라인 모임",
  "문의하기",
];

const MEGA_COLS = [
  ["회사 소개", "메이트 뉴스", "동역하는 사람들", "법률 보호 제도", "오시는 길"],
  ["이용 절차", "매칭 시스템", "서비스 종류", "자녀 결혼 컨설팅", "프로필 컨설팅"],
  ["남성 메이트", "여성 메이트", "성혼 회원 분석"],
  ["회원 후기", "매니저 후기", "연애 칼럼", "제휴 파트너"],
  ["모임 참석 안내", "모임 공고", "현장 스케치"],
  ["자주 묻는 질문", "불편/건의 접수", "상담 신청", "제휴/광고 문의", "채용 문의"],
];

export function Header() {
  return (
    <div className="relative z-[var(--z-header)] hidden xl:block group">
      {/* site-header */}
      <header className="h-16 bg-surface border-b border-border grid grid-cols-[210px_minmax(0,1fr)_260px] items-center px-7 gap-5">
        {/* Logo */}
        <Link href="/" className="inline-flex items-center gap-2.5 min-w-0 text-text-brand font-extrabold tracking-tight leading-[0.9] no-underline">
          <span
            className="w-7 h-7 shrink-0 border-[3px] border-primary border-r-text-brand border-b-text-brand rounded-[9px_9px_12px_9px] rotate-[-45deg]"
            aria-hidden="true"
          />
          <span className="text-[15px] leading-tight">
            CHRISTIAN<br />MATE
          </span>
        </Link>

        {/* Nav */}
        <nav aria-label="주요 메뉴" className="grid grid-cols-6 items-center text-center gap-1">
          {NAV_ITEMS.map((item) => (
            <a
              key={item}
              href="#"
              className="text-sm font-semibold text-text-brand whitespace-nowrap hover:text-primary transition-colors duration-fast ease-standard"
            >
              {item}
            </a>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3.5 whitespace-nowrap text-text-brand">
          <div className="flex flex-col items-end leading-[1.1]">
            <small className="text-[11px] font-semibold text-text-secondary">무료 상담 받기</small>
            <strong className="text-[15px] font-extrabold">02)862-3920</strong>
          </div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold">
            <span className="w-[27px] h-[27px] rounded-full bg-avatar-accent text-white inline-flex items-center justify-center text-xs font-bold">
              C
            </span>
            <span>임승리</span>
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-1 text-xs font-bold hover:text-text transition-colors duration-fast ease-standard"
            aria-label="로그아웃"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden="true">
              <path d="M10 17l5-5-5-5" />
              <path d="M15 12H3" />
              <path d="M21 19V5a2 2 0 0 0-2-2h-5" />
            </svg>
            <span>로그아웃</span>
          </button>
        </div>
      </header>

      {/* Mega menu — revealed on hover via group */}
      <div
        className="absolute left-0 right-0 top-16 bg-surface border-b border-border hidden group-hover:grid grid-cols-[210px_minmax(0,1fr)_260px] gap-5 px-7 pt-6 pb-7 shadow-mega"
        aria-label="열린 헤더 메뉴"
      >
        <div className="col-start-2 grid grid-cols-6 gap-1 text-center">
          {MEGA_COLS.map((col, i) => (
            <div key={i} className="flex flex-col gap-3.5 items-center">
              {col.map((item) => (
                <a
                  key={item}
                  href="#"
                  className="text-sm font-medium text-text-brand whitespace-nowrap hover:text-primary transition-colors duration-fast ease-standard"
                >
                  {item}
                </a>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
