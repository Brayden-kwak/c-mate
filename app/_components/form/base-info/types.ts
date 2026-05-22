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

export type MissingRequiredField = {
  id: string;
  label: string;
};

export type BaseInfoSectionKey = keyof ProgressMap;

export const BASE_INFO_SECTION_ORDER: BaseInfoSectionKey[] = [
  "family",
  "faith",
  "education",
  "appearance",
  "lifestyle",
  "photo",
];

export const BASE_INFO_SECTION_ANCHOR_ID: Record<BaseInfoSectionKey, string> = {
  family: "section-family",
  faith: "section-faith",
  education: "section-education",
  appearance: "section-appearance",
  lifestyle: "section-lifestyle",
  photo: "section-photo",
};
