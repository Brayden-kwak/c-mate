"use client";

import { useEffect, useRef, useState } from "react";
import { Card, CardBody, CardHead } from "@/app/_components/ui/Card";
import { Row } from "@/app/_components/ui/Row";
import { RadioGroup } from "@/app/_components/ui/RadioGroup";
import { Input } from "@/app/_components/ui/Input";
import { Button } from "@/app/_components/ui/Button";
import { InfoBox } from "@/app/_components/ui/InfoBox";
import { MobileCard, MobileField } from "@/app/_components/ui/MobileCard";
import { ConfirmModal } from "@/app/_components/modals/ConfirmModal";
import {
  DropdownSelect,
  type DropdownOption,
} from "@/app/_components/ui/DropdownSelect";
import { Checkbox } from "@/app/_components/ui/Checkbox";

const SALARY_OPTIONS: DropdownOption[] = [
  { value: "3000-under", label: "3,000만원 미만" },
  { value: "3000-4000", label: "3,000 ~ 4,000만원" },
  { value: "4000-5000", label: "4,000 ~ 5,000만원" },
  { value: "5000-6000", label: "5,000 ~ 6,000만원" },
  { value: "6000-8000", label: "6,000 ~ 8,000만원" },
  { value: "8000-1e", label: "8,000만원 ~ 1억" },
  { value: "1e-over", label: "1억 이상" },
];
import { SectionAnchor } from "./SectionAnchor";
import {
  BASE_INFO_SECTION_ANCHOR_ID,
  type MissingRequiredField,
  type ProgressSection,
} from "./types";

const SECTION_EDUCATION = BASE_INFO_SECTION_ANCHOR_ID.education;

type EduRow = { id: number; degree: string; school: string; major: string };

type Props = {
  onSave: () => void;
  onProgressChange: (section: ProgressSection) => void;
  onMissingFieldsChange: (missing: MissingRequiredField[]) => void;
};

const DEGREE_ROWS: Record<string, string[]> = {
  고졸: ["고졸"],
  전문대: ["전문대"],
  학사: ["학사"],
  석사: ["학사", "석사"],
  박사: ["학사", "석사", "박사"],
};
const EDUCATION_OPTIONS = ["고졸", "전문대", "학사", "석사", "박사"];

export const EducationSection = ({
  onSave,
  onProgressChange,
  onMissingFieldsChange,
}: Props) => {
  const [education, setEducation] = useState("");
  const [eduRows, setEduRows] = useState<EduRow[]>([]);
  const [pendingEduChange, setPendingEduChange] = useState<{
    newDegree: string;
    affected: EduRow[];
  } | null>(null);
  const [job, setJob] = useState("");
  const [jobModalOpen, setJobModalOpen] = useState(false);
  const [jobQuery, setJobQuery] = useState("");
  const [workplace, setWorkplace] = useState("");
  const [schoolModalRowId, setSchoolModalRowId] = useState<number | null>(null);
  const [schoolQuery, setSchoolQuery] = useState("");
  const [salary, setSalary] = useState("");
  const [salaryHidden, setSalaryHidden] = useState(false);
  const nextId = useRef(10);
  const trimmedSchoolQuery = schoolQuery.trim();
  const trimmedJobQuery = jobQuery.trim();
  const hasCompleteSchoolRow =
    eduRows.length > 0 &&
    eduRows.every((row) => row.school.trim() && row.major.trim());
  const complete =
    Number(Boolean(education)) +
    Number(hasCompleteSchoolRow) +
    Number(Boolean(job.trim())) +
    Number(Boolean(workplace.trim() && !workplace.includes("*"))) +
    Number(Boolean(salary));

  useEffect(() => {
    onProgressChange({ done: complete, total: 5 });
  }, [complete, onProgressChange]);

  useEffect(() => {
    const missing: MissingRequiredField[] = [];
    if (!education) {
      missing.push({ id: SECTION_EDUCATION, label: "최종 학력" });
    } else if (!hasCompleteSchoolRow) {
      missing.push({ id: SECTION_EDUCATION, label: "학교명 / 전공" });
    }
    if (!job.trim()) {
      missing.push({ id: SECTION_EDUCATION, label: "직업 / 직무" });
    }
    if (!workplace.trim() || workplace.includes("*")) {
      missing.push({ id: SECTION_EDUCATION, label: "직장명" });
    }
    if (!salary && !salaryHidden) {
      missing.push({ id: SECTION_EDUCATION, label: "연봉" });
    }
    onMissingFieldsChange(missing);
  }, [
    education,
    hasCompleteSchoolRow,
    job,
    workplace,
    salary,
    salaryHidden,
    onMissingFieldsChange,
  ]);

  const applyDegreeChange = (newDegree: string) => {
    const newTags = DEGREE_ROWS[newDegree] ?? [];
    const kept = eduRows.filter((row) => newTags.includes(row.degree));
    const existing = new Set(kept.map((row) => row.degree));
    const toAdd = newTags
      .filter((tag) => !existing.has(tag))
      .map((tag) => ({
        id: ++nextId.current,
        degree: tag,
        school: "",
        major: "",
      }));
    setEduRows([...kept, ...toAdd]);
    setEducation(newDegree);
    setPendingEduChange(null);
  };

  const handleDegreeChange = (newDegree: string) => {
    const newTags = DEGREE_ROWS[newDegree] ?? [];
    const rowsToRemove = eduRows.filter((row) => !newTags.includes(row.degree));
    const affected = rowsToRemove.filter((row) => row.school || row.major);
    if (affected.length > 0) {
      setPendingEduChange({ newDegree, affected });
    } else {
      applyDegreeChange(newDegree);
    }
    onSave();
  };

  const updateEduRow = (id: number, field: keyof EduRow, val: string) => {
    setEduRows((rows) =>
      rows.map((row) => (row.id === id ? { ...row, [field]: val } : row)),
    );
  };

  const removeEduRow = (id: number) => {
    setEduRows((rows) => rows.filter((row) => row.id !== id));
    onSave();
  };

  const applyJob = () => {
    if (jobQuery.trim()) {
      setJob(jobQuery.trim());
      onSave();
    }
    setJobModalOpen(false);
    setJobQuery("");
  };

  const openSchoolSearch = (rowId: number, currentSchool: string) => {
    setSchoolModalRowId(rowId);
    setSchoolQuery(currentSchool);
  };

  const applySchool = () => {
    if (schoolModalRowId === null || !trimmedSchoolQuery) {
      return;
    }
    updateEduRow(schoolModalRowId, "school", trimmedSchoolQuery);
    onSave();
    setSchoolModalRowId(null);
    setSchoolQuery("");
  };

  const schoolMajorPlaceholder = <InfoBox>최종 학력을 선택해주세요.</InfoBox>;

  const eduStack = education ? (
    <div className="flex flex-col gap-2">
      {eduRows.map((row) => (
        <div key={row.id} className="flex items-center gap-2.5">
          <span className="shrink-0 bg-surface border border-border rounded-[6px] px-2 py-1 text-[11px] font-bold tracking-[0.04em]">
            {row.degree}
          </span>
          <Input
            placeholder="학교명을 검색해 주세요"
            value={row.school}
            layout="fill"
            aria-label={`${row.degree} 학교명`}
            disabled
          />
          <Button
            variant="secondary"
            size="md"
            type="button"
            onClick={() => openSchoolSearch(row.id, row.school)}
          >
            학교 검색
          </Button>
          <Input
            placeholder="전공"
            value={row.major}
            onChange={(e) => updateEduRow(row.id, "major", e.target.value)}
            onBlur={onSave}
            fieldWidth="major"
            aria-label={`${row.degree} 전공`}
          />
          {eduRows.length > 1 ? (
            <button
              type="button"
              onClick={() => removeEduRow(row.id)}
              aria-label={`${row.degree} 학력 삭제`}
              className="w-9 h-9 border border-border rounded-[6px] bg-surface flex items-center justify-center hover:bg-subtle shrink-0 transition-colors duration-fast ease-standard"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4 text-danger"
                aria-hidden="true"
              >
                <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
            </button>
          ) : (
            <div className="w-9 h-9 shrink-0" />
          )}
        </div>
      ))}
    </div>
  ) : (
    schoolMajorPlaceholder
  );

  const mobileEduStack = education ? (
    <div className="flex flex-col gap-2">
      {eduRows.map((row) => (
        <div
          key={row.id}
          className="bg-subtle rounded-md px-3 py-edu-card-y flex flex-col gap-2"
        >
          <div className="flex items-center gap-2">
            <span className="bg-surface border border-border rounded-[6px] px-2 py-1 text-[11px] font-bold tracking-[0.04em]">
              {row.degree}
            </span>
            <span className="flex-1" />
            {eduRows.length > 1 && (
              <button
                type="button"
                onClick={() => removeEduRow(row.id)}
                aria-label={`${row.degree} 학력 삭제`}
                className="w-9 h-9 border border-border rounded-[6px] bg-surface flex items-center justify-center shrink-0"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-4 h-4 text-danger"
                  aria-hidden="true"
                >
                  <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
              </button>
            )}
          </div>
          <Input
            placeholder="학교명을 검색해 주세요"
            value={row.school}
            aria-label={`${row.degree} 학교명`}
            disabled
          />
          <Button
            variant="secondary"
            size="md"
            type="button"
            layout="full"
            onClick={() => openSchoolSearch(row.id, row.school)}
          >
            학교 검색
          </Button>
          <Input
            placeholder="전공"
            value={row.major}
            onChange={(e) => updateEduRow(row.id, "major", e.target.value)}
            onBlur={onSave}
            aria-label={`${row.degree} 전공`}
          />
        </div>
      ))}
    </div>
  ) : (
    schoolMajorPlaceholder
  );

  const desktopContent = (
    <SectionAnchor id={SECTION_EDUCATION}>
      <Card>
        <CardHead
          tag="SECTION 3"
          title="학력 &amp; 직장"
          progress={{ done: complete, total: 5 }}
        />
        <CardBody>
          <Row label="최종 학력" required>
            <RadioGroup
              name="education"
              options={EDUCATION_OPTIONS}
              value={education}
              onChange={handleDegreeChange}
              aria-required
            />
          </Row>
          <Row
            label="학교명 / 전공"
            required
            labelAlign={education ? "start" : "center"}
          >
            {eduStack}
          </Row>
          <Row label="직업 / 직무" required>
            <div className="flex gap-2">
              <Input
                value={job}
                onChange={(e) => setJob(e.target.value)}
                onBlur={onSave}
                aria-label="직업 / 직무"
                layout="fill"
              />
              <Button
                variant="secondary"
                size="md"
                type="button"
                onClick={() => setJobModalOpen(true)}
              >
                직업 검색
              </Button>
            </div>
          </Row>
          <Row
            label="직장명"
            required
            helper="직장명은 앞 2글자만 공개되며, 나머지는 블라인드 처리됩니다."
          >
            <Input
              value={workplace}
              onChange={(e) => setWorkplace(e.target.value)}
              onBlur={onSave}
              aria-label="직장명"
              layout="fill"
              placeholder="직장명을 입력해 주세요"
            />
          </Row>
          <Row label="연봉" required>
            <div className="flex items-center gap-4 flex-wrap">
              <DropdownSelect
                value={salary}
                onChange={(v) => {
                  setSalary(v);
                  onSave();
                }}
                options={SALARY_OPTIONS}
                placeholder="연봉 구간 선택"
                fieldWidth="salary"
                aria-label="연봉 구간"
                aria-required
              />
              <Checkbox
                label="연봉 비공개"
                checked={salaryHidden}
                onChange={(e) => {
                  setSalaryHidden(e.target.checked);
                  onSave();
                }}
              />
            </div>
            <InfoBox>
              비공개 시 다른 회원에게 노출되지 않으며, 매니저 매칭에만
              활용됩니다.
            </InfoBox>
          </Row>
        </CardBody>
      </Card>
    </SectionAnchor>
  );

  const mobileContent = (
    <SectionAnchor id={SECTION_EDUCATION}>
      <MobileCard
        num={3}
        title="학력 &amp; 직장"
        progress={{ done: complete, total: 5 }}
      >
        <MobileField label="최종 학력" required>
          <RadioGroup
            name="m-education"
            options={EDUCATION_OPTIONS}
            value={education}
            onChange={handleDegreeChange}
            aria-required
          />
        </MobileField>
        <MobileField label="학교 / 전공" required>
          {mobileEduStack}
        </MobileField>
        <MobileField label="직업 / 직무" required>
          <Input
            value={job}
            onChange={(e) => setJob(e.target.value)}
            onBlur={onSave}
            aria-label="직업 / 직무"
          />
          <Button
            variant="secondary"
            size="md"
            type="button"
            layout="full"
            onClick={() => setJobModalOpen(true)}
          >
            직업 검색
          </Button>
        </MobileField>
        <MobileField label="직장명" required>
          <Input
            value={workplace}
            onChange={(e) => setWorkplace(e.target.value)}
            onBlur={onSave}
            aria-label="직장명"
            placeholder="직장명을 입력해 주세요"
          />
        </MobileField>
        <MobileField label="연봉" required>
          <Checkbox
            label="연봉 비공개"
            checked={salaryHidden}
            onChange={(e) => {
              setSalaryHidden(e.target.checked);
              onSave();
            }}
          />
          <DropdownSelect
            value={salary}
            onChange={(v) => {
              setSalary(v);
              onSave();
            }}
            options={SALARY_OPTIONS}
            placeholder="연봉 구간 선택"
            aria-label="연봉 구간"
            aria-required
            disabled={salaryHidden}
          />
          <InfoBox>
            비공개 시 다른 회원에게 노출되지 않으며, 매니저 매칭에만 활용됩니다.
          </InfoBox>
        </MobileField>
      </MobileCard>
    </SectionAnchor>
  );

  return (
    <>
      <div className="hidden xl:block">{desktopContent}</div>
      <div className="xl:hidden">{mobileContent}</div>

      <ConfirmModal
        open={!!pendingEduChange}
        onClose={() => setPendingEduChange(null)}
        title="학력 정보가 삭제됩니다"
        confirmLabel="계속 진행"
        cancelLabel="취소"
        onConfirm={() =>
          pendingEduChange && applyDegreeChange(pendingEduChange.newDegree)
        }
        variant="danger"
      >
        <div className="flex items-start gap-3 bg-warning-light rounded-md p-4">
          <span className="text-warning text-lg font-bold shrink-0">⚠</span>
          <div>
            <div className="text-md font-semibold text-text">
              {education} → {pendingEduChange?.newDegree}으로 변경
            </div>
            <div className="text-[13px] text-text-secondary mt-1">
              입력하신 학력 정보가 모두 삭제됩니다
              <br />
              계속하시겠어요?
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          {pendingEduChange?.affected.map((row) => (
            <div key={row.id} className="flex items-center gap-2 text-[13px]">
              <svg
                viewBox="0 0 24 24"
                className="w-3.5 h-3.5 text-danger shrink-0"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
              <span className="bg-subtle border border-border rounded-[4px] px-1.5 py-0.5 text-[11px] font-bold shrink-0">
                {row.degree}
              </span>
              <span className="line-through text-text-secondary">
                {[row.school, row.major].filter(Boolean).join(" · ")}
              </span>
            </div>
          ))}
        </div>
      </ConfirmModal>

      <ConfirmModal
        open={jobModalOpen}
        onClose={() => {
          setJobModalOpen(false);
          setJobQuery("");
        }}
        title="직업 검색"
        cancelLabel="취소"
        confirmLabel="등록하기"
        onConfirm={trimmedJobQuery ? applyJob : undefined}
        width="sm"
      >
        <div className="flex flex-col gap-4">
          <Input
            value={jobQuery}
            onChange={(e) => setJobQuery(e.target.value)}
            placeholder="직업/직무를 입력해 주세요"
            autoFocus
            aria-label="직업 검색"
            onKeyDown={(e) =>
              e.key === "Enter" && trimmedJobQuery && applyJob()
            }
          />
          {trimmedJobQuery ? (
            <div className="bg-subtle rounded-lg p-5 text-center">
              <div className="text-md font-semibold text-text">
                &lsquo;{trimmedJobQuery}&rsquo; 검색 결과가 없어요
              </div>
              <p className="mt-2 mb-0 text-md leading-relaxed text-text-secondary">
                하단의 등록하기를 누르면 입력한 직업/직무로 등록됩니다
              </p>
            </div>
          ) : null}
        </div>
      </ConfirmModal>

      <ConfirmModal
        open={schoolModalRowId !== null}
        onClose={() => {
          setSchoolModalRowId(null);
          setSchoolQuery("");
        }}
        title="학교 검색"
        cancelLabel="취소"
        confirmLabel="등록하기"
        onConfirm={trimmedSchoolQuery ? applySchool : undefined}
        width="sm"
      >
        <div className="flex flex-col gap-4">
          <Input
            value={schoolQuery}
            onChange={(e) => setSchoolQuery(e.target.value)}
            placeholder="학교명을 입력해 주세요"
            autoFocus
            aria-label="학교 검색"
            onKeyDown={(e) =>
              e.key === "Enter" && trimmedSchoolQuery && applySchool()
            }
          />
          {trimmedSchoolQuery ? (
            <div className="bg-subtle rounded-lg p-5 text-center">
              <div className="text-md font-semibold text-text">
                &lsquo;{trimmedSchoolQuery}&rsquo; 검색 결과가 없어요
              </div>
              <p className="mt-2 mb-0 text-md leading-relaxed text-text-secondary">
                하단의 등록하기를 누르면 입력한 학교명으로 등록됩니다
              </p>
            </div>
          ) : null}
        </div>
      </ConfirmModal>
    </>
  );
};
