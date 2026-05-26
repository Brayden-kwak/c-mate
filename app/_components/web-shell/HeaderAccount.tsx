import { LogoutIcon } from "@/app/_components/web-shell/LogoutIcon";

const DISPLAY_NAME = "곽지훈";
const AVATAR_INITIAL = "C";

/** 데스크톱 헤더 프로필·로그아웃 공통 스택 (아이콘 20px + 12px 라벨) */
const HEADER_ACCOUNT_STACK_CLASS =
  "flex h-9 min-w-0 flex-col items-center justify-center gap-0.5 text-xs font-bold leading-tight";

const HEADER_ACCOUNT_ICON_CLASS = "w-5 h-5 shrink-0";

const avatarClass = [
  HEADER_ACCOUNT_ICON_CLASS,
  "rounded-full bg-avatar-accent text-white inline-flex items-center justify-center text-2xs font-bold",
].join(" ");

/** 데스크톱 헤더 — 아이콘·이름 세로 스택 */
export function HeaderUserProfile() {
  return (
    <div className={HEADER_ACCOUNT_STACK_CLASS}>
      <span className={avatarClass}>{AVATAR_INITIAL}</span>
      <span className="text-primary">{DISPLAY_NAME}</span>
    </div>
  );
}

/** 모바일 드로어 헤더 — 로고 우측, 아이콘·이름 가로 */
export function DrawerUserProfile() {
  return (
    <div className="inline-flex min-w-0 shrink-0 items-center gap-1.5 text-xs font-bold leading-tight whitespace-nowrap">
      <span className={avatarClass}>{AVATAR_INITIAL}</span>
      <span className="text-primary">{DISPLAY_NAME}</span>
    </div>
  );
}

type HeaderLogoutButtonProps = {
  mode?: "header" | "drawer";
};

const logoutModeClass: Record<
  NonNullable<HeaderLogoutButtonProps["mode"]>,
  string
> = {
  header: [HEADER_ACCOUNT_STACK_CLASS, "bg-transparent p-0 text-text-brand"].join(
    " ",
  ),
  drawer:
    "inline-flex h-10 w-full items-center justify-center rounded-md bg-subtle px-4 text-xs font-bold leading-tight text-text-secondary hover:bg-disabled hover:text-text",
};

export function HeaderLogoutButton({
  mode = "header",
}: HeaderLogoutButtonProps) {
  return (
    <button
      type="button"
      className={[
        "border-0 transition-colors duration-fast ease-standard",
        "hover:text-text focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2",
        logoutModeClass[mode],
      ].join(" ")}
      aria-label="로그아웃"
    >
      {mode === "header" ? (
        <LogoutIcon className="w-4 h-4 shrink-0" />
      ) : null}
      <span>로그아웃</span>
    </button>
  );
}
