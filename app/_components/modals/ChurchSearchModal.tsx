"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { Input } from "@/app/_components/ui/Input";
import { Button } from "@/app/_components/ui/Button";
import { ConfirmModal } from "@/app/_components/modals/ConfirmModal";

export type ChurchSelectResult = {
  church: string;
  denom: string;
  pastor: string;
  addr: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  /**
   * 검색 결과 선택 시 호출. 현재 플로우는 "신청"만 지원하므로
   * 신청 완료 시점에는 호출되지 않는다 — 실제 등록 전이라 부모 필드는 비워둔다.
   */
  onSelect?: (result: ChurchSelectResult) => void;
};

type Step = "search" | "form" | "submitted";

const DEFAULT_REG_REASON =
  "검색 결과에 출석 교회가 없어 신규 등록을 요청합니다";

// 테스트용 mock 데이터셋. 실제 API 연동 전까지 이 목록과 부분일치(대소문자·공백 무시)되는 쿼리만 매칭된다.
const MOCK_CHURCHES: ChurchSelectResult[] = [
  {
    church: "온누리 교회",
    denom: "대한예수교장로회(합동)",
    pastor: "이재훈",
    addr: "서울특별시 용산구 한남대로 39",
  },
];

function normalize(value: string) {
  return value.replace(/\s+/g, "").toLowerCase();
}

export function ChurchSearchModal({ open, onClose, onSelect }: Props) {
  const [step, setStep] = useState<Step>("search");
  const [query, setQuery] = useState("");
  const [regName, setRegName] = useState("");
  const [regDenom, setRegDenom] = useState("");
  const [regPastor, setRegPastor] = useState("");
  const [regAddr, setRegAddr] = useState("");
  const [regContact, setRegContact] = useState("");
  const [regReason, setRegReason] = useState(DEFAULT_REG_REASON);

  if (!open) return null;

  const hasQuery = query.trim().length > 0;
  const normalizedQuery = normalize(query);
  const matches = hasQuery
    ? MOCK_CHURCHES.filter(
        (c) =>
          normalize(c.church).includes(normalizedQuery) ||
          normalize(c.denom).includes(normalizedQuery),
      )
    : [];
  const hasMatches = matches.length > 0;
  const canSubmitReg =
    regName.trim().length > 0 &&
    regDenom.trim().length > 0 &&
    regPastor.trim().length > 0 &&
    regAddr.trim().length > 0 &&
    regReason.trim().length > 0;
  const title = step === "search" ? "교회 검색" : "교회 등록 신청하기";

  function handleClose() {
    setStep("search");
    setQuery("");
    setRegName("");
    setRegDenom("");
    setRegPastor("");
    setRegAddr("");
    setRegContact("");
    setRegReason(DEFAULT_REG_REASON);
    onClose();
  }

  function handleGoToForm() {
    setRegName(query);
    setStep("form");
  }

  function handleSubmitReg() {
    if (!canSubmitReg) return;
    setStep("submitted");
  }

  function handleSelectMatch(match: ChurchSelectResult) {
    onSelect?.(match);
    handleClose();
  }

  if (step === "submitted") {
    return (
      <ConfirmModal
        open={open}
        onClose={handleClose}
        ariaLabel="교회 등록 신청 완료"
        confirmLabel="확인"
        cancelLabel={false}
        onConfirm={handleClose}
        width="sm"
      >
        <div className="text-center mt-2 mb-4">
          <p className="m-0 text-md font-semibold text-text">
            신청이 완료되었습니다
          </p>
          <p className="mt-2 mb-0 text-md leading-relaxed text-text-secondary">
            검토 후 연락드리겠습니다
          </p>
        </div>
      </ConfirmModal>
    );
  }

  return (
    <div
      className="fixed inset-0 z-(--z-modal) flex items-center justify-center bg-backdrop-modal p-4"
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
          <h3
            id="church-modal-title"
            className="text-xl font-bold text-text m-0 flex-1"
          >
            {title}
          </h3>
        </div>

        {/* Body */}
        <div className="px-7 pb-6 flex flex-col gap-4 max-h-[65vh] overflow-y-auto">
          {step === "search" && (
            <>
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="교회/교단명 검색"
                prefix={
                  <span className="text-text-tertiary shrink-0 mr-0.5">🔍</span>
                }
                aria-label="교회 또는 교단명 검색"
                autoFocus
              />
              {hasQuery && hasMatches && (
                <ul className="flex flex-col gap-2 m-0 p-0 list-none">
                  {matches.map((match) => (
                    <li key={match.church}>
                      <button
                        type="button"
                        onClick={() => handleSelectMatch(match)}
                        className="w-full text-left bg-surface border border-border rounded-lg p-4 hover:bg-subtle hover:border-primary focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_var(--color-primary-50)] transition-all duration-fast ease-standard"
                      >
                        <div className="text-md font-semibold text-text">
                          {match.church}
                        </div>
                        <div className="mt-1 text-sm text-text-secondary">
                          {match.denom} · {match.pastor}
                        </div>
                        <div className="mt-0.5 text-sm text-text-tertiary">
                          {match.addr}
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              {hasQuery && !hasMatches && (
                <div className="bg-subtle rounded-lg p-5 text-center">
                  <div className="text-md font-semibold text-text">
                    &lsquo;{query}&rsquo; 검색 결과가 없어요
                  </div>
                  <p className="mt-2 mb-0 text-md leading-relaxed text-text-secondary">
                    하단의 신청하기를 누르면 신규 등록 신청을 진행할 수 있어요
                  </p>
                </div>
              )}
            </>
          )}

          {step === "form" && (
            <div className="bg-surface border border-border rounded-lg p-4-5 flex flex-col gap-2.5">
              <div className="text-[13px] font-bold text-text mb-1">
                교회/교단 신규 등록 신청
              </div>
              <RegField label="교회명" required>
                <Input
                  size="sm"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  aria-label="신규 신청 교회명"
                />
              </RegField>
              <RegField label="교단" required>
                <Input
                  size="sm"
                  value={regDenom}
                  onChange={(e) => setRegDenom(e.target.value)}
                  aria-label="신규 신청 교단"
                />
              </RegField>
              <RegField label="담임목사" required>
                <Input
                  size="sm"
                  value={regPastor}
                  onChange={(e) => setRegPastor(e.target.value)}
                  aria-label="신규 신청 담임목사"
                />
              </RegField>
              <RegField label="교회 주소" required>
                <Input
                  size="sm"
                  value={regAddr}
                  onChange={(e) => setRegAddr(e.target.value)}
                  aria-label="신규 신청 교회 주소"
                />
              </RegField>
              <RegField label="연락처">
                <Input
                  size="sm"
                  value={regContact}
                  onChange={(e) => setRegContact(e.target.value)}
                  aria-label="신규 신청 연락처"
                />
              </RegField>
              <RegField label="신청 사유" required>
                <div className="border border-border rounded-md px-3 py-2.5 focus-within:border-primary focus-within:shadow-[0_0_0_3px_var(--color-primary-50)] transition-all duration-fast ease-standard bg-surface">
                  <textarea
                    className="w-full text-md text-text bg-transparent border-none outline-none resize-none font-sans placeholder:text-text-tertiary leading-relaxed"
                    rows={3}
                    value={regReason}
                    onChange={(e) => setRegReason(e.target.value)}
                    aria-label="교회 가입 신청 사유"
                  />
                </div>
              </RegField>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-7 pb-6">
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end">
            {step === "search" && (
              <>
                <Button
                  variant="tertiary"
                  size="lg"
                  type="button"
                  onClick={handleClose}
                  layout="responsive"
                >
                  취소
                </Button>
                {hasQuery && !hasMatches && (
                  <Button
                    variant="primary"
                    size="lg"
                    type="button"
                    onClick={handleGoToForm}
                    layout="responsive"
                  >
                    신청하기
                  </Button>
                )}
              </>
            )}
            {step === "form" && (
              <>
                <Button
                  variant="tertiary"
                  size="lg"
                  type="button"
                  onClick={handleClose}
                  layout="responsive"
                >
                  취소
                </Button>
                <Button
                  variant="primary"
                  size="lg"
                  type="button"
                  onClick={handleSubmitReg}
                  disabled={!canSubmitReg}
                  layout="responsive"
                >
                  신청하기
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function RegField({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: ReactNode;
}) {
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
