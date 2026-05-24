const findVisibleAnchor = (anchorId: string): HTMLElement | null => {
  const nodes = document.querySelectorAll<HTMLElement>(
    `#${CSS.escape(anchorId)}`,
  );
  for (const el of nodes) {
    const rect = el.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
      return el;
    }
  }
  return nodes[0] ?? null;
};

/** sticky 헤더·progress bar 아래로 섹션 카드 시작이 보이도록 스크롤 */
export const scrollToFieldAnchor = (anchorId: string) => {
  const el = findVisibleAnchor(anchorId);
  if (!el) return;

  el.scrollIntoView({ behavior: "smooth", block: "start" });

  const accordionToggle = el.querySelector<HTMLButtonElement>(
    "button[aria-expanded='false']",
  );
  accordionToggle?.click();
};
