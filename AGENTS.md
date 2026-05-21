<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:cmate-rules -->
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
<!-- END:cmate-rules -->
