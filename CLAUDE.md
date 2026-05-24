Behavioral guidelines to reduce common LLM coding mistakes. Merge with project-specific instructions as needed.

Tradeoff: These guidelines bias toward caution over speed. For trivial tasks, use judgment.

1. Think Before Coding
   Don't assume. Don't hide confusion. Surface tradeoffs.

Before implementing:

State your assumptions explicitly. If uncertain, ask.
If multiple interpretations exist, present them - don't pick silently.
If a simpler approach exists, say so. Push back when warranted.
If something is unclear, stop. Name what's confusing. Ask. 2. Simplicity First
Minimum code that solves the problem. Nothing speculative.

No features beyond what was asked.
No abstractions for single-use code.
No "flexibility" or "configurability" that wasn't requested.
No error handling for impossible scenarios.
If you write 200 lines and it could be 50, rewrite it.
Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

3. Surgical Changes
   Touch only what you must. Clean up only your own mess.

When editing existing code:

Don't "improve" adjacent code, comments, or formatting.
Don't refactor things that aren't broken.
Match existing style, even if you'd do it differently.
If you notice unrelated dead code, mention it - don't delete it.
When your changes create orphans:

Remove imports/variables/functions that YOUR changes made unused.
Don't remove pre-existing dead code unless asked.
The test: Every changed line should trace directly to the user's request.

4. Goal-Driven Execution
   Define success criteria. Loop until verified.

Transform tasks into verifiable goals:

"Add validation" → "Write tests for invalid inputs, then make them pass"
"Fix the bug" → "Write a test that reproduces it, then make it pass"
"Refactor X" → "Ensure tests pass before and after"
For multi-step tasks, state a brief plan:

1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
   Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

These guidelines are working if: fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

# cmate project rules (always apply)

Read **before** writing any file in this repo. These are absolute — if something here conflicts with a habit, the rule wins.

1. **Tokens only** — colors / spacing / radius / shadow / motion come from the `@theme` block in `app/globals.css`. No `#` hex or `px` literals in JSX, CSS, or `style={{}}` outside `globals.css`. Use Tailwind utilities (`bg-primary`, `rounded-lg`, `shadow-md`).
2. **Reuse primitives** — Button / Input / Select / Radio / Checkbox / Card / Row live in `app/_components/ui/` with union-typed variants. Need a new variant? Extend the union, don't inline a new component or pass arbitrary `className` to override.
3. **Korean labels stay in JSX** — no `t()` wrapper, no i18n key extraction until explicitly requested. Spellings are pinned in `.claude/skills/cmate-web-shell/SKILL.md` glossary.
4. **RSC by default** — Server Components everywhere. Add `'use client'` only on the leaf that needs `useState` / `useEffect` / browser events. Never put `'use client'` on a page or layout.
5. **Next 16 caveat** — before writing any new route / metadata / Server Action / fetch caching pattern, open the matching page under `node_modules/next/dist/docs/01-app/`. APIs changed.
6. **SKILL.md first** — before touching an area, load `.claude/skills/<area>/SKILL.md` if one exists. Do not re-scrape `docs/cmate-redesign-mockup.html` per turn.
7. **File locations** — routes in `app/(web)/...`, UI primitives in `app/_components/ui/`, domain components in `app/_components/<domain>/`, utilities in `app/_lib/`, fonts in `app/_fonts/`.
8. **Stop-gate** — assume `npm run check` (typecheck + lint) runs on Stop. Don't end a turn with known TS errors or lint warnings. For PR-sized changes, invoke `bkit:code-review` before pushing.
9. **Error boundaries** — 모든 route group에 `error.tsx`를 두고, root에는 `global-error.tsx`도 배치한다. 에러 UI는 프로젝트 디자인 토큰을 사용하고 "다시 시도" 버튼을 포함한다. `error.tsx`는 반드시 `'use client'`이며 `unstable_retry` prop을 사용한다 (Next.js 16 convention).
10. **not-found / loading** — route group마다 `not-found.tsx`와 `loading.tsx`를 둔다. `not-found.tsx`는 Server Component로 유지하고, `loading.tsx`는 스켈레톤이나 스피너로 구현한다.
11. **Image 최적화** — `<img>` 태그 금지. 항상 `next/image`의 `<Image>`를 사용하고 `width`/`height` 또는 `fill`을 명시한다. SVG 아이콘은 인라인 `<svg>` 또는 컴포넌트 import 허용.
12. **Link 사용** — 내부 네비게이션에 `<a>` 태그 금지. 항상 `next/link`의 `<Link>`를 사용한다. 외부 URL만 `<a target="_blank" rel="noopener noreferrer">`를 허용한다.
13. **'use client' 최소화** — Client Component에서도 가능한 한 작은 leaf 컴포넌트만 `'use client'`로 분리한다. 이벤트 핸들러나 `useState`/`useEffect`가 필요한 부분만 클라이언트로 내린다. page.tsx, layout.tsx에는 절대 `'use client'`를 넣지 않는다.
14. **타입 안전성** — `any` 타입 금지. 불가피하면 `unknown` + 타입 가드를 사용한다. API 응답이나 외부 데이터는 반드시 타입을 정의한다.
15. **명시적 반환 타입** — 함수의 반환 타입을 명시한다. React 컴포넌트는 `JSX.Element` 생략 가능.
16. **네이밍** — 컴포넌트 파일: PascalCase (`FormProgressBar.tsx`), 디렉토리: kebab-case (`base-info/`), 함수: camelCase, 상수: UPPER_SNAKE_CASE.
17. **Named exports** — default export 지양. 모든 컴포넌트와 유틸리티는 named export로 내보낸다.
18. **Import 순서** — ① React 및 외부 라이브러리 → ② 내부 컴포넌트 → ③ 유틸리티 / 헬퍼 → ④ 타입 정의. 그룹 사이 빈 줄 하나.
