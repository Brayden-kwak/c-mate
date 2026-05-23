type Props = {
  onClick: () => void;
  "aria-label"?: string;
};

export function ModalCloseButton({ onClick, "aria-label": ariaLabel = "닫기" }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className="inline-flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center text-xl font-normal text-text-secondary transition-colors duration-fast ease-standard hover:text-text"
    >
      ✕
    </button>
  );
}
