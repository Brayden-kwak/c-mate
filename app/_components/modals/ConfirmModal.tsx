"use client";

import type { ReactNode } from "react";
import { Button } from "@/app/_components/ui/Button";
import { ModalCloseButton } from "@/app/_components/ui/ModalCloseButton";

type Props = {
  open: boolean;
  onClose: () => void;
  title?: string;
  /** Visible title이 없을 때 dialog 접근성 라벨 */
  ariaLabel?: string;
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
  ariaLabel,
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
        aria-label={title ? undefined : ariaLabel}
      >
        {/* Header */}
        <div
          className={
            title
              ? "flex items-center gap-3 px-7 pt-6 pb-3"
              : "flex items-center justify-end px-7 pt-6 pb-0"
          }
        >
          {title ? <h3 className="text-xl font-bold text-text m-0 flex-1">{title}</h3> : null}
          <ModalCloseButton onClick={onClose} />
        </div>

        {/* Body */}
        <div className="flex flex-col gap-5 px-7 py-10">{children}</div>

        {/* Footer */}
        <div className="border-t border-border-subtle px-7 pt-5 pb-6">
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end">
            {cancelLabel && (
              <Button variant="tertiary" size="lg" type="button" onClick={onClose} className="w-full sm:w-auto">
                {cancelLabel}
              </Button>
            )}
            {onConfirm && (
              <Button variant={variant} size="lg" type="button" onClick={onConfirm} className="w-full sm:w-auto">
                {confirmLabel}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
