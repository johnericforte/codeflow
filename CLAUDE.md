# Codeflow — Claude Code Project Instructions

## Project Overview

Codeflow is a free, open-source web tool that converts vanilla HTML/CSS/JS into
Webflow-compatible `@webflow/XscpData` JSON, following Client-First naming conventions,
and copies it to the clipboard for direct paste into Webflow Designer.

## Read These First

Before starting any work, read these planning files to get fully oriented:

- `project_plan.md` — full architecture, tech stack, color palette, data flow
- `task_plan.md` — phase checklist, decisions made, current phase
- `findings.md` — research findings, technical decisions
- `progress.md` — session log, what's been done

## Skills

Read the relevant skill file before working on tasks in that category.

| Task                                   | Skill File                                  |
| -------------------------------------- | ------------------------------------------- |
| Building UI components, pages, layouts | `.claude/skills/frontend-design/SKILL.md`   |
| Reviewing PRs via gh CLI               | `.claude/skills/github-pr-review/SKILL.md`  |
| Full site quality audit                | `.claude/skills/web-quality-audit/SKILL.md` |
| Performance optimization               | `.claude/skills/performance/SKILL.md`       |
| Accessibility / WCAG compliance        | `.claude/skills/accessibility/SKILL.md`     |
| SEO meta tags, structured data         | `.claude/skills/seo/SKILL.md`               |

## Hard Rules

- **Package manager:** `pnpm` only — never `npm install` or `yarn`
- **Linting:** `pnpm lint` must pass before every commit (Husky enforces this)
- **Formatting:** `pnpm format` before committing
- **Branching:** feature branches only — never commit directly to `main`
- **PRs:** All merges to `main` go through a PR — use github-pr-review skill

## Tech Stack

- Next.js 14 (App Router) + TypeScript + React
- Tailwind CSS + CSS Variables
- CodeMirror 6 (`@uiw/react-codemirror`)
- pnpm 9+
- Deployed on Vercel

## Brand

- Primary: `#2463EB` (electric blue)
- Accent: `#06D6A0` (teal)
- Background: `#0A0E17` (deep navy-black)
- Fonts: DM Sans (body), JetBrains Mono (code), Syne (display/headings)
- Dark-mode first

## Folder Structure

```
src/
  app/          → Next.js App Router pages + layout
  components/   → React components
    Editor/     → CodeMirror editor components
    ui/         → Shared UI primitives (Toast, Modal, etc.)
  lib/
    converter/  → Webflow XscpData conversion engine
    editor/     → Editor theme + starter code
    utils/      → Shared utilities
  hooks/        → Custom React hooks
```

## Verification Checklist

After building any UI component, verify:

- [ ] Follows brand palette (blues, teals, dark backgrounds)
- [ ] Uses DM Sans / JetBrains Mono / Syne — never Inter, Roboto, Arial
- [ ] Tailwind classes used for layout, CSS variables for brand tokens
- [ ] `pnpm lint` passes with no errors
- [ ] Keyboard accessible (focusable, visible focus ring)
- [ ] `prefers-reduced-motion` respected for animations
- [ ] Mobile responsive
- [ ] No hardcoded colors outside of CSS variables / Tailwind config
