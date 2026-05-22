"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { Input } from "@/app/_components/ui/Input";
import { Button } from "@/app/_components/ui/Button";
import { InfoBox } from "@/app/_components/ui/InfoBox";

export type ChurchSelectResult = {
  church: string;
  denom: string;
  pastor: string;
  addr: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onSelect: (result: ChurchSelectResult) => void;
};

export function ChurchSearchModal({ open, onClose, onSelect }: Props) {
  const [query, setQuery] = useState("");
  const [showReg, setShowReg] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [regName, setRegName] = useState("");
  const [regDenom, setRegDenom] = useState("");
  const [regPastor, setRegPastor] = useState("");
  const [regAddr, setRegAddr] = useState("");
  const [regContact, setRegContact] = useState("");
  const [regReason, setRegReason] = useState(
    "검색 결과에 출석 교회가 없어 신규 등록을 요청합니다."
  );

  if (!open) return null;

  const hasQuery = query.trim().length > 0;

  function handleClose() {
    setQuery("");
    setShowReg(false);
    setSubmitted(false);
    onClose();
  }

  function handleSubmitReg() {
    if (!regName || !regDenom) return;
    setSubmitted(true);
    setShowReg(false);
    onSelect({
      church: regName,
      denom: regDenom,
      pastor: regPastor,
      addr: regAddr,
    });
  }

  return (
    <div
      className="fixed inset-0 z-[var(--z-modal)] flex items-center justify-center bg-backdrop-modal p-4"
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      <div
        className="bg-surface rounded-xl border border-border w-full max-w-[560px] overflow-hidden shadow-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="church-modal-title"
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-7 pt-6 pb-4">
          <h3 id="church-modal-title" className="text-xl font-bold text-text m-0 flex-1">
            교회 검색
          </h3>
          <button
            type="button"
            onClick={handleClose}
            aria-label="교회 검색 모달 닫기"
            className="w-8 h-8 rounded-full bg-subtle flex items-center justify-center text-text-secondary text-[13px] cursor-pointer hover:bg-border-subtle transition-colors duration-fast ease-standard"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="px-7 pb-6 flex flex-col gap-4 max-h-[65vh] overflow-y-auto">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="교회/교단명 검색"
            prefix={<span className="text-text-tertiary shrink-0 mr-0.5">🔍</span>}
            aria-label="교회 또는 교단명 검색"
            autoFocus
          />

          {/* Empty state */}
          {hasQuery && (
            <div className="bg-subtle rounded-lg py-7 px-5 flex flex-col items-center gap-2 text-center">
              <div className="text-[32px]">🔍</div>
              <div className="text-[15px] font-semibold">
                &lsquo;{query}&rsquo; 검색 결과가 없어요
              </div>
              <p className="text-[13px] text-text-secondary leading-relaxed m-0">
                등록되지 않은 교회/교단이라면 신청해 주세요.
                <br />
                또는 담당 매니저에게 문의해주시거나 대표번호로 연락 부탁드립니다.
              </p>
              <Button
                variant="primary"
                size="md"
                type="button"
                className="mt-2"
                onClick={() => setShowReg(!showReg)}
              >
                ＋ 교회/교단 가입 신청하기
              </Button>
            </div>
          )}

          {/* Registration form */}
          {showReg && (
            <div className="bg-surface border border-border rounded-lg p-[18px] flex flex-col gap-2.5">
              <div className="text-[13px] font-bold text-text mb-1">
                교회/교단 신규 등록 신청
              </div>
              <RegField label="교회명" required>
                <Input size="sm" value={regName} onChange={(e) => setRegName(e.target.value)} aria-label="신규 신청 교회명" />
              </RegField>
              <RegField label="교단" required>
                <Input size="sm" value={regDenom} onChange={(e) => setRegDenom(e.target.value)} aria-label="신규 신청 교단" />
              </RegField>
              <RegField label="담임목사" required>
                <Input size="sm" value={regPastor} onChange={(e) => setRegPastor(e.target.value)} aria-label="신규 신청 담임목사" />
              </RegField>
              <RegField label="교회 주소" required>
                <Input size="sm" value={regAddr} onChange={(e) => setRegAddr(e.target.value)} aria-label="신규 신청 교회 주소" />
              </RegField>
              <RegField label="연락처">
                <Input size="sm" value={regContact} onChange={(e) => setRegContact(e.target.value)} aria-label="신규 신청 연락처" />
              </RegField>
              <RegField label="신청 사유" required>
                <div className="border border-border rounded-md px-3 py-2.5 focus-within:border-primary focus-within:shadow-[0_0_0_3px_var(--color-primary-50)] transition-all duration-fast ease-standard bg-surface">
                  <textarea
                    className="w-full text-sm text-text bg-transparent border-none outline-none resize-none font-sans placeholder:text-text-tertiary leading-relaxed"
                    rows={3}
                    value={regReason}
                    onChange={(e) => setRegReason(e.target.value)}
                    aria-label="교회 가입 신청 사유"
                  />
                </div>
              </RegField>
              <div className="flex flex-col-reverse gap-3 mt-1 sm:flex-row sm:justify-end">
                <Button variant="tertiary" size="lg" type="button" onClick={() => setShowReg(false)} className="w-full sm:w-auto">
                  취소
                </Button>
                <Button variant="primary" size="lg" type="button" onClick={handleSubmitReg} className="w-full sm:w-auto">
                  신청하기
                </Button>
              </div>
            </div>
          )}

          {submitted && (
            <InfoBox variant="success">
              신청 후: 매니저팀 메일/Slack 통보 → 24시간 내 검토. 임시값으로 다음 단계 진행 가능.
            </InfoBox>
          )}
        </div>
      </div>
    </div>
  );
}

function RegField({ label, required, children }: { label: string; required?: boolean; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-1 text-xs font-semibold text-text">
        {label}
        {required && <span className="text-danger">*</span>}
      </div>
      {children}
    </div>
  );
}
