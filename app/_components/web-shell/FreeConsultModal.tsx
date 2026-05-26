"use client";

import { useEffect, useState } from "react";
import { Button } from "@/app/_components/ui/Button";
import {
  FREE_CONSULT_PHONE_DISPLAY,
  FREE_CONSULT_TEL,
} from "@/app/_components/web-shell/consultation";

const MOBILE_MAX_WIDTH = 1279;

type Props = {
  open: boolean;
  onClose: () => void;
};

export function FreeConsultModal({ open, onClose }: Props) {
  const [callMode, setCallMode] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${MOBILE_MAX_WIDTH}px)`);
    const sync = () => setCallMode(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[var(--z-modal)] flex items-center justify-center bg-backdrop-modal p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="bg-surface rounded-xl border border-border w-full max-w-[440px] overflow-hidden shadow-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="free-consult-title"
      >
        <div className="flex items-center gap-3 px-7 pt-6 pb-4">
          <h3
            id="free-consult-title"
            className="text-xl font-bold text-text m-0 flex-1"
          >
            무료 상담
          </h3>
        </div>

        <div className="px-7 pb-5 flex flex-col gap-3 items-center text-center">
          <p className="text-2xl font-extrabold tracking-tight text-text-brand m-0">
            {FREE_CONSULT_PHONE_DISPLAY}
          </p>
        </div>

        <div
          className={
            callMode
              ? "flex flex-col gap-3 px-7 py-4"
              : "flex items-center gap-2 px-7 py-4"
          }
        >
          {callMode ? (
            <>
              <a
                href={FREE_CONSULT_TEL}
                className="inline-flex h-10 w-full items-center justify-center rounded-md bg-primary px-4 text-sm font-semibold text-white no-underline transition-colors duration-fast ease-standard hover:bg-primary-hover"
              >
                통화하기
              </a>
              <Button
                variant="tertiary"
                size="md"
                type="button"
                layout="full"
                onClick={onClose}
              >
                취소
              </Button>
            </>
          ) : (
            <Button
              variant="primary"
              size="md"
              type="button"
              layout="full"
              onClick={onClose}
            >
              확인
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
