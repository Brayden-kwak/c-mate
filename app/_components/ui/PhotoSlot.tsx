"use client";

import { useRef } from "react";

type PhotoSlotProps = {
  variant: "rep" | "normal";
  filled?: boolean;
  loading?: boolean;
  previewUrl?: string;
  onDelete?: () => void;
  onSetRepresentative?: () => void;
  onMoveLeft?: () => void;
  onMoveRight?: () => void;
  onUpload?: (file: File) => void;
};

type PhotobookThumbProps = {
  filled?: boolean;
  previewUrl?: string;
  onDelete?: () => void;
  onRemoveEmpty?: () => void;
  onUpload?: (file: File) => void;
  onMoveLeft?: () => void;
  onMoveRight?: () => void;
};

function RepresentativeBadge() {
  return (
    <span
      className="absolute top-2 left-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary text-white shadow-sm"
      aria-label="대표 사진"
    >
      <svg
        viewBox="0 0 24 24"
        className="h-3.5 w-3.5"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    </span>
  );
}

function ChevronLeft() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-3.5 h-3.5"
      aria-hidden="true"
    >
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-3.5 h-3.5"
      aria-hidden="true"
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

export function PhotoSlot({
  variant,
  filled,
  loading,
  previewUrl,
  onDelete,
  onSetRepresentative,
  onMoveLeft,
  onMoveRight,
  onUpload,
}: PhotoSlotProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const sizeClass =
    "w-[var(--spacing-photo-slot-width)] h-[var(--spacing-photo-slot-height)]";
  const isRepresentative = variant === "rep";

  if (loading) {
    return (
      <span
        aria-hidden="true"
        role="presentation"
        className={`${sizeClass} block rounded-lg animate-skeleton`}
      />
    );
  }
  const hasBottomRow =
    !isRepresentative && (onSetRepresentative || onMoveLeft || onMoveRight);

  if (filled) {
    return (
      <div
        className={`${sizeClass} relative rounded-lg overflow-hidden border bg-center bg-cover bg-no-repeat ${isRepresentative ? "border-primary shadow-md" : "border-transparent"} ${previewUrl ? "" : "bg-photo-gradient"}`}
        style={
          previewUrl ? { backgroundImage: `url("${previewUrl}")` } : undefined
        }
      >
        {isRepresentative && <RepresentativeBadge />}
        <div className="absolute top-2 right-2 flex gap-1">
          {onDelete && (
            <button
              type="button"
              onClick={onDelete}
              aria-label="사진 삭제"
              className="w-7 h-7 rounded-full flex items-center justify-center bg-black/40 text-white"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                className="w-3.5 h-3.5"
                aria-hidden="true"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>
        {hasBottomRow && (
          <div className="absolute bottom-2 left-0 right-0 flex items-center justify-between px-2">
            {onMoveLeft ? (
              <button
                type="button"
                onClick={onMoveLeft}
                aria-label="이전으로 이동"
                className="w-7 h-7 rounded-full flex items-center justify-center bg-black/40 text-white shrink-0"
              >
                <ChevronLeft />
              </button>
            ) : (
              <span className="w-7 h-7 shrink-0" />
            )}
            {onSetRepresentative && (
              <button
                type="button"
                onClick={onSetRepresentative}
                className="bg-surface text-text text-xs font-semibold px-2.5 py-1 rounded-pill border border-border-strong cursor-pointer"
              >
                ★ 대표 등록
              </button>
            )}
            {onMoveRight ? (
              <button
                type="button"
                onClick={onMoveRight}
                aria-label="다음으로 이동"
                className="w-7 h-7 rounded-full flex items-center justify-center bg-black/40 text-white shrink-0"
              >
                <ChevronRight />
              </button>
            ) : (
              <span className="w-7 h-7 shrink-0" />
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className={`${sizeClass} relative rounded-lg overflow-hidden bg-subtle border ${isRepresentative ? "border-primary shadow-md p-4" : "border-border p-3"} flex flex-col items-center justify-center text-center cursor-pointer hover:border-border-strong hover:bg-border-subtle transition-colors duration-fast ease-standard`}
      onClick={() => fileRef.current?.click()}
      role="button"
      tabIndex={0}
      aria-label="사진 추가"
      onKeyDown={(e) => e.key === "Enter" && fileRef.current?.click()}
    >
      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png"
        className="sr-only"
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file && onUpload) onUpload(file);
          e.target.value = "";
        }}
      />
      <span className="text-[32px] text-text-tertiary font-light leading-none">
        ＋
      </span>
      {isRepresentative && (
        <span className="mt-2 max-w-full text-[11px] font-medium leading-snug text-text-secondary">
          정면 얼굴이 잘 나온 사진 <br /> (타인에게 먼저 노출됩니다.)
        </span>
      )}
      {isRepresentative && <RepresentativeBadge />}
    </div>
  );
}

export function PhotobookThumb({
  filled,
  previewUrl,
  onDelete,
  onRemoveEmpty,
  onUpload,
  onMoveLeft,
  onMoveRight,
}: PhotobookThumbProps) {
  const fileRef = useRef<HTMLInputElement>(null);

  if (filled) {
    return (
      <div
        className={`relative aspect-4/3 w-full rounded-lg overflow-hidden bg-center bg-cover bg-no-repeat ${previewUrl ? "" : "bg-photo-gradient"}`}
        style={
          previewUrl ? { backgroundImage: `url("${previewUrl}")` } : undefined
        }
      >
        {onDelete && (
          <button
            type="button"
            onClick={onDelete}
            aria-label="사진 삭제"
            className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full flex items-center justify-center bg-black/40 text-white"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              className="w-3 h-3"
              aria-hidden="true"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
        {(onMoveLeft || onMoveRight) && (
          <div className="absolute bottom-1.5 left-0 right-0 flex items-center justify-between px-1.5">
            {onMoveLeft ? (
              <button
                type="button"
                onClick={onMoveLeft}
                aria-label="이전으로 이동"
                className="w-6 h-6 rounded-full flex items-center justify-center bg-black/40 text-white shrink-0"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-3 h-3"
                  aria-hidden="true"
                >
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
            ) : (
              <span className="w-6 h-6 shrink-0" />
            )}
            {onMoveRight ? (
              <button
                type="button"
                onClick={onMoveRight}
                aria-label="다음으로 이동"
                className="w-6 h-6 rounded-full flex items-center justify-center bg-black/40 text-white shrink-0"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-3 h-3"
                  aria-hidden="true"
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            ) : (
              <span className="w-6 h-6 shrink-0" />
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className="relative aspect-4/3 w-full rounded-lg overflow-hidden bg-subtle border border-border flex items-center justify-center cursor-pointer hover:border-border-strong hover:bg-border-subtle transition-colors duration-fast ease-standard"
      onClick={() => fileRef.current?.click()}
      role="button"
      tabIndex={0}
      aria-label="포토북 사진 추가"
      onKeyDown={(e) => e.key === "Enter" && fileRef.current?.click()}
    >
      {onRemoveEmpty && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemoveEmpty();
          }}
          aria-label="빈 포토북 슬롯 삭제"
          className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full border border-border bg-surface text-text-secondary flex items-center justify-center hover:bg-border-subtle transition-colors duration-fast ease-standard"
        >
          <span className="text-base leading-none" aria-hidden="true">
            −
          </span>
        </button>
      )}
      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png"
        className="sr-only"
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file && onUpload) onUpload(file);
          e.target.value = "";
        }}
      />
      <span className="text-[32px] text-text-tertiary font-light leading-none">
        ＋
      </span>
    </div>
  );
}
