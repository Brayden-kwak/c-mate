"use client";

import type { ReactNode } from "react";
import { Button } from "@/app/_components/ui/Button";

type Props = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string | false;
  onConfirm?: () => void;
  variant?: "danger" | "primary";
  width?: "sm" | "md" | "lg";
};

export function ConfirmModal({
  open,
  onClose,
  title,
  children,
  confirmLabel = "확인",
  cancelLabel = "취소",
  onConfirm,
  variant = "primary",
  width = "md",
}: Props) {
  if (!open) return null;

  const widthClass = { sm: "max-w-[440px]", md: "max-w-[480px]", lg: "max-w-[560px]" }[width];

  return (
    <div
      className="fixed inset-0 z-[var(--z-modal)] flex items-center justify-center bg-backdrop-modal p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className={`bg-surface rounded-xl border border-border w-full ${widthClass} overflow-hidden shadow-modal`}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-7 pt-6 pb-4">
          <h3 className="text-xl font-bold text-text m-0 flex-1">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="w-8 h-8 rounded-full bg-subtle flex items-center justify-center text-text-secondary text-[13px] cursor-pointer hover:bg-border-subtle transition-colors duration-fast ease-standard"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="px-7 pb-5 flex flex-col gap-4">{children}</div>

        {/* Footer */}
        <div className="flex items-center gap-2 px-7 py-4 border-t border-border-subtle">
          <span className="flex-1" />
          {cancelLabel && (
            <Button variant="tertiary" size="md" type="button" onClick={onClose}>
              {cancelLabel}
            </Button>
          )}
          {onConfirm && (
            <Button variant={variant} size="md" type="button" onClick={onConfirm}>
              {confirmLabel}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
