---
name: cmate-web-shell
classification: capability
description: |
  Reference skill for porting the cmate web mockup (docs/cmate-redesign-mockup.html)
  into Next.js 16 components. Covers the four mockup views — cm-web-shell (desktop),
  view-mobile, view-modals, view-design — their structure, design tokens, scripts,
  and the mapping to Next.js components/routes.

  Use when implementing any part of the cmate UI, naming a new component, or
  deciding which tokens/breakpoints/states apply.

  Triggers: cmate, cm-web-shell, web-shell, cmate UI, cmate mockup,
  cmate redesign, cmate port, base-info, 기본정보, 마이페이지.
user-invocable: true
allowed-tools: [Read, Grep, Glob]
---

# cmate-web-shell

Port the cmate mockup into Next.js 16 components. Concise reference — do not duplicate the mockup or the plan doc, just point to them.

## Source files

| File | Lines | Role |
|------|-------|------|
| `docs/cmate-redesign-mockup.html` | 4891 | Visual source. Contains 4 view sections (see table below). |
| `docs/cmate-base-info-plan.html` | 959 | Product/UX spec for Step 1 form behavior. Consult for validation, auto-save, modal flows. |
| `AGENTS.md` | — | Next.js 16 caveat. Read the relevant section of `node_modules/next/dist/docs/` before writing JSX. |

## Tech stack (pinned)

Next 16.2.6 (App Router, RSC default) · React 19.2.4 · Tailwind v4 via `@tailwindcss/postcss` · TypeScript 5. No other deps yet — add deliberately.

## Mockup views

| View id | Lines | Role | Port priority |
|---------|-------|------|---------------|
| `view-desktop` (`.cm-web-shell`) | 2187–2891 | Desktop shell: header, sidebar, main, footer | P0 |
| `view-mobile` | 2894–3356 | 375px mobile frame: app header, drawer, chip stepper, FAB, accordion cards | P0 (responsive) |
| `view-modals` | 3357–3495 | Search / confirmation / church-registration modal states | P1 |
| `view-design` | 3496–4650 | Design-system doc (tokens, components, changelog) | Reference only |

`.cm-web-shell` CSS is defined at lines 169–178; the DOM instance opens at line 2189.

## cm-web-shell component tree

- **site-header-area** — site-header (cm-logo · site-nav 6 items · site-actions: call + avatar + logout) · site-mega (6-col mega menu, hover/focus)
- **desktop-app-header** (shown ≤1023px) — mobile-status · m-topbar (back · title · burger) · m-drawer (logo + main 6 + mypage 8) · m-stepper (5 chips + progress 17/19)
- **web-main** (grid 172 · 1fr · 68)
  - **left-sidebar** — title "마이페이지" + side-list (내정보 + 7 subitems, 매칭라운지, 만남캘린더, 문의하기)
  - **desktop-frame** — d-stepper (5 steps) · d-hero (eyebrow / h1 / subtitle / progress / P0/P1 pins) · d-body (6 cards, see below) · d-footer (auto-save chip + Save + Next, syncs to viewport)
  - **quick-rail** — quick-fab-toggle + 6 quick buttons (자녀결혼, 업그레이드, 오시는길, 프로필컨설팅, 33법칙, TOP+)
- **site-footer** / **m-site-footer--responsive** — links · cm-logo · footer-info (legal) · footer-contact (CTA · hours · 4 socials)

Atomic primitives shared across blocks: Button (sm/md/lg × primary/secondary/tertiary/danger/icon), Input, Select, Radio, Checkbox, Avatar, Pin/Chip, ProgressBar, HighlightBox, InfoBox, PhotoSlot, StyleChip.

## Form sections inside d-body (6 cards)

1. 가족·거주 2. 신앙 3. 학력·직장 4. 신체·스타일 5. 생활습관·가치관 6. 프로필 사진

Each card uses the same `.card` → `.card-head` / `.card-body` shape, with rows of `.lcol` (label + required `*` + helper + pins) and `.fcol` (the input). Reuse one `<Card>` + `<Row>` + field primitives — do not re-implement per section.

## Design tokens

Define once as Tailwind v4 `@theme` in `app/globals.css`. Never hardcode hex/px in components.

- **Color** — primary `#FF6B7E` / hover `#FF4F66` / light `#FFF1F3`; danger `#DC2626`; warning `#D97706`; success `#059669`; info `#2563EB`; text `#0F172A` / sec `#475569` / tert `#94A3B8`; surfaces `#FFFFFF` `#FAFAFA` `#F8FAFC` `#F1F5F9`; borders `#E5E7EB` `#F1F5F9` `#CBD5E1`.
- **Radius** — sm 6 · md 8 · lg 12 · xl 16 · pill 999.
- **Spacing** — 4 · 8 · 12 · 16 · 20 · 24 · 28 · 32 · 40 · 48 · 64.
- **Shadow** — sm `0 1px 2px rgba(0,0,0,.04)` · md `0 4px 12px rgba(0,0,0,.06)` · lg `0 12px 32px rgba(0,0,0,.10)` · modal `0 20px 48px rgba(0,0,0,.20)`.
- **Motion** — durations 0.12 / 0.15 / 0.24; ease standard `cubic-bezier(.2,0,0,1)` · emphasized `cubic-bezier(.3,0,.1,1)`.
- **Z-index** — base 0 · sticky 30 · footer 40 · rail 45 · drawer-backdrop 50 · header 60 · modal 80 · toast 90 · viewer-nav 100.
- **Font** — Pretendard (fallback system-ui); weights 400/500/600/700/800; type scale Display 32 · Title 20 · Section 18 · Body 14 · Helper 13 · Caption 12 · Micro 11.
- **Breakpoints** — ≤599 sm · 600–767 md · 768–1023 lg (mobile app shell) · 1024+ xl (desktop 2-col, max-width 1440).

**Single source of truth = `app/globals.css` `@theme` block.** This skill is a catalog; do not redefine tokens elsewhere. If a value is missing from `globals.css`, add it there (not in components). Mockup `:root` (lines 9–108) is the original reference.

## Interactions to port

| Behavior | Trigger | Effect |
|----------|---------|--------|
| Viewer-nav tab switch | click `.viewer-nav .tab` | swap visible `view-*` section + scroll top |
| Desktop footer sync | load / resize / scroll | dock `.d-footer` to viewport when frame is in view, fix otherwise |
| Quick-rail compact | resize ≤1023 | toggle `.quick-rail.compact`, auto-close FAB |
| Quick-FAB toggle | click `.quick-fab-toggle` | toggle `.quick-rail.open` + aria-expanded + icon `＋ ↔ ✕` |
| Mega menu | hover/focus on `.site-header-area` | add/remove `.is-mega-open` |
| Mobile card accordion | click `.m-card-head` | toggle `.m-card.open` + aria-expanded |
| Drawer | click `[data-drawer-toggle]` / `[data-drawer-close]` | toggle `hidden` on `aria-controls` target |
| Church registration | click `[data-reg-toggle]` | show/hide `.reg-form` inside modal |
| Footer company info | click `[data-company-toggle]` | show/hide company details |
| Style-group counter | select `.style-chips` chip | update `.style-sub-count` + total badge (max 5) |

## Form behavior (from base-info-plan)

- **Validation** — onBlur for text/number; onChange for radio/checkbox/select; full re-validation on Next click; inline error + red outline + `aria-describedby`.
- **Auto-save** — onBlur + 500ms debounce. States: idle → saving (spinner chip "저장 중...") → saved ("방금 자동 저장됨", 2s) → error chip + retry. Retry cap 5 then prompt explicit save.
- **Required** — red `*` in label, `aria-required="true"`. Missing on Next → scroll to first error + summary toast.
- **Church search** — zero results → EmptyState + "＋ 교회/교단 가입 신청하기" → inline reg form in same modal → "24시간 내 매니저 확인" notice; user may proceed to Step 2 while pending.
- **Photo delete/reorder** — delete rep when others exist: warning modal "두 번째 사진이 대표가 됩니다"; delete rep-only: blocking modal "대표사진은 반드시 등록"; reorder via DnD (desktop) / long-press carousel (mobile) / Shift+←/→ (keyboard).
- **Education downgrade** — degree change purges existing rows after warning modal listing affected entries.

## Next.js port conventions

- **Routes** — `app/(web)/personal-info/base-info/page.tsx` for the form; `app/(web)/layout.tsx` for shell chrome. Mobile is the same route + responsive classes; do **not** add a separate mobile route.
- **Components** — `app/_components/ui/` (Button, Input, Select, Radio, Checkbox, Card, Row — union-typed primitives, no inline new variants) · `app/_components/web-shell/` (Header, MegaMenu, Sidebar, Footer, QuickRail, MobileHeader, Drawer, Stepper) · `app/_components/form/` (PhotoSlot, StyleChip, HighlightBox, field composites) · `app/_components/modals/` (SearchModal, ConfirmModal, ChurchRegistrationModal).
- **Tokens** — `app/globals.css` `@theme` block; reference via Tailwind utilities. Never inline hex/px.
- **Korean labels** — keep in JSX for now (no i18n). See glossary below for stable spellings.
- **Server vs Client** — shell chrome and static d-hero are RSC. Anything using `useState`/scroll/resize listeners (footer sync, drawer, FAB, accordion, every form field) is `'use client'`. Push the boundary down — keep page-level RSC.
- **Next 16 caveat** — `AGENTS.md` requires reading the matching `node_modules/next/dist/docs/` page before writing any new pattern (route handlers, server actions, metadata, fetch caching all changed).

## In / Out of scope

| In scope | Out of scope |
|----------|--------------|
| Desktop shell + responsive mobile shell | Backend (church reg, auto-save, photo upload) |
| Step 1 form (6 cards) | i18n / multi-language |
| Modals (search, confirm, registration) | Steps 2–5 |
| Design tokens + Tailwind theme | Header/sidebar simplification S-4 |
| Sticky footer + quick rail | Marketing pages, auth |

## Korean ↔ English glossary

| KO | EN | Where |
|----|----|-------|
| 기본정보 | Base Info | Page title, Step 1 |
| 마이페이지 | My Page | Left sidebar title |
| 결혼경험 | Marriage Experience | Card 1 |
| 주소 / 상세주소 | Address / Detail | Card 1 |
| 신앙 / 교회 / 교단 | Faith / Church / Denomination | Card 2 |
| 모태신앙 | Native Faith | Card 2 |
| 학력 / 전공 | Education / Major | Card 3 |
| 직장 / 직무 / 연봉 | Workplace / Job / Salary | Card 3 |
| 신장 / 체형 / 혈액형 | Height / Body Type / Blood Type | Card 4 |
| 스타일 | Style | Card 4 (max 5 across 3 groups) |
| 음주 / 흡연 / 자녀계획 | Drinking / Smoking / Children Plans | Card 5 |
| 대표사진 / 포토북 | Representative Photo / Photobook | Card 6 |
| 저장하기 / 다음 | Save / Next | d-footer buttons |
| 무료 상담 받기 | Free Consultation | Header CTA |
| 로그아웃 | Logout | Header action |

## Verification

After invoking `/cmate-web-shell` in a fresh session, an agent should be able to:

1. Run `grep -n "cm-web-shell" docs/cmate-redesign-mockup.html` — expects hits at the `.cm-web-shell` CSS rule (lines 169–178) and the DOM instance (line 2189).
2. Confirm the component tree above matches the children of `<div class="cm-web-shell">` without re-reading the 4891-line mockup.
3. Recite the Next 16 caveat from `AGENTS.md` before writing any new Next/React 19 pattern.
