export type AutoSaveState = "idle" | "saving" | "saved" | "error";

export type ProgressSection = {
  done: number;
  total: number;
};

/** 섹션 헤더 배지 — statusComplete 미지정 시 done >= total 기준 */
export type SectionProgressBadge = ProgressSection & {
  statusComplete?: boolean;
};

export type ProgressMap = Record<
  "family" | "faith" | "education" | "appearance" | "lifestyle" | "photo",
  ProgressSection
>;
