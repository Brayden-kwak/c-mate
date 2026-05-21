"use client";

import Image from "next/image";
import { useState, useRef, useCallback, useEffect, type CSSProperties } from "react";
import { Card, CardHead, CardBody } from "@/app/_components/ui/Card";
import { Row } from "@/app/_components/ui/Row";
import { RadioGroup } from "@/app/_components/ui/RadioGroup";
import { Input } from "@/app/_components/ui/Input";
import { InfoBox } from "@/app/_components/ui/InfoBox";
import { HighlightBox } from "@/app/_components/ui/HighlightBox";
import { StyleChipGroup, type StyleGroup } from "@/app/_components/ui/StyleChipGroup";
import { PhotoSlot, PhotobookThumb } from "@/app/_components/ui/PhotoSlot";
import { Button } from "@/app/_components/ui/Button";
import { MobileCard, MobileField } from "@/app/_components/ui/MobileCard";
import { ConfirmModal } from "@/app/_components/modals/ConfirmModal";
import { ChurchSearchModal } from "@/app/_components/modals/ChurchSearchModal";
import { EducationSection } from "@/app/_components/form/base-info/EducationSection";
import type { AutoSaveState, ProgressMap, ProgressSection } from "@/app/_components/form/base-info/types";
import { sectionMeta } from "@/app/_components/form/base-info/utils";

type PhotoItem = { filled: boolean; previewUrl?: string; description?: string };
const REQUIRED_PROFILE_PHOTOS = 2;
const MAX_PHOTOBOOK_SLOTS = 8;

/* ===== Style groups ===== */
const STYLE_GROUPS: StyleGroup[] = [
  { label: "외모", options: ["귀여운", "청순한", "세련된", "지적인", "훈훈한"] },
  { label: "성격", options: ["다정한", "유머있는", "차분한", "활발한", "리더십"] },
  { label: "성품", options: ["성실", "책임감", "배려", "온화", "정직"] },
];

/* ===== Auto-save chip ===== */
function AutoSaveChip({ state }: { state: AutoSaveState }) {
  if (state === "saved") {
    return (
      <span className="inline-flex items-center gap-1.5 bg-success-light text-success px-3 py-1.5 rounded-pill text-[13px] font-medium before:content-[''] before:w-[7px] before:h-[7px] before:rounded-full before:bg-success shrink-0">
        방금 자동 저장됨
      </span>
    );
  }
  if (state === "saving") {
    return (
      <span className="inline-flex items-center gap-1.5 bg-subtle text-text-secondary px-3 py-1.5 rounded-pill text-[13px] font-medium shrink-0">
        저장 중…
      </span>
    );
  }
  if (state === "error") {
    return (
      <span className="inline-flex items-center gap-1.5 bg-danger-light text-danger px-3 py-1.5 rounded-pill text-[13px] font-medium shrink-0">
        저장 실패 · 재시도
      </span>
    );
  }
  return null;
}

/* ===== Delete preview tile (for photo delete modal) ===== */
function PhotoTile({ badge, faded }: { badge?: string; faded?: boolean }) {
  return (
    <div
      className={`w-[72px] h-[88px] rounded-md bg-photo-gradient flex items-end justify-center p-2 ${faded ? "opacity-40" : ""}`}
    >
      {badge && (
        <span className="bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-pill">
          {badge}
        </span>
      )}
    </div>
  );
}

/* ===== Section 1 ===== */
function FamilySection({
  onSave,
  onProgressChange,
}: {
  onSave: () => void;
  onProgressChange: (section: ProgressSection) => void;
}) {
  const [marriageExp, setMarriageExp] = useState("");
  const [region, setRegion] = useState("");
  const [address, setAddress] = useState("");
  const [addressDetail, setAddressDetail] = useState("");
  const [addrModalOpen, setAddrModalOpen] = useState(false);
  const [addrQuery, setAddrQuery] = useState("");
  const complete = Number(Boolean(marriageExp)) + Number(Boolean(address.trim()));

  useEffect(() => {
    onProgressChange({ done: complete, total: 2 });
  }, [complete, onProgressChange]);

  function applyAddress() {
    if (addrQuery.trim()) {
      setAddress(addrQuery.trim());
      onSave();
    }
    setAddrModalOpen(false);
    setAddrQuery("");
  }

  const desktopContent = (
    <Card>
      <CardHead tag="SECTION 1" title="가족 &amp; 거주" meta={sectionMeta({ done: complete, total: 2 })} />
      <CardBody>
        <Row label="결혼 경험" required helper="사실대로 선택해 주세요. 허위 기재 시 민/형사 책임을 묻습니다.">
          <RadioGroup
            name="marriageExperience"
            options={["초혼", "재혼", "사실혼인"]}
            value={marriageExp}
            onChange={(v) => { setMarriageExp(v); onSave(); }}
            aria-required
          />
        </Row>
        <Row label="주소" required helper="매니저 검수 및 거주지 기반 매칭에 사용됩니다.">
          <RadioGroup
            name="region"
            options={["국내", "해외"]}
            value={region}
            onChange={(v) => { setRegion(v); onSave(); }}
          />
          <div className="flex gap-2">
            <Input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              onBlur={onSave}
              aria-label="주소"
              layout="fill"
              placeholder="주소를 검색해 주세요"
            />
            <Button variant="secondary" size="md" type="button" onClick={() => setAddrModalOpen(true)}>
              주소 찾기
            </Button>
          </div>
          <HighlightBox
            title="상세 주소"
            optional
          >
            <Input
              placeholder="동/호수, 건물명 등 (선택 입력)"
              value={addressDetail}
              onChange={(e) => setAddressDetail(e.target.value)}
              onBlur={onSave}
              maxLength={50}
              aria-label="상세 주소"
            />
          </HighlightBox>
        </Row>
      </CardBody>
    </Card>
  );

  const mobileContent = (
    <MobileCard num={1} title="가족 & 거주" sub={sectionMeta({ done: complete, total: 2 })}>
      <MobileField label="결혼 경험" required>
        <RadioGroup
          name="m-marriageExperience"
          options={["초혼", "재혼", "사실혼인"]}
          value={marriageExp}
          onChange={(v) => { setMarriageExp(v); onSave(); }}
          aria-required
        />
      </MobileField>
      <MobileField label="주소" required>
        <RadioGroup
          name="m-region"
          options={["국내", "해외"]}
          value={region}
          onChange={(v) => { setRegion(v); onSave(); }}
        />
        <Input
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          onBlur={onSave}
          aria-label="주소"
          placeholder="주소를 검색해 주세요"
        />
        <Button variant="secondary" size="md" type="button" layout="full" onClick={() => setAddrModalOpen(true)}>
          주소 찾기
        </Button>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="text-[13px] font-semibold text-text">상세 주소</span>
            <span className="text-xs text-text-secondary">선택</span>
          </div>
          <Input
            placeholder="동/호수, 건물명 등"
            value={addressDetail}
            onChange={(e) => setAddressDetail(e.target.value)}
            onBlur={onSave}
            maxLength={50}
            aria-label="상세 주소"
          />
        </div>
      </MobileField>
    </MobileCard>
  );

  return (
    <>
      <div className="hidden xl:block">{desktopContent}</div>
      <div className="xl:hidden">{mobileContent}</div>

      {/* Address search modal */}
      <ConfirmModal
        open={addrModalOpen}
        onClose={() => { setAddrModalOpen(false); setAddrQuery(""); }}
        title="주소 찾기"
        confirmLabel="확인"
        onConfirm={applyAddress}
        width="sm"
      >
        <Input
          value={addrQuery}
          onChange={(e) => setAddrQuery(e.target.value)}
          placeholder="도로명 또는 지번 주소 입력"
          autoFocus
          aria-label="주소 검색"
          onKeyDown={(e) => e.key === "Enter" && applyAddress()}
        />
        <p className="text-[13px] text-text-secondary m-0">
          실제 서비스에서는 카카오/다음 우편번호 API를 연동합니다.
        </p>
      </ConfirmModal>
    </>
  );
}

/* ===== Section 2 ===== */
function FaithSection({
  onSave,
  onProgressChange,
}: {
  onSave: () => void;
  onProgressChange: (section: ProgressSection) => void;
}) {
  const [church, setChurch] = useState("");
  const [pastor, setPastor] = useState("");
  const [churchAddr, setChurchAddr] = useState("");
  const [churchAddrQuery, setChurchAddrQuery] = useState("");
  const [nativeFaith, setNativeFaith] = useState("");
  const [churchSearchOpen, setChurchSearchOpen] = useState(false);
  const [addrModalOpen, setAddrModalOpen] = useState(false);
  const complete =
    Number(Boolean(church.trim())) +
    Number(Boolean(pastor.trim())) +
    Number(Boolean(churchAddr.trim())) +
    Number(Boolean(nativeFaith));

  useEffect(() => {
    onProgressChange({ done: complete, total: 4 });
  }, [complete, onProgressChange]);

  function applyChurchAddr() {
    if (churchAddrQuery.trim()) {
      setChurchAddr(churchAddrQuery.trim());
      onSave();
    }
    setAddrModalOpen(false);
    setChurchAddrQuery("");
  }

  const desktopContent = (
    <Card>
      <CardHead tag="SECTION 2" title="신앙" meta={sectionMeta({ done: complete, total: 4 })} statusPill={complete === 4 ? "4/4 완료" : undefined} />
      <CardBody>
        <Row label="출석 교회명 / 교단" required helper="검색되지 않는 교회는 모달에서 즉시 가입 신청할 수 있어요.">
          <div className="flex gap-2">
            <Input
              value={church}
              onChange={(e) => setChurch(e.target.value)}
              onBlur={onSave}
              aria-label="출석 교회명 및 교단"
              layout="fill"
              placeholder="교회명을 검색해 주세요"
            />
            <Button variant="secondary" size="md" type="button" onClick={() => setChurchSearchOpen(true)}>
              교회 검색
            </Button>
          </div>
        </Row>
        <Row label="담임목사님 성함" required>
          <Input
            value={pastor}
            onChange={(e) => setPastor(e.target.value)}
            onBlur={onSave}
            aria-label="담임목사님 성함"
            placeholder="담임목사님 성함을 입력해 주세요"
          />
        </Row>
        <Row label="교회 주소" required helper="출석 교회의 주소를 입력해 주세요.">
          <div className="flex gap-2">
            <Input
              value={churchAddr}
              onChange={(e) => setChurchAddr(e.target.value)}
              onBlur={onSave}
              aria-label="교회 주소"
              layout="fill"
              placeholder="교회 주소를 검색해 주세요"
            />
            <Button variant="secondary" size="md" type="button" onClick={() => setAddrModalOpen(true)}>
              주소 찾기
            </Button>
          </div>
        </Row>
        <Row label="모태신앙 여부" required helper="본인 기준으로 선택해 주세요.">
          <RadioGroup
            name="nativeFaith"
            options={["그렇다", "그렇지 않다", "모태신앙은 아니지만 현재 믿고 있다"]}
            value={nativeFaith}
            onChange={(v) => { setNativeFaith(v); onSave(); }}
            aria-required
          />
        </Row>
      </CardBody>
    </Card>
  );

  const mobileContent = (
    <MobileCard num={2} title="신앙" sub={sectionMeta({ done: complete, total: 4 })} statusPill={complete === 4}>
      <MobileField label="출석 교회명 / 교단" required>
        <Input
          value={church}
          onChange={(e) => setChurch(e.target.value)}
          onBlur={onSave}
          aria-label="출석 교회명 및 교단"
          placeholder="교회명을 검색해 주세요"
        />
        <Button variant="secondary" size="md" type="button" layout="full" onClick={() => setChurchSearchOpen(true)}>
          교회 검색
        </Button>
      </MobileField>
      <MobileField label="담임목사님 성함" required>
        <Input
          value={pastor}
          onChange={(e) => setPastor(e.target.value)}
          onBlur={onSave}
          aria-label="담임목사님 성함"
        />
      </MobileField>
      <MobileField label="교회 주소" required>
        <Input
          value={churchAddr}
          onChange={(e) => setChurchAddr(e.target.value)}
          onBlur={onSave}
          aria-label="교회 주소"
        />
        <Button variant="secondary" size="md" type="button" layout="full" onClick={() => setAddrModalOpen(true)}>
          주소 찾기
        </Button>
      </MobileField>
      <MobileField label="모태신앙 여부" required desc="본인 기준으로 선택해 주세요.">
        <RadioGroup
          name="m-nativeFaith"
          options={["그렇다", "그렇지 않다", "모태신앙은 아니지만 현재 믿고 있다"]}
          value={nativeFaith}
          onChange={(v) => { setNativeFaith(v); onSave(); }}
          aria-required
        />
        <InfoBox>본인 기준으로 선택해 주세요.</InfoBox>
      </MobileField>
    </MobileCard>
  );

  return (
    <>
      <div className="hidden xl:block">{desktopContent}</div>
      <div className="xl:hidden">{mobileContent}</div>

      <ChurchSearchModal
        open={churchSearchOpen}
        onClose={() => setChurchSearchOpen(false)}
        onSelect={(v) => { setChurch(v); onSave(); }}
      />

      <ConfirmModal
        open={addrModalOpen}
        onClose={() => { setAddrModalOpen(false); setChurchAddrQuery(""); }}
        title="교회 주소 찾기"
        confirmLabel="확인"
        onConfirm={applyChurchAddr}
        width="sm"
      >
        <Input
          value={churchAddrQuery}
          onChange={(e) => setChurchAddrQuery(e.target.value)}
          placeholder="도로명 또는 지번 주소 입력"
          autoFocus
          aria-label="교회 주소 검색"
          onKeyDown={(e) => e.key === "Enter" && applyChurchAddr()}
        />
      </ConfirmModal>
    </>
  );
}

/* ===== Section 4 ===== */
function AppearanceSection({
  onSave,
  onProgressChange,
}: {
  onSave: () => void;
  onProgressChange: (section: ProgressSection) => void;
}) {
  const [height, setHeight] = useState("");
  const [bloodType, setBloodType] = useState("");
  const [bodyType, setBodyType] = useState("");
  const [styleValue, setStyleValue] = useState<Record<string, string[]>>({
    외모: [],
    성격: [],
    성품: [],
  });
  const selectedStyles = Object.values(styleValue).reduce((sum, values) => sum + values.length, 0);
  const complete =
    Number(Boolean(height.trim())) +
    Number(Boolean(bloodType)) +
    Number(Boolean(bodyType)) +
    Number(selectedStyles > 0);

  useEffect(() => {
    onProgressChange({ done: complete, total: 4 });
  }, [complete, onProgressChange]);

  const desktopContent = (
    <Card>
      <CardHead tag="SECTION 4" title="신체 &amp; 스타일" meta={sectionMeta({ done: complete, total: 4 })} />
      <CardBody>
        <Row label="신장" required helper="본인의 키를 입력해 주세요.">
          <Input
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            onBlur={onSave}
            suffix="cm"
            fieldWidth="height"
            min={140}
            max={220}
            aria-required
            aria-label="신장"
          />
        </Row>
        <Row label="혈액형" required>
          <RadioGroup
            name="bloodType"
            options={["A형", "B형", "AB형", "O형", "모름"]}
            value={bloodType}
            onChange={(v) => { setBloodType(v); onSave(); }}
            aria-required
          />
        </Row>
        <Row label="체형" required helper="옵션 위에 마우스를 올리면 정의가 표시됩니다.">
          <RadioGroup
            name="bodyType"
            options={["슬림", "슬림탄탄", "보통", "근육질", "통통", "글래머"]}
            value={bodyType}
            onChange={(v) => { setBodyType(v); onSave(); }}
            aria-required
          />
        </Row>
        <Row label="스타일" required helper="외모·성격·성품 각 그룹에서 자유롭게 선택 (합계 최대 5개).">
          <StyleChipGroup
            groups={STYLE_GROUPS}
            maxTotal={5}
            value={styleValue}
            onChange={(v) => { setStyleValue(v); onSave(); }}
          />
        </Row>
      </CardBody>
    </Card>
  );

  const mobileContent = (
    <MobileCard num={4} title="신체 &amp; 스타일" sub={sectionMeta({ done: complete, total: 4 })}>
      <MobileField label="신장" required>
        <Input type="number" value={height} onChange={(e) => setHeight(e.target.value)} onBlur={onSave} suffix="cm" fieldWidth="heightCompact" min={140} max={220} aria-label="신장" />
      </MobileField>
      <MobileField label="혈액형" required>
        <RadioGroup name="m-bloodType" options={["A형", "B형", "AB형", "O형", "모름"]} value={bloodType} onChange={(v) => { setBloodType(v); onSave(); }} aria-required />
      </MobileField>
      <MobileField label="체형" required>
        <RadioGroup name="m-bodyType" options={["슬림", "슬림탄탄", "보통", "근육질", "통통", "글래머"]} value={bodyType} onChange={(v) => { setBodyType(v); onSave(); }} aria-required />
      </MobileField>
      <MobileField label="스타일" required desc="외모·성격·성품 각 그룹에서 자유롭게 선택 (합계 최대 5개).">
        <StyleChipGroup groups={STYLE_GROUPS} maxTotal={5} value={styleValue} onChange={(v) => { setStyleValue(v); onSave(); }} />
      </MobileField>
    </MobileCard>
  );

  return (
    <>
      <div className="hidden xl:block">{desktopContent}</div>
      <div className="xl:hidden">{mobileContent}</div>
    </>
  );
}

/* ===== Section 5 ===== */
function LifestyleSection({
  onSave,
  onProgressChange,
}: {
  onSave: () => void;
  onProgressChange: (section: ProgressSection) => void;
}) {
  const [drinking, setDrinking] = useState("");
  const [smoking, setSmoking] = useState("");
  const [childrenPlan, setChildrenPlan] = useState("");
  const complete = Number(Boolean(drinking)) + Number(Boolean(smoking)) + Number(Boolean(childrenPlan));

  useEffect(() => {
    onProgressChange({ done: complete, total: 3 });
  }, [complete, onProgressChange]);

  const desktopContent = (
    <Card>
      <CardHead tag="SECTION 5" title="생활 습관 &amp; 가치관" meta={sectionMeta({ done: complete, total: 3 })} />
      <CardBody>
        <Row label="음주 여부" required>
          <RadioGroup
            name="drinking"
            options={["즐겨합니다", "보통", "어쩔 수 없을 때", "전혀 하지 않습니다"]}
            value={drinking}
            onChange={(v) => { setDrinking(v); onSave(); }}
            aria-required
          />
        </Row>
        <Row label="흡연 여부" required>
          <RadioGroup
            name="smoking"
            options={["전혀 안 함", "가끔", "자주"]}
            value={smoking}
            onChange={(v) => { setSmoking(v); onSave(); }}
            aria-required
          />
        </Row>
        <Row label="자녀 계획" required helper="결혼 후 자녀 계획에 대한 본인의 입장.">
          <RadioGroup
            name="childrenPlan"
            options={["자녀를 갖기 희망", "자녀 계획 없음", "상호 논의 후 결정", "고민중임"]}
            value={childrenPlan}
            onChange={(v) => { setChildrenPlan(v); onSave(); }}
            aria-required
          />
        </Row>
      </CardBody>
    </Card>
  );

  const mobileContent = (
    <MobileCard num={5} title="생활 습관 &amp; 가치관" sub={sectionMeta({ done: complete, total: 3 })}>
      <MobileField label="음주 여부" required>
        <RadioGroup name="m-drinking" options={["즐겨합니다", "보통", "어쩔 수 없을 때", "전혀 하지 않습니다"]} value={drinking} onChange={(v) => { setDrinking(v); onSave(); }} aria-required />
      </MobileField>
      <MobileField label="흡연 여부" required>
        <RadioGroup name="m-smoking" options={["전혀 안 함", "가끔", "자주"]} value={smoking} onChange={(v) => { setSmoking(v); onSave(); }} aria-required />
      </MobileField>
      <MobileField label="자녀 계획" required desc="결혼 후 자녀 계획에 대한 본인의 입장.">
        <RadioGroup name="m-childrenPlan" options={["자녀를 갖기 희망", "자녀 계획 없음", "상호 논의 후 결정", "고민중임"]} value={childrenPlan} onChange={(v) => { setChildrenPlan(v); onSave(); }} aria-required />
      </MobileField>
    </MobileCard>
  );

  return (
    <>
      <div className="hidden xl:block">{desktopContent}</div>
      <div className="xl:hidden">{mobileContent}</div>
    </>
  );
}

/* ===== Section 6 ===== */
function PhotoSection({
  onSave,
  onProgressChange,
}: {
  onSave: () => void;
  onProgressChange: (section: ProgressSection) => void;
}) {
  const [photos, setPhotos] = useState<PhotoItem[]>([{ filled: false }, { filled: false }, { filled: false }, { filled: false }]);
  const [pbPhotos, setPbPhotos] = useState<PhotoItem[]>([{ filled: false }]);
  const [deleteModal, setDeleteModal] = useState<{ index: number } | null>(null);
  const [pbDeleteModal, setPbDeleteModal] = useState<{ index: number } | null>(null);

  const filledCount = photos.filter((photo) => photo.filled).length;
  const pbFilledCount = pbPhotos.filter((photo) => photo.filled).length;
  const complete = Math.min(filledCount, REQUIRED_PROFILE_PHOTOS);
  const profilePhotoComplete = Number(filledCount >= REQUIRED_PROFILE_PHOTOS);
  const photobookComplete = Number(pbFilledCount > 0);

  useEffect(() => {
    onProgressChange({ done: profilePhotoComplete + photobookComplete, total: 2 });
  }, [profilePhotoComplete, photobookComplete, onProgressChange]);

  function requestDelete(index: number) {
    setDeleteModal({ index });
  }

  function confirmDelete() {
    if (!deleteModal) return;
    setPhotos((prev) => {
      const next = prev.map((photo, i) => (i === deleteModal.index ? { filled: false } : photo));
      const filled = next.filter((photo) => photo.filled);
      const empty = next.filter((photo) => !photo.filled);
      return [...filled, ...empty].slice(0, prev.length);
    });
    setDeleteModal(null);
    onSave();
  }

  function requestPbDelete(index: number) {
    setPbDeleteModal({ index });
  }

  function confirmPbDelete() {
    if (!pbDeleteModal) return;
    setPbPhotos((prev) => prev.map((photo, i) => (i === pbDeleteModal.index ? { filled: false } : photo)));
    setPbDeleteModal(null);
    onSave();
  }

  function handleUpload(index: number, file: File) {
    const previewUrl = URL.createObjectURL(file);
    setPhotos((prev) => prev.map((photo, i) => (i === index ? { ...photo, filled: true, previewUrl } : photo)));
    onSave();
  }

  function handlePbUpload(index: number, file: File) {
    const previewUrl = URL.createObjectURL(file);
    setPbPhotos((prev) => prev.map((photo, i) => (i === index ? { ...photo, filled: true, previewUrl } : photo)));
    onSave();
  }

  function updatePbDescription(index: number, description: string) {
    setPbPhotos((prev) => prev.map((photo, i) => (i === index ? { ...photo, description } : photo)));
  }

  function addPhotobookSlot() {
    setPbPhotos((prev) => {
      if (prev.length >= MAX_PHOTOBOOK_SLOTS) return prev;
      return [...prev, { filled: false }];
    });
    onSave();
  }

  function removePhotobookSlot(index: number) {
    setPbPhotos((prev) => {
      if (prev.length <= 1 || prev[index]?.filled) return prev;
      return prev.filter((_, i) => i !== index);
    });
    onSave();
  }

  function setRepresentative(index: number) {
    setPhotos((prev) => {
      const next = [...prev];
      const [chosen] = next.splice(index, 1);
      next.unshift(chosen);
      return next;
    });
    onSave();
  }

  const isRep = deleteModal?.index === 0;
  const hasReplacementPhoto = isRep && filledCount > 1;

  const photoGrid = (
    <div className="grid w-max grid-cols-2 gap-3.5">
      {photos.map((photo, i) => (
        <PhotoSlot
          key={i}
          variant={i === 0 ? "rep" : "normal"}
          filled={photo.filled}
          previewUrl={photo.previewUrl}
          onDelete={photo.filled ? () => requestDelete(i) : undefined}
          onSetRepresentative={photo.filled && i !== 0 ? () => setRepresentative(i) : undefined}
          onUpload={!photo.filled ? (file) => handleUpload(i, file) : undefined}
        />
      ))}
    </div>
  );

  const photoGuideImage = (
    <div className="hidden h-[var(--spacing-photo-guide-height)] flex-none self-start xl:block">
      <Image
        src="/images/base-info/picture-info.png"
        alt="사진 등록 TIP: 얼굴이 잘 보이는 좋은 사진과 피해야 할 사진 예시"
        width={545}
        height={900}
        className="block h-full w-auto rounded-lg object-contain"
      />
    </div>
  );

  const mobilePhotoGuideImage = (
    <Image
      src="/images/base-info/picture-info.png"
      alt="사진 등록 TIP: 얼굴이 잘 보이는 좋은 사진과 피해야 할 사진 예시"
      width={545}
      height={900}
      className="block h-auto w-[var(--spacing-photo-guide-mobile-width)] rounded-lg object-contain"
    />
  );

  const mobilePhotoCarousel = (
    <div className="flex w-full snap-x snap-mandatory gap-2.5 overflow-x-auto overscroll-x-contain pb-1">
      {photos.map((photo, i) => (
        <div key={i} className="flex-none snap-start">
          <PhotoSlot
            variant={i === 0 ? "rep" : "normal"}
            filled={photo.filled}
            previewUrl={photo.previewUrl}
            onDelete={photo.filled ? () => requestDelete(i) : undefined}
            onSetRepresentative={photo.filled && i !== 0 ? () => setRepresentative(i) : undefined}
            onUpload={!photo.filled ? (file) => handleUpload(i, file) : undefined}
          />
        </div>
      ))}
    </div>
  );

  const pbGrid = (
    <div className="grid w-full grid-cols-2 gap-2.5">
      {pbPhotos.map((photo, i) => (
        <div key={i} className="flex min-w-0 flex-col gap-2">
          <PhotobookThumb
            filled={photo.filled}
            previewUrl={photo.previewUrl}
            onDelete={photo.filled ? () => requestPbDelete(i) : undefined}
            onRemoveEmpty={!photo.filled && i > 0 ? () => removePhotobookSlot(i) : undefined}
            onUpload={!photo.filled ? (file) => handlePbUpload(i, file) : undefined}
          />
          {photo.filled && (
            <Input
              value={photo.description ?? ""}
              onChange={(e) => updatePbDescription(i, e.target.value)}
              onBlur={onSave}
              placeholder="사진에 대한 간단한 설명을 입력해주세요"
              fieldWidth="photobook"
              size="sm"
              aria-label={`포토북 ${i + 1} 사진 설명`}
            />
          )}
        </div>
      ))}
      {pbPhotos.length < MAX_PHOTOBOOK_SLOTS && (
        <button
          type="button"
          onClick={addPhotobookSlot}
          aria-label="포토북 슬롯 추가"
          className="aspect-[4/3] w-full rounded-lg border border-dashed border-border-strong bg-surface text-text-tertiary flex items-center justify-center hover:border-primary hover:text-primary hover:bg-primary-bg transition-colors duration-fast ease-standard"
        >
          <span className="text-[32px] font-light leading-none" aria-hidden="true">＋</span>
        </button>
      )}
    </div>
  );

  const mobilePbCarousel = (
    <div className="flex w-full snap-x snap-mandatory gap-2.5 overflow-x-auto overscroll-x-contain pb-1">
      {pbPhotos.map((photo, i) => (
        <div key={i} className="flex w-[var(--spacing-photobook-slot-width)] max-w-full flex-none snap-start flex-col gap-2">
          <PhotobookThumb
            filled={photo.filled}
            previewUrl={photo.previewUrl}
            onDelete={photo.filled ? () => requestPbDelete(i) : undefined}
            onRemoveEmpty={!photo.filled && i > 0 ? () => removePhotobookSlot(i) : undefined}
            onUpload={!photo.filled ? (file) => handlePbUpload(i, file) : undefined}
          />
          {photo.filled && (
            <Input
              value={photo.description ?? ""}
              onChange={(e) => updatePbDescription(i, e.target.value)}
              onBlur={onSave}
              placeholder="사진에 대한 간단한 설명을 입력해주세요"
              fieldWidth="photobook"
              size="sm"
              aria-label={`포토북 ${i + 1} 사진 설명`}
            />
          )}
        </div>
      ))}
      {pbPhotos.length < MAX_PHOTOBOOK_SLOTS && (
        <button
          type="button"
          onClick={addPhotobookSlot}
          aria-label="포토북 슬롯 추가"
          className="aspect-[4/3] w-[var(--spacing-photobook-slot-width)] max-w-full flex-none snap-start rounded-lg border border-dashed border-border-strong bg-surface text-text-tertiary flex items-center justify-center hover:border-primary hover:text-primary hover:bg-primary-bg transition-colors duration-fast ease-standard"
        >
          <span className="text-[32px] font-light leading-none" aria-hidden="true">＋</span>
        </button>
      )}
    </div>
  );

  const desktopContent = (
    <Card>
      <CardHead tag="SECTION 6" title="프로필 사진" meta={`필수 ${complete}/${REQUIRED_PROFILE_PHOTOS} 완료 · 포토북 선택`} />
      <CardBody>
        <div className="pb-5">
          <Row
            label="프로필 사진"
            required
            helper={
              <>
                <span className="font-semibold text-primary">2장 필수 등록</span>
                <br />
                나를 잘 표현할 수 있는 사진을 업로드 해주세요.
              </>
            }
          >
            <div className="flex items-start gap-4">
              <div className="flex-none">{photoGrid}</div>
              {photoGuideImage}
            </div>
            <InfoBox>이미지 파일 크기는 10MB 이하로 업로드해주세요</InfoBox>
          </Row>
        </div>
        <div className="pt-5">
          <Row label="포토북" helper={
            <>
              <span className="font-semibold text-primary">최대 8장</span>
              <br />
              나의 일상, 취미, 운동, 여행 등의 모습을 자유롭게 보여주는 공간입니다. 사진 추가 버튼을 눌러 추가해주세요.
            </>
          }>
            {pbGrid}
          </Row>
        </div>
      </CardBody>
    </Card>
  );

  const mobileContent = (
    <MobileCard num={6} title="프로필 사진" sub={`필수 ${complete}/${REQUIRED_PROFILE_PHOTOS} 완료 · 좌우 슬라이드`}>
      <MobileField label="프로필 사진" required>
        {mobilePhotoGuideImage}
        {mobilePhotoCarousel}
        <InfoBox>길게 누르면 위치 변경 모드. 좌/우 화살표 또는 drag로 이동.</InfoBox>
      </MobileField>
      <MobileField
        label="포토북"
        desc={
          <>
            <span className="font-semibold text-primary">최대 8장</span>
            까지 슬롯을 추가할 수 있습니다.
          </>
        }
      >
        {mobilePbCarousel}
      </MobileField>
    </MobileCard>
  );

  return (
    <>
      <div className="hidden xl:block">{desktopContent}</div>
      <div className="xl:hidden">{mobileContent}</div>

      <ConfirmModal
        open={!!deleteModal}
        onClose={() => setDeleteModal(null)}
        title={isRep ? "대표사진 삭제" : "사진 삭제"}
        confirmLabel="삭제"
        cancelLabel="취소"
        onConfirm={confirmDelete}
        variant="danger"
        width="md"
      >
        {hasReplacementPhoto && (
          <div className="flex items-start gap-3 bg-danger-light rounded-md p-4">
            <span className="text-danger text-lg font-bold shrink-0">!</span>
            <div>
              <div className="text-sm font-semibold text-text">두 번째 사진이 대표가 됩니다</div>
              <div className="text-[13px] text-text-secondary mt-1">해당 사진을 삭제하면 두 번째에 등록된 사진이 대표 사진으로 자동 승격됩니다.</div>
            </div>
          </div>
        )}
        {isRep ? (
          <div className="flex items-center gap-3 justify-center">
            <PhotoTile badge="★ 대표" faded />
            {hasReplacementPhoto && <span className="text-text-secondary text-lg">→</span>}
            {hasReplacementPhoto && <PhotoTile badge="★ 대표" />}
          </div>
        ) : (
          <p className="m-0 text-center text-sm font-semibold text-text">정말 삭제하시겠습니까?</p>
        )}
      </ConfirmModal>

      <ConfirmModal
        open={!!pbDeleteModal}
        onClose={() => setPbDeleteModal(null)}
        title="사진 삭제"
        confirmLabel="삭제"
        cancelLabel="취소"
        onConfirm={confirmPbDelete}
        variant="danger"
        width="md"
      >
        <p className="m-0 text-center text-sm font-semibold text-text">정말 삭제하시겠습니까?</p>
      </ConfirmModal>
    </>
  );
}

/* ===== d-footer ===== */
function DFooter({ autoSave }: { autoSave: AutoSaveState }) {
  const [desktopStyle, setDesktopStyle] = useState<CSSProperties>({});
  const [synced, setSynced] = useState(false);

  useEffect(() => {
    function syncFooter() {
      const frame = document.querySelector<HTMLElement>("[data-cmate-frame]");
      if (!frame || window.innerWidth < 1280) return;

      const rect = frame.getBoundingClientRect();
      const shouldDock = rect.bottom <= window.innerHeight;

      setSynced(true);
      if (shouldDock) {
        setDesktopStyle({
          left: `${Math.round(rect.left)}px`,
          width: `${Math.round(rect.width)}px`,
          bottom: `${Math.max(0, Math.round(window.innerHeight - rect.bottom))}px`,
        });
        return;
      }

      setDesktopStyle({
        left: `${Math.round(rect.left)}px`,
        width: `${Math.round(rect.width)}px`,
        bottom: "0px",
      });
    }

    syncFooter();
    window.addEventListener("resize", syncFooter);
    window.addEventListener("scroll", syncFooter, { passive: true });
    return () => {
      window.removeEventListener("resize", syncFooter);
      window.removeEventListener("scroll", syncFooter);
    };
  }, []);

  return (
    <>
      {/* Desktop sticky footer */}
      <div
        className={[
          "hidden xl:block fixed z-[var(--z-footer)] overflow-hidden rounded-b-lg bg-surface border-t border-x border-border shadow-footer",
          synced ? "" : "bottom-0 left-1/2 -translate-x-1/2 w-[min(calc(100%_-_360px),1040px)]",
        ].join(" ")}
        style={desktopStyle}
      >
        <div className="max-w-[1024px] mx-auto px-8 py-4 flex items-center gap-3">
          <AutoSaveChip state={autoSave} />
          <span className="flex-1" />
          <Button variant="secondary" size="lg" type="button">
            저장하기
          </Button>
          <Button variant="primary" size="lg" type="submit">
            다음
          </Button>
        </div>
      </div>
      {/* Mobile sticky footer */}
      <div className="xl:hidden fixed inset-x-0 bottom-0 z-[var(--z-footer)] border-t border-border bg-surface shadow-footer">
        <div className="mx-auto flex w-full max-w-[430px] gap-2 px-4 pt-3 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
          <Button variant="secondary" size="md" type="button" className="w-[110px] shrink-0">
            저장하기
          </Button>
          <Button variant="primary" size="md" type="submit" layout="fill">
            다음
          </Button>
        </div>
      </div>
    </>
  );
}

function ProgressHero({ progress }: { progress: ProgressSection }) {
  const percent = progress.total === 0 ? 0 : (progress.done / progress.total) * 100;

  return (
    <>
      <div className="bg-page px-8 pt-14 pb-8 hidden xl:block">
        <div className="max-w-[1024px] mx-auto flex flex-col gap-3">
          <div className="flex items-center gap-2 text-[11px] font-bold tracking-[0.16em]">
            <span className="text-primary">STEP 1 / 5</span>
            <span className="text-text-tertiary">·</span>
            <span className="text-text-secondary font-medium tracking-[0.08em]">기본정보 작성</span>
          </div>
          <h1 className="text-[32px] font-bold leading-snug m-0">기본정보</h1>
          <div className="flex items-center gap-3 pt-2">
            <div className="flex-1 h-1.5 bg-border-subtle rounded-pill overflow-hidden" role="progressbar" aria-valuemin={0} aria-valuemax={progress.total} aria-valuenow={progress.done}>
              <div className="h-full bg-primary rounded-pill transition-[width] duration-slow ease-emphasized" style={{ width: `${percent}%` }} />
            </div>
            <span className="text-[13px] font-semibold text-text-secondary">
              {progress.done} / {progress.total} 항목
            </span>
          </div>
        </div>
      </div>

      <div className="xl:hidden px-4 pt-4 pb-2">
        <p className="text-xs font-bold tracking-[0.16em] text-primary mb-1">STEP 1 / 5</p>
        <h1 className="text-2xl font-bold text-text m-0 mb-1">기본정보</h1>
        <p className="text-sm text-text-secondary m-0">
          매칭 알고리즘의 핵심 입력값입니다.
        </p>
      </div>
    </>
  );
}

/* ===== Root ===== */
export function BaseInfoForm() {
  const [autoSave, setAutoSave] = useState<AutoSaveState>("idle");
  const [progressMap, setProgressMap] = useState<ProgressMap>({
    family: { done: 0, total: 2 },
    faith: { done: 0, total: 4 },
    education: { done: 0, total: 5 },
    appearance: { done: 0, total: 4 },
    lifestyle: { done: 0, total: 3 },
    photo: { done: 0, total: 2 },
  });
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const progress = Object.values(progressMap).reduce<ProgressSection>(
    (acc, section) => ({ done: acc.done + section.done, total: acc.total + section.total }),
    { done: 0, total: 0 }
  );

  const { done: progressDone, total: progressTotal } = progress;

  useEffect(() => {
    window.dispatchEvent(new CustomEvent("cmate:progress", { detail: { done: progressDone, total: progressTotal } }));
  }, [progressDone, progressTotal]);

  const updateProgress = useCallback((key: keyof ProgressMap, section: ProgressSection) => {
    setProgressMap((current) => {
      const prev = current[key];
      if (prev.done === section.done && prev.total === section.total) return current;
      return { ...current, [key]: section };
    });
  }, []);

  const triggerAutoSave = useCallback(() => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    setAutoSave("idle");
    saveTimer.current = setTimeout(async () => {
      setAutoSave("saving");
      await new Promise<void>((r) => setTimeout(r, 700));
      setAutoSave("saved");
      setTimeout(() => setAutoSave("idle"), 3000);
    }, 500);
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Validation + next step would go here
  }

  return (
    <form noValidate onSubmit={handleSubmit} className="relative flex flex-col xl:gap-5 gap-3 pb-32 xl:pb-44">
      <ProgressHero progress={progress} />
      <FamilySection onSave={triggerAutoSave} onProgressChange={(section) => updateProgress("family", section)} />
      <FaithSection onSave={triggerAutoSave} onProgressChange={(section) => updateProgress("faith", section)} />
      <EducationSection onSave={triggerAutoSave} onProgressChange={(section) => updateProgress("education", section)} />
      <AppearanceSection onSave={triggerAutoSave} onProgressChange={(section) => updateProgress("appearance", section)} />
      <LifestyleSection onSave={triggerAutoSave} onProgressChange={(section) => updateProgress("lifestyle", section)} />
      <PhotoSection onSave={triggerAutoSave} onProgressChange={(section) => updateProgress("photo", section)} />
      <DFooter autoSave={autoSave} />
    </form>
  );
}
