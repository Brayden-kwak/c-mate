type LogoutIconProps = {
  className?: string;
};

/** 헤더 로그아웃 — [ ] + → (오른쪽으로 나가는 화살표) */
export function LogoutIcon({
  className = "w-5 h-5 shrink-0",
}: LogoutIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="M16 17l5-5-5-5" />
      <path d="M21 12H9" />
    </svg>
  );
}
