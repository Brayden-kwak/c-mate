import { CmLogo } from "@/app/_components/web-shell/CmLogo";
import { FooterCompanyToggle } from "@/app/_components/web-shell/FooterCompanyToggle";

const FOOTER_LINKS = [
  "크리스천메이트",
  "이용약관",
  "개인정보처리방침",
  "손해배상청구절차",
  "아동 안전 표준 정책",
];
const MOBILE_LINKS = [
  "이용약관",
  "개인정보처리방침",
  "손해배상청구절차",
  "아동 안전 표준 정책",
];

function FooterLink({
  label,
  className,
}: {
  label: string;
  className: string;
}) {
  return (
    <button type="button" className={className}>
      {label}
    </button>
  );
}

export function Footer() {
  return (
    <>
      {/* Desktop site-footer (xl+) */}
      <footer className="hidden xl:grid grid-cols-[minmax(0,1fr)_320px] gap-12 pt-14 pb-16 px-footer-x bg-surface border-t border-border text-text-secondary">
        <div>
          <div className="flex flex-wrap gap-4-5 mb-8-5">
            {FOOTER_LINKS.map((link) => (
              <FooterLink
                key={link}
                label={link}
                className="text-text-brand text-xs font-bold hover:text-primary transition-colors duration-fast ease-standard"
              />
            ))}
          </div>
          <CmLogo />
          <FooterCompanyToggle className="mt-4-5" />
          <p className="mt-3 text-text-brand-muted text-[11px] leading-relaxed m-0">
            2026 Copyright(c) 크리스천 메이트 All Right Reserved.
          </p>
        </div>
        <div className="text-right text-text-brand">
          <p className="mb-5-5 text-base font-extrabold leading-snug m-0">
            상급 크리스천들을 위한
            <br />
            선한 연결고리
          </p>
          <small className="text-[11px] font-bold text-text-brand-muted">
            무료 상담 받기
          </small>
          <p className="my-0.5 text-xl font-black tracking-tight">
            02)862-3920
          </p>
          <p className="text-text-brand-muted text-[11px] leading-relaxed m-0">
            평일 10:00 - 19:00
            <br />
            점심 12:30 - 13:30 · 주말/공휴일 휴무
          </p>
          <div className="mt-6 flex justify-end gap-2.5">
            {[0, 1, 2, 3].map((i) => (
              <span
                key={i}
                className="w-7-5 h-7-5 border border-border rounded-full inline-flex items-center justify-center text-text-brand-muted bg-surface"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-4 h-4"
                  aria-hidden="true"
                >
                  {i === 0 && (
                    <>
                      <path d="M6 9.5h12v8H6z" />
                      <path d="m10 9.5 2-3 2 3" />
                    </>
                  )}
                  {i === 1 && (
                    <>
                      <rect x="5" y="5" width="14" height="14" rx="4" />
                      <circle cx="12" cy="12" r="3" />
                      <path d="M16.5 7.5h.01" />
                    </>
                  )}
                  {i === 2 && (
                    <>
                      <path d="M5 7h14v10H5z" />
                      <path d="m5 8 7 5 7-5" />
                    </>
                  )}
                  {i === 3 && (
                    <>
                      <path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 8.5 8.5 0 1 1 8.7-10.2" />
                      <path d="M9 10h6" />
                      <path d="M9 14h4" />
                    </>
                  )}
                </svg>
              </span>
            ))}
          </div>
        </div>
      </footer>

      {/* Mobile footer (< xl) */}
      <footer className="xl:hidden bg-surface border-t border-border px-5 pt-mobile-site-footer-top pb-mobile-action-footer-scroll">
        <div className="flex items-baseline gap-1 mb-1.5 text-text-brand">
          <span className="text-lg font-bold">상담 문의</span>
          <strong className="text-[21px] font-extrabold tracking-tight">
            02)862-3920
          </strong>
        </div>
        <p className="text-text-brand-muted text-[13px] font-semibold leading-snug mb-4-5 m-0">
          평일 10:00 ~ 19:00 | 점심 12:30 ~ 13:30 | 주말·공휴일 휴무
        </p>
        <div className="flex flex-wrap gap-x-3.5 gap-y-2.5 pt-4-5 border-t border-border mb-4-5">
          {MOBILE_LINKS.map((link) => (
            <FooterLink
              key={link}
              label={link}
              className="text-text-brand-muted text-[13px] font-bold"
            />
          ))}
        </div>
        <FooterCompanyToggle className="mb-3" />
        <p className="text-text-brand-muted text-xs leading-snug m-0">
          2026 Copyright(c) 크리스천 메이트 All Right Reserved.
        </p>
      </footer>
    </>
  );
}
