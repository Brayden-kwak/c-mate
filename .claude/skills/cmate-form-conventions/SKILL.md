---
name: cmate-form-conventions
classification: capability
description: |
  cmate 기본정보(Step 1) 폼 컨벤션 — Card/Row 컴포지션, validation 타이밍,
  auto-save 상태머신, 필수 필드 표기, 에러 표시 규칙.
  6개 카드(가족·거주 / 신앙 / 학력·직장 / 신체·스타일 / 생활습관·가치관 / 프로필 사진)가
  같은 패턴을 공유하므로, 새 폼 영역 작업 전에 이 스킬을 반드시 로드한다.

  Use when implementing any cmate form card, when wiring validation/auto-save,
  or when adding new field types.

  Triggers: form, 폼, validation, 검증, auto-save, 자동저장, 기본정보,
  Card, Row, field, 필수 필드, 에러 표시.
user-invocable: true
allowed-tools: [Read, Grep, Glob]
---

# cmate-form-conventions

Step 1 (기본정보) 6개 카드를 같은 코드 패턴으로 만든다. 이 문서가 합의된 사양 — 매번 plan 문서를 다시 읽지 말 것.

## 컴포지션

```tsx
<Card>
  <CardHead tag="SECTION 1" title="가족 · 거주" meta="3 / 3" />
  <CardBody>
    <Row label="결혼경험" required helper="현재 결혼 상태를 선택해 주세요.">
      <RadioGroup name="marriageExperience" options={["초혼", "재혼"]} />
    </Row>
    {/* ... */}
  </CardBody>
</Card>
```

`Card` / `CardHead` / `CardBody` / `Row` 는 `app/_components/ui/` 의 union-typed 프리미티브를 조합. `Row` 내부 좌측은 `lcol` (label + 필수 `*` + helper + pins), 우측은 `fcol` (실제 필드). 모킹업 grid: 데스크탑 `260px 1fr / gap 40px`, 모바일 1-col stack.

## Validation 타이밍

| 입력 종류                  | 트리거               | 비고                           |
| -------------------------- | -------------------- | ------------------------------ |
| 텍스트 / 숫자              | onBlur               | focus 중에는 에러 표시 안 함   |
| 라디오 / 체크박스 / 셀렉트 | onChange             | 즉시                           |
| 전체                       | onSubmit (다음 클릭) | 첫 에러 필드로 scroll + 토스트 |

에러 표시:

- 필드 아래 인라인 메시지
- 빨간 outline (Input `state="error"` 또는 `aria-invalid`)
- `aria-describedby` 로 에러 메시지 id 연결
- 같은 필드에 에러 + helper 동시 표시 금지 — 에러가 helper 자리를 차지

## 필수 필드

- 라벨에 빨간 `*` (`aria-hidden` 텍스트)
- input/select/radio-group 루트에 `aria-required="true"`
- 제출 시 누락 → 첫 누락 필드로 smooth scroll + outline + 인라인 에러 + 상단 토스트 1회 ("입력하지 않은 항목이 있습니다")

선택 필드는 라벨 옆 "선택" 중립 칩만 표시, 색 강조 없음.

## Auto-save 상태머신

```
idle ──onBlur+500ms debounce──▶ saving
saving ──success──▶ saved ──2s──▶ idle
saving ──fail──▶ error ──retry──▶ saving
error  ──retryCount>=5──▶ blocked ("저장 실패. 직접 저장하세요" CTA)
```

상태 → d-footer 칩 표시:

- `idle`: 칩 숨김
- `saving`: 스피너 + "저장 중..."
- `saved`: 체크 + "방금 자동 저장됨" (2s 뒤 idle 복귀)
- `error`: danger 칩 + 재시도 버튼
- `blocked`: 상단 alert + "저장하기" 버튼 강조

draft 복구: 페이지 진입 시 localStorage + 서버 draft 비교, 더 최신 쪽으로 "이어 작성" 모달 띄움.

## 도메인 특수 흐름 (요약)

| 영역                  | 흐름                                                                                                   | 위치        |
| --------------------- | ------------------------------------------------------------------------------------------------------ | ----------- |
| 교회 검색 zero-result | EmptyState → "교회/교단 가입 신청" 인라인 폼 → "24시간 내 매니저 확인" 안내. 임시값으로 다음 진행 허용 | Card 2 신앙 |
| 학력 다운그레이드     | 박사→석사→학사 방향 변경 시 해당 row들 삭제 경고 모달 + 영향 리스트 + [취소][계속 (danger)]            | Card 3 학력 |
| 대표사진 삭제         | 다른 사진 있을 때: "두 번째가 대표가 됩니다" 경고; 대표만 있을 때: blocking "대표는 반드시"            | Card 6 사진 |
| 사진 재정렬           | desktop DnD · mobile carousel long-press · keyboard Shift+←/→                                          | Card 6 사진 |

상세 사양은 `docs/cmate-base-info-plan.html` 의 해당 섹션 참조 (이 SKILL.md 는 컨벤션 요약, plan 문서가 사양 진본).

## 새 필드 추가 절차

1. `app/_components/ui/types.ts` 에 variant 가 부족하면 union 확장.
2. 프리미티브가 없으면 `app/_components/ui/` 에 신규 (Button/Input 패턴 따름 — `style={{}}` 안 받음, Tailwind 토큰 유틸만 사용).
3. `Row` 안에 끼워 넣고 onBlur/onChange validation 등록.
4. 필수면 `*` + `aria-required`, 선택이면 "선택" 칩.
5. `cmate-web-shell` SKILL.md 의 프리미티브 카탈로그에 한 줄 추가.

## 하지 말 것

- `style={{ color: '#...' }}` — ESLint 가 막음. `text-danger` 같은 토큰 유틸 사용.
- 카드별로 새 Card/Row 컴포넌트 만들기 — 6개 카드는 같은 컴포넌트의 props 만 다름.
- `'use client'` 를 page/layout 에 — 필드/폼 root 에만.
- helper 와 error 동시 노출.
- 한국어 라벨을 i18n 키로 추출 — 일단 JSX 그대로.
