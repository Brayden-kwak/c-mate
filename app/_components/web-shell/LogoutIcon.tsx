type LogoutIconProps = {
  className?: string;
};

/** 헤더 로그아웃 — [ ] + → (오른쪽으로 나가는 화살표) */
export function LogoutIcon({
  className = "w-5 h-5 shrink-0",
}: LogoutIconProps) {
  return (
    <svg
      viewBox="0 0 25 25"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M12.2448 1H1V23.5H12.25" />
      <path d="M17.875 17.875L23.5 12.25L17.875 6.625" />
      <path d="M7.24998 12.2449H23.5" />
    </svg>
  );
}
