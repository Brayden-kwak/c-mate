import type { ReactNode } from "react";

type Props = {
  id: string;
  children: ReactNode;
};

/** 섹션 카드(데스크톱 Card / 모바일 MobileCard) 시작 — 검증 후 스크롤 대상 */
export const SectionAnchor = ({ id, children }: Props) => {
  return (
    <div
      id={id}
      className="scroll-mt-form-field-scroll-margin xl:scroll-mt-form-field-scroll-margin-desktop"
    >
      {children}
    </div>
  );
};
