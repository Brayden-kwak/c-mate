"use client";

import {
  useState,
  useRef,
  useCallback,
  useEffect,
  useMemo,
  type CSSProperties,
  type ReactNode,
} from "react";
import { Card, CardHead, CardBody } from "@/app/_components/ui/Card";
import { Row } from "@/app/_components/ui/Row";
import { RadioGroup } from "@/app/_components/ui/RadioGroup";
import { Input } from "@/app/_components/ui/Input";
import { InfoBox } from "@/app/_components/ui/InfoBox";
import { HighlightBox } from "@/app/_components/ui/HighlightBox";
import { CountPill } from "@/app/_components/ui/CountPill";
import { FormProgressBar } from "@/app/_components/ui/FormProgressBar";
import {
  StyleChipGroup,
  type StyleGroup,
} from "@/app/_components/ui/StyleChipGroup";
import { PhotoSlot, PhotobookThumb } from "@/app/_components/ui/PhotoSlot";
import { Button } from "@/app/_components/ui/Button";
import { ToastProvider, useToast } from "@/app/_components/ui/Toast";
import { MobileCard, MobileField } from "@/app/_components/ui/MobileCard";
import { ConfirmModal } from "@/app/_components/modals/ConfirmModal";
import { ChurchSearchModal } from "@/app/_components/modals/ChurchSearchModal";
import { EducationSection } from "@/app/_components/form/base-info/EducationSection";
import { ProfilePhotoGuide } from "@/app/_components/form/base-info/ProfilePhotoGuide";
import { SectionAnchor } from "@/app/_components/form/base-info/SectionAnchor";
import { scrollToFieldAnchor } from "@/app/_components/form/base-info/scrollToFieldAnchor";
import {
  BASE_INFO_SECTION_ANCHOR_ID,
  BASE_INFO_SECTION_ORDER,
  type AutoSaveState,
  type BaseInfoSectionKey,
  type MissingRequiredField,
  type ProgressMap,
  type ProgressSection,
} from "@/app/_components/form/base-info/types";
import { apiFetch } from "@/app/_lib/api";
import { presignAndUpload } from "@/app/_lib/upload";
import type {
  AppearanceSectionData,
  BaseInfoPayload,
  FaithSectionData,
  FamilySectionData,
  LifestyleSectionData,
  PhotoSectionData,
} from "@/app/_lib/base-info";

const SECTION_FAMILY = BASE_INFO_SECTION_ANCHOR_ID.family;
const SECTION_FAITH = BASE_INFO_SECTION_ANCHOR_ID.faith;
const SECTION_APPEARANCE = BASE_INFO_SECTION_ANCHOR_ID.appearance;
const SECTION_LIFESTYLE = BASE_INFO_SECTION_ANCHOR_ID.lifestyle;
const SECTION_PHOTO = BASE_INFO_SECTION_ANCHOR_ID.photo;
type PhotoItem = {
  filled: boolean;
  previewUrl?: string;
  key?: string;
  description?: string;
};
const REQUIRED_PROFILE_PHOTOS = 2;
const PHOTO_SECTION_PROGRESS_TOTAL = 2;
const MAX_PHOTOBOOK_SLOTS = 8;

const MISSING_FIELD_LABEL_OVERRIDE: Record<string, string> = {
  "프로필 사진": "프로필 사진 (2장 이상)",
};

const ResponsiveView = ({
  desktop,
  mobile,
}: {
  desktop: ReactNode;
  mobile: ReactNode;
}): ReactNode => {
  return (
    <>
      <div className="hidden xl:block">{desktop}</div>
      <div className="xl:hidden">{mobile}</div>
    </>
  );
};

/* ===== Style groups ===== */
const STYLE_SELECTION_MAX = 5;

const STYLE_GROUPS: StyleGroup[] = [
  {
    label: "외모 스타일",
    options: [
      "귀여운",
      "청순한",
      "세련된",
      "지적인",
      "훈훈한",
      "터프한",
      "스타일리시한",
      "스포티한",
    ],
  },
  {
    label: "성격/기질",
    options: [
      "다정한",
      "유머있는",
      "차분한",
      "활발한",
      "대범한",
      "열정적인",
      "낙천적인",
      "섬세한",
    ],
  },
  {
    label: "성품",
    options: [
      "성실한",
      "책임감 있는",
      "정직한",
      "듬직한",
      "끈기있는",
      "배려심 있는",
      "겸손한",
    ],
  },
];

/* ===== Auto-save chip ===== */
const AutoSaveChip = ({ state }: { state: AutoSaveState }) => {
  if (state === "saved") {
    return (
      <span className="inline-flex items-center gap-1.5 bg-success-light text-success px-3 py-1.5 rounded-pill text-[13px] font-medium shrink-0">
        <span aria-hidden="true" className="text-xs font-bold leading-none">
          ✓
        </span>
        저장되었습니다
      </span>
    );
  }
  if (state === "saving") {
    return (
      <span className="inline-flex items-center gap-1.5 bg-info-light text-info px-3 py-1.5 rounded-pill text-[13px] font-medium shrink-0">
        <span className="chip-spinner" />
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
};

/* ===== Section 1 ===== */
const FamilySection = ({
  onSave,
  onProgressChange,
  onMissingFieldsChange,
  onDataChange,
  initialData,
}: {
  onSave: () => void;
  onProgressChange: (section: ProgressSection) => void;
  onMissingFieldsChange: (missing: MissingRequiredField[]) => void;
  onDataChange?: (data: FamilySectionData) => void;
  initialData?: FamilySectionData;
}) => {
  const [marriageExp, setMarriageExp] = useState(
    initialData?.marriageExp ?? "",
  );
  const [region, setRegion] = useState(initialData?.region ?? "");
  const [address, setAddress] = useState(initialData?.address ?? "");
  const [addressDetail, setAddressDetail] = useState(
    initialData?.addressDetail ?? "",
  );
  const [addrModalOpen, setAddrModalOpen] = useState(false);
  const [addrQuery, setAddrQuery] = useState("");
  const complete =
    Number(Boolean(marriageExp)) + Number(Boolean(address.trim()));

  useEffect(() => {
    onProgressChange({ done: complete, total: 2 });
  }, [complete, onProgressChange]);

  useEffect(() => {
    const missing: MissingRequiredField[] = [];
    if (!marriageExp) missing.push({ id: SECTION_FAMILY, label: "결혼 경험" });
    if (!address.trim()) missing.push({ id: SECTION_FAMILY, label: "주소" });
    onMissingFieldsChange(missing);
  }, [marriageExp, address, onMissingFieldsChange]);

  useEffect(() => {
    onDataChange?.({ marriageExp, region, address, addressDetail });
  }, [marriageExp, region, address, addressDetail, onDataChange]);

  const applyAddress = () => {
    if (addrQuery.trim()) {
      setAddress(addrQuery.trim());
      onSave();
    }
    setAddrModalOpen(false);
    setAddrQuery("");
  };

  const desktopContent = (
    <SectionAnchor id={SECTION_FAMILY}>
      <Card>
        <CardHead
          tag="SECTION 1"
          title="혼인 &amp; 거주"
          progress={{ done: complete, total: 2 }}
        />
        <CardBody>
          <Row
            label="결혼 경험"
            required
            helper="사실대로 선택해 주세요. 허위 기재 시 민/형사 책임을 묻습니다."
          >
            <RadioGroup
              name="marriageExperience"
              options={["초혼", "재혼", "사실혼인"]}
              value={marriageExp}
              onChange={(v) => {
                setMarriageExp(v);
                onSave();
              }}
              aria-required
            />
          </Row>
          <Row
            label="주소"
            required
            helper="매니저 검수 및 거주지 기반 매칭에 사용됩니다."
          >
            <RadioGroup
              name="region"
              options={["국내", "해외"]}
              value={region}
              onChange={(v) => {
                setRegion(v);
                onSave();
              }}
            />
            <div className="flex gap-2">
              <Input
                value={address}
                disabled
                aria-label="주소"
                layout="fill"
                placeholder="주소를 검색해 주세요"
              />
              <Button
                variant="secondary"
                size="md"
                type="button"
                onClick={() => setAddrModalOpen(true)}
              >
                주소 검색
              </Button>
            </div>
            <HighlightBox title="상세 주소" optional>
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
    </SectionAnchor>
  );

  const mobileContent = (
    <SectionAnchor id={SECTION_FAMILY}>
      <MobileCard
        num={1}
        title="혼인 & 거주"
        progress={{ done: complete, total: 2 }}
      >
        <MobileField label="결혼 경험" required>
          <RadioGroup
            name="m-marriageExperience"
            options={["초혼", "재혼", "사실혼인"]}
            value={marriageExp}
            onChange={(v) => {
              setMarriageExp(v);
              onSave();
            }}
            aria-required
          />
        </MobileField>
        <MobileField label="주소" required>
          <RadioGroup
            name="m-region"
            options={["국내", "해외"]}
            value={region}
            onChange={(v) => {
              setRegion(v);
              onSave();
            }}
          />
          <Input
            value={address}
            disabled
            aria-label="주소"
            placeholder="주소를 검색해 주세요"
          />
          <Button
            variant="secondary"
            size="md"
            type="button"
            layout="full"
            onClick={() => setAddrModalOpen(true)}
          >
            주소 검색
          </Button>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="text-[13px] font-semibold text-text">
                상세 주소
              </span>
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
    </SectionAnchor>
  );

  return (
    <>
      <ResponsiveView desktop={desktopContent} mobile={mobileContent} />

      {/* Address search modal */}
      <ConfirmModal
        open={addrModalOpen}
        onClose={() => {
          setAddrModalOpen(false);
          setAddrQuery("");
        }}
        title="주소 검색"
        confirmLabel="확인"
        onConfirm={applyAddress}
        width="sm"
      >
        <Input
          value={addrQuery}
          onChange={(e) => setAddrQuery(e.target.value)}
          placeholder="임시로 주소를 입력하시면 인풋 박스에 채워집니다"
          autoFocus
          aria-label="주소 검색"
          onKeyDown={(e) => e.key === "Enter" && applyAddress()}
        />
        <p className="text-[13px] text-text-secondary m-0">
          실제 카카오 주소 검색창이 뜨며, 해당 창은 테스트용입니다
        </p>
      </ConfirmModal>
    </>
  );
};

const CHURCH_SEARCH_HELPER =
  "교회 검색 후 교회명·교단·담임목사·주소가 자동으로 채워집니다.";

/* ===== Section 2 ===== */
const FaithSection = ({
  onSave,
  onProgressChange,
  onMissingFieldsChange,
  onDataChange,
  initialData,
}: {
  onSave: () => void;
  onProgressChange: (section: ProgressSection) => void;
  onMissingFieldsChange: (missing: MissingRequiredField[]) => void;
  onDataChange?: (data: FaithSectionData) => void;
  initialData?: FaithSectionData;
}) => {
  const [church, setChurch] = useState(initialData?.church ?? "");
  const [denom, setDenom] = useState(initialData?.denom ?? "");
  const [pastor, setPastor] = useState(initialData?.pastor ?? "");
  const [churchAddr, setChurchAddr] = useState(initialData?.churchAddr ?? "");
  const [nativeFaith, setNativeFaith] = useState(
    initialData?.nativeFaith ?? "",
  );
  const [churchSearchOpen, setChurchSearchOpen] = useState(false);
  const complete =
    Number(Boolean(church.trim() && denom.trim())) +
    Number(Boolean(pastor.trim())) +
    Number(Boolean(churchAddr.trim())) +
    Number(Boolean(nativeFaith));

  useEffect(() => {
    onProgressChange({ done: complete, total: 4 });
  }, [complete, onProgressChange]);

  useEffect(() => {
    const missing: MissingRequiredField[] = [];
    if (!church.trim() || !denom.trim())
      missing.push({ id: SECTION_FAITH, label: "출석 교회명 / 교단" });
    if (!pastor.trim())
      missing.push({ id: SECTION_FAITH, label: "담임목사님 성함" });
    if (!churchAddr.trim())
      missing.push({ id: SECTION_FAITH, label: "교회 주소" });
    if (!nativeFaith)
      missing.push({ id: SECTION_FAITH, label: "모태신앙 여부" });
    onMissingFieldsChange(missing);
  }, [church, denom, pastor, churchAddr, nativeFaith, onMissingFieldsChange]);

  useEffect(() => {
    onDataChange?.({ church, denom, pastor, churchAddr, nativeFaith });
  }, [church, denom, pastor, churchAddr, nativeFaith, onDataChange]);

  const desktopContent = (
    <SectionAnchor id={SECTION_FAITH}>
      <Card>
        <CardHead
          tag="SECTION 2"
          title="신앙"
          progress={{ done: complete, total: 4 }}
        />
        <CardBody>
          <Row
            label="출석 교회명 / 교단"
            required
            helper={CHURCH_SEARCH_HELPER}
          >
            <div className="flex gap-2">
              <Input
                value={church}
                disabled
                aria-label="출석 교회명"
                layout="fill"
              />
              <Input value={denom} disabled aria-label="교단" layout="fill" />
              <Button
                variant="secondary"
                size="md"
                type="button"
                onClick={() => setChurchSearchOpen(true)}
              >
                교회 검색
              </Button>
            </div>
          </Row>
          <Row label="담임목사님 성함" required>
            <Input value={pastor} disabled aria-label="담임목사님 성함" />
          </Row>
          <Row label="교회 주소" required>
            <Input value={churchAddr} disabled aria-label="교회 주소" />
          </Row>
          <Row label="모태신앙 여부" required>
            <RadioGroup
              name="nativeFaith"
              options={["그렇다", "그렇지 않다"]}
              value={nativeFaith}
              onChange={(v) => {
                setNativeFaith(v);
                onSave();
              }}
              aria-required
            />
          </Row>
        </CardBody>
      </Card>
    </SectionAnchor>
  );

  const mobileContent = (
    <SectionAnchor id={SECTION_FAITH}>
      <MobileCard num={2} title="신앙" progress={{ done: complete, total: 4 }}>
        <MobileField
          label="출석 교회명 / 교단"
          required
          desc={CHURCH_SEARCH_HELPER}
        >
          <div className="flex gap-2">
            <Input
              value={church}
              disabled
              aria-label="출석 교회명"
              layout="fill"
            />
            <Input value={denom} disabled aria-label="교단" layout="fill" />
          </div>
          <Button
            variant="secondary"
            size="md"
            type="button"
            layout="full"
            onClick={() => setChurchSearchOpen(true)}
          >
            교회 검색
          </Button>
        </MobileField>
        <MobileField label="담임목사님 성함" required>
          <Input value={pastor} disabled aria-label="담임목사님 성함" />
        </MobileField>
        <MobileField label="교회 주소" required>
          <Input value={churchAddr} disabled aria-label="교회 주소" />
        </MobileField>
        <MobileField label="모태신앙 여부" required>
          <RadioGroup
            name="m-nativeFaith"
            options={["그렇다", "그렇지 않다"]}
            value={nativeFaith}
            onChange={(v) => {
              setNativeFaith(v);
              onSave();
            }}
            aria-required
          />
        </MobileField>
      </MobileCard>
    </SectionAnchor>
  );

  return (
    <>
      <ResponsiveView desktop={desktopContent} mobile={mobileContent} />

      <ChurchSearchModal
        open={churchSearchOpen}
        onClose={() => setChurchSearchOpen(false)}
        onSelect={(result) => {
          setChurch(result.church);
          setDenom(result.denom);
          setPastor(result.pastor);
          setChurchAddr(result.addr);
          onSave();
        }}
      />
    </>
  );
};

/* ===== Section 4 ===== */
const AppearanceSection = ({
  onSave,
  onProgressChange,
  onMissingFieldsChange,
  onDataChange,
  initialData,
}: {
  onSave: () => void;
  onProgressChange: (section: ProgressSection) => void;
  onMissingFieldsChange: (missing: MissingRequiredField[]) => void;
  onDataChange?: (data: AppearanceSectionData) => void;
  initialData?: AppearanceSectionData;
}) => {
  const [height, setHeight] = useState(initialData?.height ?? "");
  const [bloodType, setBloodType] = useState(initialData?.bloodType ?? "");
  const [bodyType, setBodyType] = useState(initialData?.bodyType ?? "");
  const [styleValue, setStyleValue] = useState<Record<string, string[]>>({
    "외모 스타일":
      initialData?.styles.filter((style) =>
        STYLE_GROUPS[0]?.options.includes(style),
      ) ?? [],
    "성격/기질":
      initialData?.styles.filter((style) =>
        STYLE_GROUPS[1]?.options.includes(style),
      ) ?? [],
    성품:
      initialData?.styles.filter((style) =>
        STYLE_GROUPS[2]?.options.includes(style),
      ) ?? [],
  });
  const selectedStyles = Object.values(styleValue).reduce(
    (sum, values) => sum + values.length,
    0,
  );
  const complete =
    Number(Boolean(height.trim())) +
    Number(Boolean(bloodType)) +
    Number(Boolean(bodyType)) +
    Number(selectedStyles > 0);

  useEffect(() => {
    onProgressChange({ done: complete, total: 4 });
  }, [complete, onProgressChange]);

  useEffect(() => {
    const missing: MissingRequiredField[] = [];
    if (!height.trim()) missing.push({ id: SECTION_APPEARANCE, label: "신장" });
    if (!bloodType) missing.push({ id: SECTION_APPEARANCE, label: "혈액형" });
    if (!bodyType) missing.push({ id: SECTION_APPEARANCE, label: "체형" });
    if (selectedStyles === 0)
      missing.push({ id: SECTION_APPEARANCE, label: "스타일" });
    onMissingFieldsChange(missing);
  }, [height, bloodType, bodyType, selectedStyles, onMissingFieldsChange]);

  useEffect(() => {
    const styles = Object.values(styleValue).flat();
    onDataChange?.({ height, bloodType, bodyType, styles });
  }, [height, bloodType, bodyType, styleValue, onDataChange]);

  const styleCountBadge = (
    <CountPill done={selectedStyles} total={STYLE_SELECTION_MAX} />
  );

  const desktopContent = (
    <SectionAnchor id={SECTION_APPEARANCE}>
      <Card>
        <CardHead
          tag="SECTION 4"
          title="신체 &amp; 스타일"
          progress={{ done: complete, total: 4 }}
        />
        <CardBody>
          <Row label="신장" required>
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
              options={["A형", "B형", "AB형", "O형"]}
              value={bloodType}
              onChange={(v) => {
                setBloodType(v);
                onSave();
              }}
              aria-required
            />
          </Row>
          <Row label="체형" required>
            <RadioGroup
              name="bodyType"
              options={["슬림", "슬림탄탄", "보통", "통통", "근육질", "글래머"]}
              value={bodyType}
              onChange={(v) => {
                setBodyType(v);
                onSave();
              }}
              aria-required
            />
          </Row>
          <Row
            label="스타일"
            required
            labelAlign="start"
            labelBadge={styleCountBadge}
          >
            <StyleChipGroup
              groups={STYLE_GROUPS}
              maxTotal={STYLE_SELECTION_MAX}
              value={styleValue}
              onChange={(v) => {
                setStyleValue(v);
                onSave();
              }}
            />
          </Row>
        </CardBody>
      </Card>
    </SectionAnchor>
  );

  const mobileContent = (
    <SectionAnchor id={SECTION_APPEARANCE}>
      <MobileCard
        num={4}
        title="신체 &amp; 스타일"
        progress={{ done: complete, total: 4 }}
      >
        <MobileField label="신장" required>
          <Input
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            onBlur={onSave}
            suffix="cm"
            fieldWidth="heightCompact"
            min={140}
            max={220}
            aria-label="신장"
          />
        </MobileField>
        <MobileField label="혈액형" required>
          <RadioGroup
            name="m-bloodType"
            options={["A형", "B형", "AB형", "O형"]}
            value={bloodType}
            onChange={(v) => {
              setBloodType(v);
              onSave();
            }}
            aria-required
          />
        </MobileField>
        <MobileField label="체형" required>
          <RadioGroup
            name="m-bodyType"
            options={["슬림", "슬림탄탄", "보통", "근육질", "통통", "글래머"]}
            value={bodyType}
            onChange={(v) => {
              setBodyType(v);
              onSave();
            }}
            aria-required
          />
        </MobileField>
        <MobileField
          label="스타일"
          required
          desc="외모 스타일·성격/기질·성품 각 그룹에서 자유롭게 선택 (합계 최대 5개)."
          labelBadge={
            <CountPill
              done={selectedStyles}
              total={STYLE_SELECTION_MAX}
              size="sm"
            />
          }
        >
          <StyleChipGroup
            groups={STYLE_GROUPS}
            maxTotal={STYLE_SELECTION_MAX}
            value={styleValue}
            onChange={(v) => {
              setStyleValue(v);
              onSave();
            }}
          />
        </MobileField>
      </MobileCard>
    </SectionAnchor>
  );

  return <ResponsiveView desktop={desktopContent} mobile={mobileContent} />;
};

/* ===== Section 5 ===== */
const LifestyleSection = ({
  onSave,
  onProgressChange,
  onMissingFieldsChange,
  onDataChange,
  initialData,
}: {
  onSave: () => void;
  onProgressChange: (section: ProgressSection) => void;
  onMissingFieldsChange: (missing: MissingRequiredField[]) => void;
  onDataChange?: (data: LifestyleSectionData) => void;
  initialData?: LifestyleSectionData;
}) => {
  const [drinking, setDrinking] = useState(initialData?.drinking ?? "");
  const [smoking, setSmoking] = useState(initialData?.smoking ?? "");
  const [childrenPlan, setChildrenPlan] = useState(
    initialData?.childrenPlan ?? "",
  );
  const complete =
    Number(Boolean(drinking)) +
    Number(Boolean(smoking)) +
    Number(Boolean(childrenPlan));

  useEffect(() => {
    onProgressChange({ done: complete, total: 3 });
  }, [complete, onProgressChange]);

  useEffect(() => {
    const missing: MissingRequiredField[] = [];
    if (!drinking) missing.push({ id: SECTION_LIFESTYLE, label: "음주 여부" });
    if (!smoking) missing.push({ id: SECTION_LIFESTYLE, label: "흡연 여부" });
    if (!childrenPlan)
      missing.push({ id: SECTION_LIFESTYLE, label: "자녀 계획" });
    onMissingFieldsChange(missing);
  }, [drinking, smoking, childrenPlan, onMissingFieldsChange]);

  useEffect(() => {
    onDataChange?.({ drinking, smoking, childrenPlan });
  }, [drinking, smoking, childrenPlan, onDataChange]);

  const desktopContent = (
    <SectionAnchor id={SECTION_LIFESTYLE}>
      <Card>
        <CardHead
          tag="SECTION 5"
          title="생활 습관 &amp; 가치관"
          progress={{ done: complete, total: 3 }}
        />
        <CardBody>
          <Row label="음주 여부" required>
            <RadioGroup
              name="drinking"
              options={["즐겨함", "보통", "어쩔 수 없을 때", "전혀 하지 않음"]}
              value={drinking}
              onChange={(v) => {
                setDrinking(v);
                onSave();
              }}
              aria-required
            />
          </Row>
          <Row label="흡연 여부" required>
            <RadioGroup
              name="smoking"
              options={["흡연", "비흡연"]}
              value={smoking}
              onChange={(v) => {
                setSmoking(v);
                onSave();
              }}
              aria-required
            />
          </Row>
          <Row label="자녀 계획" required>
            <RadioGroup
              name="childrenPlan"
              options={[
                "자녀를 갖기 희망",
                "자녀 계획 없음",
                "상호 논의 후 결정",
                "고민중",
              ]}
              value={childrenPlan}
              onChange={(v) => {
                setChildrenPlan(v);
                onSave();
              }}
              aria-required
            />
          </Row>
        </CardBody>
      </Card>
    </SectionAnchor>
  );

  const mobileContent = (
    <SectionAnchor id={SECTION_LIFESTYLE}>
      <MobileCard
        num={5}
        title="생활 습관 &amp; 가치관"
        progress={{ done: complete, total: 3 }}
      >
        <MobileField label="음주 여부" required>
          <RadioGroup
            name="m-drinking"
            options={["즐겨함", "보통", "어쩔 수 없을 때", "전혀 하지 않음"]}
            value={drinking}
            onChange={(v) => {
              setDrinking(v);
              onSave();
            }}
            aria-required
          />
        </MobileField>
        <MobileField label="흡연 여부" required>
          <RadioGroup
            name="m-smoking"
            options={["흡연", "비흡연"]}
            value={smoking}
            onChange={(v) => {
              setSmoking(v);
              onSave();
            }}
            aria-required
          />
        </MobileField>
        <MobileField label="자녀 계획" required>
          <RadioGroup
            name="m-childrenPlan"
            options={[
              "자녀를 갖기 희망",
              "자녀 계획 없음",
              "상호 논의 후 결정",
              "고민중",
            ]}
            value={childrenPlan}
            onChange={(v) => {
              setChildrenPlan(v);
              onSave();
            }}
            aria-required
          />
        </MobileField>
      </MobileCard>
    </SectionAnchor>
  );

  return <ResponsiveView desktop={desktopContent} mobile={mobileContent} />;
};

/* ===== Section 6 ===== */
const PhotoSection = ({
  onSave,
  onProgressChange,
  onMissingFieldsChange,
  onDataChange,
  initialData,
}: {
  onSave: () => void;
  onProgressChange: (section: ProgressSection) => void;
  onMissingFieldsChange: (missing: MissingRequiredField[]) => void;
  onDataChange?: (data: PhotoSectionData) => void;
  initialData?: PhotoSectionData;
}) => {
  const [photos, setPhotos] = useState<PhotoItem[]>(() => {
    const saved =
      initialData?.photos.map((photo) => ({
        filled: true,
        key: photo.key,
        previewUrl: photo.url,
        description: photo.description,
      })) ?? [];
    return [...saved, ...Array<PhotoItem>(4).fill({ filled: false })].slice(
      0,
      4,
    );
  });
  const [pbPhotos, setPbPhotos] = useState<PhotoItem[]>(() => {
    const saved =
      initialData?.pbPhotos.map((photo) => ({
        filled: true,
        key: photo.key,
        previewUrl: photo.url,
        description: photo.description,
      })) ?? [];
    return saved.length > 0 ? saved : [{ filled: false }];
  });
  const blobUrlsRef = useRef<Set<string>>(new Set());
  const photoUploadSeqRef = useRef<number[]>([0, 0, 0, 0]);
  const pbUploadSeqRef = useRef<Record<number, number>>({});

  const createBlobUrl = (file: File): string => {
    const url = URL.createObjectURL(file);
    blobUrlsRef.current.add(url);
    return url;
  };

  const revokeBlobUrl = (url: string | undefined) => {
    if (!url?.startsWith("blob:")) return;
    URL.revokeObjectURL(url);
    blobUrlsRef.current.delete(url);
  };

  useEffect(() => {
    const urls = blobUrlsRef.current;
    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);
  const [deleteModal, setDeleteModal] = useState<{ index: number } | null>(
    null,
  );
  const [pbDeleteModal, setPbDeleteModal] = useState<{ index: number } | null>(
    null,
  );
  const [uploading, setUploading] = useState<boolean[]>([
    false,
    false,
    false,
    false,
  ]);
  const pbCarouselRef = useRef<HTMLDivElement>(null);
  const prevPbLengthRef = useRef(1);

  const filledCount = photos.filter((photo) => photo.filled).length;
  const pbFilledCount = pbPhotos.filter((photo) => photo.filled).length;
  const profilePhotoCheckpoint = Number(filledCount >= REQUIRED_PROFILE_PHOTOS);
  const photobookCheckpoint = Number(pbFilledCount > 0);
  const photoSectionDone = profilePhotoCheckpoint + photobookCheckpoint;
  const photoSectionProgress = {
    done: photoSectionDone,
    total: PHOTO_SECTION_PROGRESS_TOTAL,
    statusComplete: profilePhotoCheckpoint === 1,
  };

  useEffect(() => {
    onProgressChange({
      done: photoSectionDone,
      total: PHOTO_SECTION_PROGRESS_TOTAL,
    });
  }, [photoSectionDone, onProgressChange]);

  useEffect(() => {
    const missing: MissingRequiredField[] = [];
    if (filledCount < REQUIRED_PROFILE_PHOTOS) {
      missing.push({ id: SECTION_PHOTO, label: "프로필 사진" });
    }
    onMissingFieldsChange(missing);
  }, [filledCount, onMissingFieldsChange]);

  useEffect(() => {
    const photoData = photos
      .filter((p) => p.filled && p.key)
      .map((p) => ({
        key: p.key!,
        url: p.previewUrl,
        description: p.description,
      }));
    const pbData = pbPhotos
      .filter((p) => p.filled && p.key)
      .map((p) => ({
        key: p.key!,
        url: p.previewUrl,
        description: p.description,
      }));
    onDataChange?.({ photos: photoData, pbPhotos: pbData });
  }, [photos, pbPhotos, onDataChange]);

  useEffect(() => {
    if (pbPhotos.length > prevPbLengthRef.current) {
      const el = pbCarouselRef.current;
      if (el) el.scrollTo({ left: el.scrollWidth, behavior: "smooth" });
    }
    prevPbLengthRef.current = pbPhotos.length;
  }, [pbPhotos.length]);

  const requestDelete = (index: number) => {
    setDeleteModal({ index });
  };

  const confirmDelete = () => {
    if (!deleteModal) return;
    photoUploadSeqRef.current[deleteModal.index] =
      (photoUploadSeqRef.current[deleteModal.index] ?? 0) + 1;
    revokeBlobUrl(photos[deleteModal.index]?.previewUrl);
    setPhotos((prev) => {
      const next = prev.map((photo, i) =>
        i === deleteModal.index ? { filled: false } : photo,
      );
      const filled = next.filter((photo) => photo.filled);
      const empty = next.filter((photo) => !photo.filled);
      return [...filled, ...empty].slice(0, prev.length);
    });
    setDeleteModal(null);
    onSave();
  };

  const requestPbDelete = (index: number) => {
    setPbDeleteModal({ index });
  };

  const confirmPbDelete = () => {
    if (!pbDeleteModal) return;
    pbUploadSeqRef.current[pbDeleteModal.index] =
      (pbUploadSeqRef.current[pbDeleteModal.index] ?? 0) + 1;
    revokeBlobUrl(pbPhotos[pbDeleteModal.index]?.previewUrl);
    setPbPhotos((prev) =>
      prev.map((photo, i) =>
        i === pbDeleteModal.index ? { filled: false } : photo,
      ),
    );
    setPbDeleteModal(null);
    onSave();
  };

  const handleUpload = async (index: number, file: File) => {
    const requestId = (photoUploadSeqRef.current[index] ?? 0) + 1;
    photoUploadSeqRef.current[index] = requestId;
    const previousPhoto = photos[index] ?? { filled: false };
    const previewUrl = createBlobUrl(file);
    setPhotos((prev) =>
      prev.map((photo, i) => (i === index ? { ...photo, previewUrl } : photo)),
    );
    setUploading((prev) => prev.map((v, i) => (i === index ? true : v)));
    try {
      const key = await presignAndUpload(file);
      if (photoUploadSeqRef.current[index] !== requestId) {
        revokeBlobUrl(previewUrl);
        return;
      }
      revokeBlobUrl(previousPhoto.previewUrl);
      setPhotos((prev) =>
        prev.map((photo, i) =>
          i === index ? { ...photo, filled: true, key } : photo,
        ),
      );
      onSave();
    } catch {
      revokeBlobUrl(previewUrl);
      if (photoUploadSeqRef.current[index] === requestId) {
        setPhotos((prev) =>
          prev.map((photo, i) => (i === index ? previousPhoto : photo)),
        );
      }
    } finally {
      if (photoUploadSeqRef.current[index] === requestId) {
        setUploading((prev) => prev.map((v, i) => (i === index ? false : v)));
      }
    }
  };

  const handlePbUpload = async (index: number, file: File) => {
    const requestId = (pbUploadSeqRef.current[index] ?? 0) + 1;
    pbUploadSeqRef.current[index] = requestId;
    const previousPhoto = pbPhotos[index] ?? { filled: false };
    const previewUrl = createBlobUrl(file);
    setPbPhotos((prev) =>
      prev.map((photo, i) => (i === index ? { ...photo, previewUrl } : photo)),
    );
    try {
      const key = await presignAndUpload(file);
      if (pbUploadSeqRef.current[index] !== requestId) {
        revokeBlobUrl(previewUrl);
        return;
      }
      revokeBlobUrl(previousPhoto.previewUrl);
      setPbPhotos((prev) =>
        prev.map((photo, i) =>
          i === index ? { ...photo, filled: true, key } : photo,
        ),
      );
      onSave();
    } catch {
      revokeBlobUrl(previewUrl);
      if (pbUploadSeqRef.current[index] === requestId) {
        setPbPhotos((prev) =>
          prev.map((photo, i) => (i === index ? previousPhoto : photo)),
        );
      }
    }
  };

  const updatePbDescription = (index: number, description: string) => {
    setPbPhotos((prev) =>
      prev.map((photo, i) => (i === index ? { ...photo, description } : photo)),
    );
  };

  const addPhotobookSlot = () => {
    setPbPhotos((prev) => {
      if (prev.length >= MAX_PHOTOBOOK_SLOTS) return prev;
      return [...prev, { filled: false }];
    });
    onSave();
  };

  const removePhotobookSlot = (index: number) => {
    setPbPhotos((prev) => {
      if (prev.length <= 1 || prev[index]?.filled) return prev;
      return prev.filter((_, i) => i !== index);
    });
    onSave();
  };

  const movePhoto = (index: number, direction: "left" | "right") => {
    setPhotos((prev) => {
      const target = direction === "left" ? index - 1 : index + 1;
      if (target < 1 || target >= prev.length) return prev;
      const next = [...prev];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
    onSave();
  };

  const movePbPhoto = (index: number, direction: "left" | "right") => {
    setPbPhotos((prev) => {
      const target = direction === "left" ? index - 1 : index + 1;
      if (target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
    onSave();
  };

  const setRepresentative = (index: number) => {
    setPhotos((prev) => {
      const next = [...prev];
      const [chosen] = next.splice(index, 1);
      next.unshift(chosen);
      return next;
    });
    onSave();
  };

  const isRep = deleteModal?.index === 0;
  const hasReplacementPhoto = isRep && filledCount > 1;
  const isRepDeleteBlocked = isRep && !hasReplacementPhoto;

  const photoGrid = (
    <div className="grid w-max grid-cols-2 gap-3.5">
      {photos.map((photo, i) => (
        <PhotoSlot
          key={i}
          variant={i === 0 ? "rep" : "normal"}
          filled={photo.filled}
          loading={uploading[i]}
          previewUrl={photo.previewUrl}
          onDelete={photo.filled ? () => requestDelete(i) : undefined}
          onSetRepresentative={
            photo.filled && i !== 0 ? () => setRepresentative(i) : undefined
          }
          onMoveLeft={
            photo.filled && i > 1 && photos[i - 1]?.filled
              ? () => movePhoto(i, "left")
              : undefined
          }
          onMoveRight={
            photo.filled &&
            i !== 0 &&
            i < photos.length - 1 &&
            photos[i + 1]?.filled
              ? () => movePhoto(i, "right")
              : undefined
          }
          onUpload={!photo.filled ? (file) => handleUpload(i, file) : undefined}
        />
      ))}
    </div>
  );

  const mobilePhotoGuide = <ProfilePhotoGuide className="mb-3 xl:hidden" />;

  const mobilePhotoCarousel = (
    <div className="flex w-full snap-x snap-mandatory gap-2.5 overflow-x-auto overscroll-x-contain pb-1 scrollbar-none">
      {photos.map((photo, i) => (
        <div key={i} className="flex-none snap-start">
          <PhotoSlot
            variant={i === 0 ? "rep" : "normal"}
            filled={photo.filled}
            loading={uploading[i]}
            previewUrl={photo.previewUrl}
            onDelete={photo.filled ? () => requestDelete(i) : undefined}
            onSetRepresentative={
              photo.filled && i !== 0 ? () => setRepresentative(i) : undefined
            }
            onMoveLeft={
              photo.filled && i > 1 && photos[i - 1]?.filled
                ? () => movePhoto(i, "left")
                : undefined
            }
            onMoveRight={
              photo.filled &&
              i !== 0 &&
              i < photos.length - 1 &&
              photos[i + 1]?.filled
                ? () => movePhoto(i, "right")
                : undefined
            }
            onUpload={
              !photo.filled ? (file) => handleUpload(i, file) : undefined
            }
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
            onRemoveEmpty={
              !photo.filled && i > 0 ? () => removePhotobookSlot(i) : undefined
            }
            onUpload={
              !photo.filled ? (file) => handlePbUpload(i, file) : undefined
            }
            onMoveLeft={
              photo.filled && i > 0 && pbPhotos[i - 1]?.filled
                ? () => movePbPhoto(i, "left")
                : undefined
            }
            onMoveRight={
              photo.filled && i < pbPhotos.length - 1 && pbPhotos[i + 1]?.filled
                ? () => movePbPhoto(i, "right")
                : undefined
            }
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
          className="aspect-4/3 w-full rounded-lg border border-dashed border-border-strong bg-surface text-text-tertiary flex items-center justify-center hover:border-primary hover:text-primary hover:bg-primary-bg transition-colors duration-fast ease-standard"
        >
          <span
            className="text-display font-light leading-none"
            aria-hidden="true"
          >
            ＋
          </span>
        </button>
      )}
    </div>
  );

  const mobilePbCarousel = (
    <div
      ref={pbCarouselRef}
      className="flex w-full snap-x snap-mandatory gap-2.5 overflow-x-auto overscroll-x-contain pb-1 scrollbar-none"
    >
      {pbPhotos.map((photo, i) => (
        <div
          key={i}
          className="flex w-photobook-slot-width max-w-full flex-none snap-start flex-col gap-2"
        >
          <PhotobookThumb
            filled={photo.filled}
            previewUrl={photo.previewUrl}
            onDelete={photo.filled ? () => requestPbDelete(i) : undefined}
            onRemoveEmpty={
              !photo.filled && i > 0 ? () => removePhotobookSlot(i) : undefined
            }
            onUpload={
              !photo.filled ? (file) => handlePbUpload(i, file) : undefined
            }
            onMoveLeft={
              photo.filled && i > 0 && pbPhotos[i - 1]?.filled
                ? () => movePbPhoto(i, "left")
                : undefined
            }
            onMoveRight={
              photo.filled && i < pbPhotos.length - 1 && pbPhotos[i + 1]?.filled
                ? () => movePbPhoto(i, "right")
                : undefined
            }
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
          className="aspect-4/3 w-photobook-slot-width max-w-full flex-none snap-start rounded-lg border border-dashed border-border-strong bg-surface text-text-tertiary hidden narrow:flex items-center justify-center hover:border-primary hover:text-primary hover:bg-primary-bg transition-colors duration-fast ease-standard"
        >
          <span
            className="text-display font-light leading-none"
            aria-hidden="true"
          >
            ＋
          </span>
        </button>
      )}
    </div>
  );

  const desktopContent = (
    <SectionAnchor id={SECTION_PHOTO}>
      <Card>
        <CardHead
          tag="SECTION 6"
          title="프로필 사진"
          progress={photoSectionProgress}
        />
        <CardBody>
          <Row
            label="프로필 사진"
            required
            helper={
              <>
                <span className="font-semibold text-primary">
                  2장 필수 등록
                </span>
                <br />
                나를 잘 표현할 수 있는 사진을 업로드 해주세요.
              </>
            }
          >
            <div className="flex w-full min-w-0 flex-col gap-4 photo-guide-wide:flex-row photo-guide-wide:items-start">
              <ProfilePhotoGuide className="order-1 photo-guide-wide:order-2 photo-guide-wide:h-photo-guide-height photo-guide-wide:w-photo-guide-width photo-guide-wide:shrink-0 photo-guide-wide:self-start" />
              <div className="order-2 flex-none photo-guide-wide:order-1">
                {photoGrid}
              </div>
            </div>
            <InfoBox>이미지 파일 크기는 10MB 이하로 업로드해주세요</InfoBox>
          </Row>
          <Row
            label="포토북"
            helper={
              <>
                <span className="font-semibold text-primary">최대 8장</span>
                <br />
                나의 일상, 취미, 운동, 여행 등의 모습을 자유롭게 보여주는
                공간입니다.
              </>
            }
          >
            {pbGrid}
          </Row>
        </CardBody>
      </Card>
    </SectionAnchor>
  );

  const mobileContent = (
    <SectionAnchor id={SECTION_PHOTO}>
      <MobileCard
        num={6}
        title="프로필 사진"
        progress={photoSectionProgress}
        bodyClassName="pb-mobile-photo-card-bottom"
      >
        <MobileField
          label="프로필 사진"
          required
          desc={
            <>
              <span className="font-semibold text-primary">2장 필수 등록</span>
              <br />
              나를 잘 표현할 수 있는 사진을 업로드 해주세요.
            </>
          }
        >
          {mobilePhotoGuide}
          {mobilePhotoCarousel}
          <InfoBox>이미지 파일 크기는 10MB 이하로 업로드해주세요</InfoBox>
        </MobileField>
        <MobileField
          label="포토북"
          desc={
            <>
              <span className="font-semibold text-primary">최대 8장</span>
              까지 슬롯을 추가할 수 있습니다.
            </>
          }
          labelBadge={
            pbPhotos.length < MAX_PHOTOBOOK_SLOTS ? (
              <Button
                variant="secondary"
                size="sm"
                type="button"
                onClick={addPhotobookSlot}
                className="narrow:hidden"
                aria-label="포토북 슬롯 추가"
              >
                + 추가
              </Button>
            ) : undefined
          }
        >
          {mobilePbCarousel}
        </MobileField>
      </MobileCard>
    </SectionAnchor>
  );

  return (
    <>
      <ResponsiveView desktop={desktopContent} mobile={mobileContent} />

      <ConfirmModal
        open={!!deleteModal}
        onClose={() => setDeleteModal(null)}
        ariaLabel={
          isRep
            ? isRepDeleteBlocked
              ? "대표 사진 필수 안내"
              : "대표사진 삭제 확인"
            : "사진 삭제 확인"
        }
        confirmLabel={isRepDeleteBlocked ? "확인" : "삭제"}
        cancelLabel={isRepDeleteBlocked ? false : "취소"}
        onConfirm={confirmDelete}
        variant="primary"
        width={isRepDeleteBlocked ? "sm" : "md"}
      >
        {hasReplacementPhoto ? (
          <div className="text-center mt-2 mb-4">
            <div className="mt-1 text-md text-text-secondary">
              해당 사진을 삭제하면 두 번째에 등록된 사진이
              <br />
              대표 사진으로 변경됩니다
            </div>
          </div>
        ) : isRepDeleteBlocked ? (
          <p className="m-0 text-center text-md font-semibold text-text">
            대표 사진은 필수 입니다
            <br />
            반드시 등록해주세요
          </p>
        ) : (
          <p className="text-md text-text-secondary text-center mt-2 mb-4">
            정말 삭제하시겠습니까?
          </p>
        )}
      </ConfirmModal>

      <ConfirmModal
        open={!!pbDeleteModal}
        onClose={() => setPbDeleteModal(null)}
        ariaLabel="사진 삭제 확인"
        confirmLabel="삭제"
        cancelLabel="취소"
        onConfirm={confirmPbDelete}
        width="md"
      >
        <p className="text-md text-text-secondary text-center mt-2 mb-4">
          정말 삭제하시겠습니까?
        </p>
      </ConfirmModal>
    </>
  );
};

/* ===== d-footer ===== */
const DFooter = ({
  autoSave,
  onManualSave,
}: {
  autoSave: AutoSaveState;
  onManualSave: () => Promise<boolean>;
}) => {
  const { showToast } = useToast();
  const [desktopStyle, setDesktopStyle] = useState<CSSProperties>({});
  const [synced, setSynced] = useState(false);

  const handleManualSave = async () => {
    const saved = await onManualSave();
    showToast(
      saved ? "저장되었습니다." : "저장에 실패했습니다. 다시 시도해 주세요.",
      saved ? "success" : "danger",
    );
  };

  const prevAutoSave = useRef<AutoSaveState>("idle");
  useEffect(() => {
    if (
      prevAutoSave.current === "saved" &&
      autoSave === "idle" &&
      window.innerWidth < 1280
    ) {
      showToast("저장되었습니다.");
    }
    prevAutoSave.current = autoSave;
  }, [autoSave, showToast]);

  useEffect(() => {
    const syncFooter = () => {
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
    };

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
          "hidden xl:block fixed z-(--z-footer) overflow-hidden rounded-b-lg bg-surface border-t border-x border-border shadow-footer",
          synced
            ? ""
            : "bottom-0 left-1/2 -translate-x-1/2 w-form-footer-width",
        ].join(" ")}
        style={desktopStyle}
      >
        <div className="max-w-form-content-width mx-auto px-8 py-4 flex items-center gap-3">
          <AutoSaveChip state={autoSave} />
          <span className="flex-1" />
          <Button
            variant="secondary"
            size="lg"
            type="button"
            onClick={handleManualSave}
          >
            저장하기
          </Button>
          <Button variant="primary" size="lg" type="submit">
            다음
          </Button>
        </div>
      </div>
      {/* Mobile sticky footer */}
      <div className="xl:hidden fixed inset-x-0 bottom-0 z-(--z-footer) border-t border-border bg-surface shadow-footer">
        <div className="mx-auto flex w-full max-w-[430px] gap-2 px-4 pt-3 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
          <Button
            variant="secondary"
            size="md"
            type="button"
            layout="fill"
            loading={autoSave === "saving"}
            onClick={handleManualSave}
          >
            저장하기
          </Button>
          <Button variant="primary" size="md" type="submit" layout="fill">
            다음
          </Button>
        </div>
      </div>
    </>
  );
};

const ProgressHero = ({ progress }: { progress: ProgressSection }) => {
  return (
    <>
      <div className="sticky top-0 z-(--z-sticky) mt-6 hidden bg-page px-8 py-3 xl:block">
        <div className="max-w-form-content-width mx-auto">
          <FormProgressBar progress={progress} />
        </div>
      </div>

      <div className="sticky top-mobile-shell-header z-(--z-sticky) border-b border-border-subtle bg-page px-4 py-4 xl:hidden">
        <FormProgressBar progress={progress} size="sm" />
      </div>
    </>
  );
};

/* ===== Root ===== */
export const BaseInfoForm = (): ReactNode => {
  const [autoSave, setAutoSave] = useState<AutoSaveState>("idle");
  const [validationModalOpen, setValidationModalOpen] = useState(false);
  const [missingBySection, setMissingBySection] = useState<
    Partial<Record<BaseInfoSectionKey, MissingRequiredField[]>>
  >({});
  const [progressMap, setProgressMap] = useState<ProgressMap>({
    family: { done: 0, total: 2 },
    faith: { done: 0, total: 4 },
    education: { done: 0, total: 5 },
    appearance: { done: 0, total: 4 },
    lifestyle: { done: 0, total: 3 },
    photo: { done: 0, total: 2 },
  });
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const saveIdleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const saveInFlight = useRef(false);
  const saveQueued = useRef(false);
  const queuedResolvers = useRef<Array<(v: boolean) => void>>([]);
  const loadFailed = useRef(false);
  const formDataRef = useRef<BaseInfoPayload>({});
  const [initialData, setInitialData] = useState<BaseInfoPayload | null>(null);
  const progress = Object.values(progressMap).reduce<ProgressSection>(
    (acc, section) => ({
      done: acc.done + section.done,
      total: acc.total + section.total,
    }),
    { done: 0, total: 0 },
  );

  const updateProgress = useCallback(
    (key: keyof ProgressMap, section: ProgressSection): void => {
      setProgressMap((current) => {
        const prev = current[key];
        if (prev.done === section.done && prev.total === section.total)
          return current;
        return { ...current, [key]: section };
      });
    },
    [],
  );

  const registerMissingFields = useCallback(
    (section: BaseInfoSectionKey, missing: MissingRequiredField[]): void => {
      setMissingBySection((current) => {
        const prev = current[section];
        if (
          prev &&
          prev.length === missing.length &&
          prev.every(
            (field, index) =>
              field.id === missing[index]?.id &&
              field.label === missing[index]?.label,
          )
        ) {
          return current;
        }
        return { ...current, [section]: missing };
      });
    },
    [],
  );

  const allMissingFields = useMemo(
    () =>
      BASE_INFO_SECTION_ORDER.flatMap(
        (section) => missingBySection[section] ?? [],
      ),
    [missingBySection],
  );

  const updateFormData = useCallback(
    <K extends keyof BaseInfoPayload>(key: K, data: BaseInfoPayload[K]) => {
      formDataRef.current = { ...formDataRef.current, [key]: data };
    },
    [],
  );

  useEffect(() => {
    let cancelled = false;

    const loadInitialData = async () => {
      try {
        const result = await apiFetch<BaseInfoPayload>(
          "/api/profile/base-info",
        );
        if (!result.ok) {
          if (!cancelled) {
            if (result.error.code === "404") {
              formDataRef.current = {};
              setInitialData({});
            } else {
              loadFailed.current = true;
              setInitialData({});
            }
          }
          return;
        }
        if (cancelled) return;
        formDataRef.current = result.data;
        setInitialData(result.data);
      } catch {
        if (!cancelled) {
          loadFailed.current = true;
          setInitialData({});
        }
      }
    };

    void loadInitialData();

    return () => {
      cancelled = true;
    };
  }, []);

  const persistFormData = async (): Promise<boolean> => {
    if (loadFailed.current) {
      setAutoSave("error");
      return false;
    }
    if (saveInFlight.current) {
      saveQueued.current = true;
      return new Promise<boolean>((resolve) => {
        queuedResolvers.current.push(resolve);
      });
    }

    saveInFlight.current = true;
    setAutoSave("saving");
    if (saveIdleTimer.current) clearTimeout(saveIdleTimer.current);

    // UI Spinner 데모용도입니다.
    const minDelay = new Promise<void>((r) => setTimeout(r, 2000));

    try {
      const [result] = await Promise.all([
        apiFetch<{ ok: boolean }>("/api/profile/base-info", {
          method: "PATCH",
          body: JSON.stringify(formDataRef.current),
        }),
        minDelay,
      ]);
      if (!result.ok) {
        setAutoSave("error");
        return false;
      }

      setAutoSave("saved");
      saveIdleTimer.current = setTimeout(() => setAutoSave("idle"), 2000);
      return true;
    } catch {
      setAutoSave("error");
      return false;
    } finally {
      saveInFlight.current = false;
      if (saveQueued.current) {
        saveQueued.current = false;
        const resolvers = queuedResolvers.current.splice(0);
        const result = await persistFormData();
        resolvers.forEach((r) => r(result));
      }
    }
  };

  const triggerAutoSave = () => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      void persistFormData();
    }, 500);
  };

  const handleManualSave = async (): Promise<boolean> => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    return persistFormData();
  };

  useEffect(() => {
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
      if (saveIdleTimer.current) clearTimeout(saveIdleTimer.current);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (allMissingFields.length === 0) {
      return;
    }
    setValidationModalOpen(true);
  };

  const handleValidationConfirm = () => {
    const targetId = allMissingFields[0]?.id;
    setValidationModalOpen(false);
    if (!targetId) return;
    window.setTimeout(() => {
      scrollToFieldAnchor(targetId);
    }, 0);
  };

  if (initialData === null) {
    return null;
  }

  return (
    <ToastProvider>
      <form
        noValidate
        onSubmit={handleSubmit}
        className="relative flex flex-col xl:gap-5 gap-3 pb-mobile-photo-footer-gap xl:pb-44"
      >
        <ProgressHero progress={progress} />
        <FamilySection
          initialData={initialData.family}
          onSave={triggerAutoSave}
          onProgressChange={(section) => updateProgress("family", section)}
          onMissingFieldsChange={(missing) =>
            registerMissingFields("family", missing)
          }
          onDataChange={(data) => updateFormData("family", data)}
        />
        <FaithSection
          initialData={initialData.faith}
          onSave={triggerAutoSave}
          onProgressChange={(section) => updateProgress("faith", section)}
          onMissingFieldsChange={(missing) =>
            registerMissingFields("faith", missing)
          }
          onDataChange={(data) => updateFormData("faith", data)}
        />
        <EducationSection
          initialData={initialData.education}
          onSave={triggerAutoSave}
          onProgressChange={(section) => updateProgress("education", section)}
          onMissingFieldsChange={(missing) =>
            registerMissingFields("education", missing)
          }
          onDataChange={(data) => updateFormData("education", data)}
        />
        <AppearanceSection
          initialData={initialData.appearance}
          onSave={triggerAutoSave}
          onProgressChange={(section) => updateProgress("appearance", section)}
          onMissingFieldsChange={(missing) =>
            registerMissingFields("appearance", missing)
          }
          onDataChange={(data) => updateFormData("appearance", data)}
        />
        <LifestyleSection
          initialData={initialData.lifestyle}
          onSave={triggerAutoSave}
          onProgressChange={(section) => updateProgress("lifestyle", section)}
          onMissingFieldsChange={(missing) =>
            registerMissingFields("lifestyle", missing)
          }
          onDataChange={(data) => updateFormData("lifestyle", data)}
        />
        <PhotoSection
          initialData={initialData.photos}
          onSave={triggerAutoSave}
          onProgressChange={(section) => updateProgress("photo", section)}
          onMissingFieldsChange={(missing) =>
            registerMissingFields("photo", missing)
          }
          onDataChange={(data) => updateFormData("photos", data)}
        />
        <DFooter autoSave={autoSave} onManualSave={handleManualSave} />
      </form>

      <ConfirmModal
        open={validationModalOpen}
        onClose={() => setValidationModalOpen(false)}
        title="입력하지 않은 항목이 있습니다"
        confirmLabel="확인"
        cancelLabel={false}
        onConfirm={handleValidationConfirm}
        width="sm"
      >
        <p className="text-sm text-text-secondary m-0">
          다음 항목을 입력해 주세요
        </p>
        <ul className="m-0 pl-5 flex flex-col gap-1.5 text-sm text-text list-disc">
          {allMissingFields.map((field) => (
            <li key={`${field.id}-${field.label}`}>
              {MISSING_FIELD_LABEL_OVERRIDE[field.label] ?? field.label}
            </li>
          ))}
        </ul>
      </ConfirmModal>
    </ToastProvider>
  );
};
