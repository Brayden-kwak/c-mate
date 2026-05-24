"use client";

import type { ReactNode } from "react";
import { Button } from "@/app/_components/ui/Button";

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
  confirmDisabled?: boolean;
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
  confirmDisabled,
  variant = "primary",
  width = "md",
}: Props) {
  if (!open) return null;

  const widthClass = {
    sm: "max-w-[440px]",
    md: "max-w-[480px]",
    lg: "max-w-[560px]",
  }[width];
  const titleId = title ? "confirm-modal-title" : undefined;

  return (
    <div
      className="fixed inset-0 z-(--z-modal) flex items-center justify-center bg-backdrop-modal p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className={`bg-surface rounded-xl border border-border w-full ${widthClass} overflow-hidden shadow-modal`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-label={title ? undefined : (ariaLabel ?? "확인 모달")}
      >
        {/* Header */}
        {title ? (
          <div className="flex items-center gap-3 px-7 pt-6 pb-3">
            <h3 id={titleId} className="text-xl font-bold text-text m-0 flex-1">
              {title}
            </h3>
          </div>
        ) : null}

        {/* Body */}
        <div className="flex flex-col gap-5 px-7 py-5">{children}</div>

        {/* Footer */}
        <div className="px-7 pb-6">
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end">
            {cancelLabel && (
              <Button
                variant="tertiary"
                size="lg"
                type="button"
                onClick={onClose}
                layout="responsive"
              >
                {cancelLabel}
              </Button>
            )}
            {onConfirm && (
              <Button
                variant={variant}
                size="lg"
                type="button"
                onClick={onConfirm}
                disabled={confirmDisabled}
                layout="responsive"
              >
                {confirmLabel}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
