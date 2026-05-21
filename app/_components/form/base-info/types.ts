export type AutoSaveState = "idle" | "saving" | "saved" | "error";

export type ProgressSection = {
  done: number;
  total: number;
};

export type ProgressMap = Record<
  "family" | "faith" | "education" | "appearance" | "lifestyle" | "photo",
  ProgressSection
>;
