"use client";

import { useEffect, useState } from "react";
import { Button } from "@/app/_components/ui/Button";
import { ModalCloseButton } from "@/app/_components/ui/ModalCloseButton";
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
          <h3 id="free-consult-title" className="text-xl font-bold text-text m-0 flex-1">
            무료 상담
          </h3>
          <ModalCloseButton onClick={onClose} />
        </div>

        <div className="px-7 pb-5 flex flex-col gap-3 items-center text-center">
          <p className="text-2xl font-extrabold tracking-tight text-text-brand m-0">
            {FREE_CONSULT_PHONE_DISPLAY}
          </p>
        </div>

        <div className="flex items-center gap-2 px-7 py-4 border-t border-border-subtle">
          {callMode ? (
            <a
              href={FREE_CONSULT_TEL}
              className="flex-1 inline-flex items-center justify-center h-10 px-4 rounded-md text-sm font-semibold bg-primary text-white hover:bg-primary-hover transition-colors duration-fast ease-standard no-underline"
            >
              통화하기
            </a>
          ) : (
            <span className="flex-1" />
          )}
          <Button variant="primary" size="md" type="button" layout={callMode ? undefined : "fill"} onClick={onClose}>
            확인
          </Button>
        </div>
      </div>
    </div>
  );
}
