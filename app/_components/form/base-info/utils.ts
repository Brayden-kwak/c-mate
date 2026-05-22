import type { ProgressSection } from "./types";

export const sectionMeta = (section: ProgressSection) => {
  return `${section.total}개 항목 · ${section.done}/${section.total} 완료`;
};
