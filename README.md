# c-mate

크리스천메이트 웹 애플리케이션입니다. base-info 페이지에서 문제점을 찾고 기획 / 디자인 / 개발을 진행했습니다. Next.js App Router, TypeScript, Tailwind CSS를 기반으로 개발합니다.

## 시작하기

의존성 설치:

```bash
npm install
```

개발 서버 실행:

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 엽니다.

## 주요 명령어

```bash
npm run dev           # 개발 서버 실행
npm run build         # 프로덕션 빌드
npm run start         # 프로덕션 서버 실행
npm run lint          # ESLint 검사
npm run lint:fix      # ESLint 자동 수정
npm run typecheck     # TypeScript 타입 검사
npm run format        # Prettier 포맷 적용
npm run format:check  # Prettier 포맷 검사
npm run check         # typecheck + lint + format:check
```

작업을 마치기 전에는 `npm run check`를 통과시키는 것을 기본으로 합니다.

## 그라운드 룰

- 사용자에게 보이는 동작과 UI 안정성을 우선합니다. 변경 범위가 작더라도 모바일, 데스크톱, 로딩, 에러, 빈 상태를 함께 고려합니다.
- 기존 구조와 컴포넌트 패턴을 먼저 따릅니다. 새 추상화는 중복을 줄이거나 책임을 분명히 할 때만 추가합니다.
- 관련 없는 리팩터링과 포맷 변경은 피합니다. 한 작업은 가능한 한 하나의 목적을 갖게 합니다.
- 타입 오류, 린트 오류, 포맷 오류를 남기지 않습니다. 임시 우회보다 타입과 데이터 흐름을 명확히 만드는 쪽을 선택합니다.
- 하드코딩된 값보다 프로젝트 토큰과 공용 컴포넌트를 우선합니다. 디자인 일관성이 기능 구현의 일부라고 봅니다.
- API, 폼, 업로드처럼 사용자 데이터와 연결되는 코드는 실패 가능성을 명시적으로 다룹니다.

## 개발 컨벤션

### 디렉터리

- `app/(web)`: 웹 화면 라우트와 라우트별 `layout`, `loading`, `error`, `not-found` 파일을 둡니다.
- `app/api`: Next.js Route Handler를 둡니다. 외부 연동 전 mock API도 같은 계약을 유지합니다.
- `app/_components`: 재사용 컴포넌트를 둡니다. 범용 UI는 `ui`, 화면 셸은 `web-shell`, 폼 도메인은 `form` 하위에 배치합니다.
- `app/_lib`: API 클라이언트, 업로드, 도메인 유틸처럼 UI와 분리되는 코드를 둡니다.
- `public/images`: 화면에서 직접 사용하는 정적 이미지를 둡니다.

### TypeScript

- `strict` 모드를 기준으로 작성합니다.
- `any`는 사용하지 않습니다. 모르는 값은 `unknown`으로 받고, 사용 지점에서 좁혀서 처리합니다.
- 컴포넌트 props와 API 응답 타입은 명시적으로 정의합니다.
- import 경로는 `@/*` alias를 사용할 수 있습니다.

### React / Next.js

- App Router 규칙을 따릅니다. 라우트 단위의 로딩과 에러 처리는 `loading.tsx`, `error.tsx`, `not-found.tsx`를 우선 검토합니다.
- 클라이언트 상태나 브라우저 API가 필요한 컴포넌트에만 `"use client"`를 붙입니다.
- 이미지는 `next/image`의 `<Image>`를 사용하고, `width`/`height` 또는 `fill`을 명시합니다.
- 링크 이동은 가능한 한 `next/link`를 사용합니다.
- 폼과 인터랙션은 키보드 접근성과 포커스 상태를 함께 확인합니다.

### 스타일

- Tailwind 유틸리티를 기본으로 사용합니다.
- 디자인 토큰은 `app/globals.css`의 `@theme`이 단일 기준입니다.
- JSX의 `style` prop에 hex 색상을 직접 쓰지 않습니다. `bg-primary`, `text-text`, `border-border` 같은 토큰 기반 클래스를 사용합니다.
- 공통 버튼, 입력, 선택, 라디오, 체크박스, 모달은 `app/_components/ui`의 컴포넌트를 먼저 사용합니다.
- 반응형 UI는 특정 화면에서만 맞추지 말고 좁은 모바일, 태블릿 폭, 데스크톱 폭을 함께 고려합니다.

### 데이터와 API

- 클라이언트에서 API를 호출할 때는 `app/_lib/api.ts` 같은 공용 계층을 우선 사용합니다.
- API 계약이 바뀌면 타입, 호출부, 에러 처리, 빈 상태를 함께 갱신합니다.
- 업로드와 presign 흐름은 실패, 취소, 재시도 가능성을 고려합니다.
- mock API를 수정할 때도 실제 API로 교체 가능한 형태를 유지합니다.

### 품질 확인

- 기본 검증 명령은 `npm run check`입니다.
- UI 변경은 브라우저에서 주요 뷰포트를 확인합니다.
- 접근성에 영향을 주는 변경은 포커스 이동, 버튼/링크 역할, 입력 label 연결을 확인합니다.
- 버그 수정에는 가능하면 재발을 막는 타입, 테스트, 또는 명확한 상태 처리를 함께 남깁니다.
