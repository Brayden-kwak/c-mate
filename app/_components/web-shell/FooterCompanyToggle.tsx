"use client";

import { useState } from "react";

const COMPANY_LINES = [
  "(주)크리스천메이트",
  "대표 : 임성진",
  "주소 : 서울 강남구 강남대로94길 18 분데스 강남 11층",
  "사업자등록번호 : 247-86-02178",
  "결혼중개업 신고번호 : 서울-강남-국내-23-0005호",
  "통신판매신고 : 2023-서울강남-02565",
  "FAX : 02-585-3920",
  "E-mail : cmate0910@c-mate.co.kr",
  "개인정보보호책임자 : 임성진 (sjyc00@c-mate.co.kr)",
];

function CompanyChevron({ open }: { open: boolean }) {
  return (
    <svg
      className={[
        "w-4 h-4 shrink-0 text-text-brand-muted transition-transform duration-fast ease-standard",
        open ? "rotate-180" : "",
      ].join(" ")}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

type Props = {
  className?: string;
};

export function FooterCompanyToggle({ className }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className={className}>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        className="inline-flex items-center gap-1.5 text-text-brand-muted text-[11px] font-bold hover:text-text-brand transition-colors duration-fast ease-standard"
      >
        <span>크리스천메이트 회사 정보</span>
        <CompanyChevron open={open} />
      </button>
      {open && (
        <p className="mt-2 text-text-brand-muted text-[11px] leading-relaxed whitespace-pre-line m-0">
          {COMPANY_LINES.join("\n")}
        </p>
      )}
    </div>
  );
}
