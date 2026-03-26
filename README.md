# Codeflow &nbsp;`</> → W`

**Convert vanilla HTML, CSS, and JavaScript into Webflow-compatible components — instantly.**

Paste your code, click **Convert to Webflow**, and paste directly into Webflow Designer with `Ctrl+V` / `Cmd+V`. Codeflow outputs the exact `@webflow/XscpData` clipboard format that Webflow expects, with [Client-First](https://finsweet.com/client-first) naming conventions and responsive breakpoints baked in.

---

## What it does

Webflow's Designer has a clipboard format (`@webflow/XscpData` JSON) that lets you paste fully-structured components — elements, classes, responsive variants — directly into the canvas. Codeflow bridges the gap between hand-written HTML/CSS/JS and that format, so you can:

- Write a component in vanilla HTML + CSS
- Run it through Codeflow
- Paste it straight into Webflow — classes, responsive styles, and all

No copy-pasting class names. No rebuilding layouts from scratch. No manual style entry.

---

## Features

- **Three-tab code editor** — HTML, CSS, and JS with full syntax highlighting (CodeMirror 6)
- **Client-First class naming** — auto-generates Finsweet Client-First compliant class names (`section_hero`, `button is-primary`, etc.)
- **Responsive breakpoints** — CSS `@media` queries map to Webflow's `medium` / `small` / `tiny` variants automatically
- **One-click clipboard copy** — outputs `application/json` MIME type that Webflow reads natively
- **JS embed support** — wraps JavaScript as a Webflow Custom Code embed block
- **Client-side only** — nothing leaves your browser, no server, no signup

---

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 14 (App Router) + TypeScript |
| Styling | Tailwind CSS v4 + CSS variables |
| Code editor | CodeMirror 6 via `@uiw/react-codemirror` |
| Fonts | Syne (display) · DM Sans (body) · JetBrains Mono (code) |
| Hosting | Vercel |
| Package manager | pnpm |

---

## Getting started

**Prerequisites:** Node.js 18+, pnpm 9+

```bash
# Clone
git clone https://github.com/johnericforte/codeflow.git
cd codeflow

# Install
pnpm install

# Run dev server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Development workflow

```
main          ← production (protected — no direct pushes)
  └── development   ← integration branch
        └── feature/*   ← all work branches off here
        └── fix/*
        └── chore/*
```

```bash
# Always branch off development
git checkout development && git pull
git checkout -b feature/your-feature

# Before committing
pnpm format   # Prettier
pnpm lint     # ESLint

# Push and open PR → development
git push -u origin feature/your-feature
gh pr create
```

PRs to `main` are only accepted from the `development` branch — a CI check enforces this.

---

## Project structure

```
src/
  app/                  → Next.js App Router (layout, page, globals.css)
  components/
    Editor/             → CodeMirror editor UI (EditorPanel, EditorTabs, CodeEditor, ConvertButton)
    ui/                 → Shared primitives (Toast, Modal — Phase 4)
  lib/
    converter/          → Webflow XscpData conversion engine (Phase 3)
      types.ts          → Full TypeScript types for XscpData format
    editor/
      theme.ts          → CodeMirror theme (CSS-variable-based)
      starterCode.ts    → Default starter code for each tab
    utils/              → Shared utilities
  hooks/                → Custom React hooks
```

---

## Roadmap

| Phase | Status | Description |
|---|---|---|
| 1 — Foundation | ✅ Done | Project scaffold, design system, XscpData types |
| 2 — Editor UI | ✅ Done | CodeMirror 6 editor, tabs, convert button |
| 3 — Conversion engine | 🔄 Next | HTML parser → CSS parser → XscpData builder → clipboard |
| 4 — Landing page | ⏳ Pending | Hero, How it works, Features, animations |
| 5 — Testing & QA | ⏳ Pending | Webflow paste tests, Lighthouse audit |
| 6 — Launch | ⏳ Pending | Domain, OG image, Product Hunt |

---

## Webflow clipboard format

Codeflow outputs the `@webflow/XscpData` JSON structure:

```json
{
  "type": "@webflow/XscpData",
  "payload": {
    "nodes": [{ "_id": "uuid", "type": "Block", "tag": "div", "classes": ["style-uuid"], "children": [] }],
    "styles": [{ "_id": "style-uuid", "name": "section_hero", "styleLess": "display: flex; padding: 4rem 2rem;" }],
    "assets": [],
    "ix1": [],
    "ix2": { "interactions": [], "events": [], "actionLists": [] }
  },
  "meta": { "unlinkedSymbolCount": 0, "droppedLinks": 0, "dynBindRemovedCount": 0, "dynListBindRemovedCount": 0, "paginationRemovedCount": 0 }
}
```

The clipboard copy uses `application/json` MIME type via the `ClipboardItem` API — the exact format Webflow Designer reads.

---

## License

MIT — free to use, fork, and build on.

---

*Built with [Claude Code](https://claude.com/claude-code)*
