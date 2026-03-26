# CodeFlow — HTML/CSS/JS → Webflow Converter

## Project Plan & Architecture Document

---

## 1. Naming & Branding

### Name Options

| Option | Pros | Cons |
|--------|------|------|
| `<html/> to webflow` | Descriptive, developer-friendly | Angle brackets break in URLs, hard to Google, looks like code not a brand |
| **CodeFlow** ✅ | Clean, memorable, "Code" + "Flow" = perfect mashup, easy to type/search | Common-ish word |
| **FlowCode** | Similar mashup | Less intuitive flow direction |
| **Webfuse** | Unique, implies merging code into Webflow | Less immediately clear |
| **PasteFlow** | Describes the action perfectly | Sounds like a clipboard tool |

### Recommendation: **CodeFlow**

**Tagline:** `Code → Webflow, instantly.`

**Logo concept:** A minimal monospace `</>` icon with a subtle arrow or flow line morphing into a Webflow-inspired "W" shape. The `</>` acts as the icon mark, "CodeFlow" as the wordmark.

Why not `<html/> to webflow`?
- Angle brackets can't appear in URLs, social handles, or most SEO contexts
- It reads as code, not as a product name — hard to say out loud or recommend verbally
- Trademark concerns using "Webflow" directly in the product name (Webflow is a registered trademark)
- "CodeFlow" keeps the essence while being brandable, searchable, and shareable

---

## 2. Hosting: Vercel

### Why Vercel?

| Factor | Vercel | Notes |
|--------|--------|-------|
| **Next.js integration** | ✅ Built by Next.js team | Zero-config deployment, instant previews |
| **Bandwidth (free)** | 100 GB/month | Sufficient for launch |
| **Build minutes (free)** | 6,000 min/month | 20x more than Netlify free |
| **Edge network** | ✅ ~70ms TTFB globally | Faster than Netlify (~90ms) |
| **DX quality** | ✅ Best-in-class for Next.js | Auto previews per PR, instant rollbacks |
| **Git integration** | ✅ GitHub, GitLab, Bitbucket | Auto-deploy from `main` |

**Note:** Vercel's free "Hobby" tier prohibits commercial use. This is fine for launch as a free tool. If monetization is added later (ads, sponsorships, paid tier), upgrade to Pro ($20/month).

---

## 3. Tech Stack (100% Free & Open Source)

### Framework
```
Next.js 14+ (App Router) + TypeScript + React
```
- **Next.js** — File-based routing, SSR/SSG for SEO, image optimization, built-in API routes
- **TypeScript** — Critical for type-safe XscpData JSON construction (nodes, styles, variants)
- **React** — Component architecture for editor UI, tabs, toasts, modals

### Code Editor
```
CodeMirror 6 (MIT License) + @codemirror/lang-html, @codemirror/lang-css, @codemirror/lang-javascript
```
- Industry-standard web code editor (used by Chrome DevTools, Replit, etc.)
- Syntax highlighting for HTML, CSS, JS
- Themes, autocomplete, bracket matching
- Lightweight (~150KB gzipped for full setup)
- React wrapper: `@uiw/react-codemirror`

### Animations & Visual Effects
```
Framer Motion (MIT) — React-native animation library
Lenis (smooth scrolling - MIT)
CSS Animations (zero-cost, native)
```
- **Framer Motion** — First-class React support, declarative API, layout animations
- **Lenis** — Buttery smooth scrolling by Studio Freight (MIT)
- **Three.js** — Optional for a subtle hero background effect (particles, mesh gradient)
- Note: Keep animations tasteful and performant — minimalist but premium feel

### Fonts
```
Primary: "DM Sans" (Google Fonts, free) — geometric sans-serif similar to WF Visual Sans
Monospace: "JetBrains Mono" (Google Fonts, free) — for code editor
Display: "Syne" (Google Fonts, free) — for hero headlines
```
- Webflow uses "WF Visual Sans" (proprietary, geometric). DM Sans is the closest free alternative
- JetBrains Mono is beautiful for code and completely open source
- Loaded via `next/font/google` for zero layout shift

### Package Manager
```
pnpm 9+ (enforced via packageManager field + .npmrc)
```
- Faster installs via content-addressable store (shared across projects)
- Strict dependency isolation prevents phantom dependency bugs
- `shamefully-hoist=true` for Next.js compatibility
- `engine-strict=true` blocks accidental npm/yarn usage
- Lockfile: `pnpm-lock.yaml` (committed, `package-lock.json` gitignored)

### Linting & Formatting
```
ESLint + Prettier + TypeScript ESLint + jsx-a11y
```
- **ESLint** — static analysis, catches bugs before runtime
- **@typescript-eslint** — TypeScript-aware rules, no-unused-vars, no-explicit-any
- **eslint-plugin-react + react-hooks** — React best practices, hooks rules
- **eslint-plugin-jsx-a11y** — accessibility linting (supports Lighthouse 90+ target)
- **Prettier** — opinionated formatter, zero style debates, integrates with VS Code on save
- **eslint-config-prettier** — disables ESLint rules that conflict with Prettier
- Scripts: `pnpm lint`, `pnpm lint:fix`, `pnpm format`, `pnpm format:check`


```
Tailwind CSS + CSS Variables
```
- Utility-first approach speeds up UI development dramatically
- Built-in responsive utilities (`md:`, `lg:`) and dark mode (`dark:`)
- Tree-shaken in production — only ships CSS you actually use
- CSS variables for brand tokens (colors, fonts) in `tailwind.config.js`
- `@apply` directive for reusable component patterns when needed

### Build & Deploy
```
Next.js → Vercel (auto-deploy from GitHub main branch)
```
- Zero server costs on Hobby tier
- Automatic deploys from GitHub `main` branch
- Preview deploys for every PR
- Edge network for global performance

---

## 4. Color Palette

### Inspired by Webflow, remixed for Codeflow

```css
:root {
  /* Primary — Electric Blue (Webflow-inspired, slightly warmer) */
  --color-primary: #2463EB;
  --color-primary-light: #4A85F2;
  --color-primary-dark: #1A4FBF;

  /* Accent — Cyan/Teal (our differentiator) */
  --color-accent: #06D6A0;
  --color-accent-light: #34E0B5;
  --color-accent-dark: #04B386;

  /* Neutrals — Cool grays with blue undertone */
  --color-bg-primary: #0A0E17;         /* Deep navy-black */
  --color-bg-secondary: #111827;       /* Card/editor background */
  --color-bg-tertiary: #1F2937;        /* Elevated surfaces */
  --color-text-primary: #F9FAFB;       /* White text */
  --color-text-secondary: #9CA3AF;     /* Muted text */
  --color-text-tertiary: #6B7280;      /* Subtle text */

  /* Semantic */
  --color-success: #06D6A0;
  --color-error: #EF4444;
  --color-warning: #F59E0B;

  /* Editor-specific */
  --color-editor-bg: #0D1117;          /* GitHub-dark inspired */
  --color-editor-gutter: #161B22;
  --color-editor-line-highlight: #1A2233;
  --color-tab-active: #2463EB;
  --color-tab-inactive: #1F2937;
}
```

The palette is a dark-mode-first design (like Webflow's Designer UI) with electric blue as the hero color and a teal/green accent that signals "conversion success" — a visual metaphor for code transforming into Webflow components.

---

## 5. Architecture

### App Structure
```
codeflow/
├── package.json
├── tsconfig.json
├── next.config.ts
├── vercel.json                    # Vercel config (headers, rewrites)
│
├── public/
│   ├── favicon.svg
│   ├── og-image.png               # Social sharing preview
│   └── fonts/                     # Self-hosted font files (optional)
│
├── src/
│   ├── app/
│   │   ├── layout.tsx             # Root layout (fonts, metadata, global styles)
│   │   ├── page.tsx               # Home page (landing + editor)
│   │   └── globals.css            # CSS variables, reset, base styles
│   │
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── Hero.tsx
│   │   ├── Editor/
│   │   │   ├── EditorPanel.tsx     # Main editor container
│   │   │   ├── EditorTabs.tsx      # HTML/CSS/JS tab switching
│   │   │   ├── CodeEditor.tsx      # CodeMirror wrapper component
│   │   │   └── ConvertButton.tsx   # Convert CTA button
│   │   ├── HowItWorks.tsx
│   │   ├── Features.tsx
│   │   ├── Footer.tsx
│   │   └── ui/
│   │       ├── Toast.tsx           # Success/error notifications
│   │       └── Modal.tsx           # Instructions/tutorial modal
│   │
│   ├── lib/
│   │   ├── converter/
│   │   │   ├── index.ts            # Main conversion orchestrator
│   │   │   ├── html-parser.ts      # Parse HTML → DOM tree
│   │   │   ├── css-parser.ts       # Parse CSS → style rules
│   │   │   ├── js-handler.ts       # Handle JS (embed or custom code)
│   │   │   ├── webflow-builder.ts  # Build @webflow/XscpData JSON
│   │   │   ├── client-first.ts     # Client-First naming convention logic
│   │   │   ├── clipboard.ts        # Copy JSON to clipboard as application/json
│   │   │   └── types.ts            # TypeScript types for XscpData, nodes, styles
│   │   └── utils/
│   │       ├── uuid.ts             # Generate Webflow-style UUIDs
│   │       └── sanitize.ts         # Input sanitization
│   │
│   └── hooks/
│       └── useClipboard.ts         # React hook for clipboard operations
│
├── task_plan.md                    # Planning-with-files: task phases
├── findings.md                     # Planning-with-files: research & decisions
├── progress.md                     # Planning-with-files: session log
└── README.md
```

### Core Data Flow
```
┌─────────────────────────────────────────────────────────────┐
│                     USER INPUT                               │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                  │
│  │   HTML   │  │   CSS    │  │    JS    │   CodeMirror 6    │
│  │  Editor  │  │  Editor  │  │  Editor  │   Tabs            │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘                  │
│       │              │              │                        │
└───────┼──────────────┼──────────────┼────────────────────────┘
        │              │              │
        ▼              ▼              ▼
┌─────────────────────────────────────────────────────────────┐
│                   CONVERSION ENGINE                          │
│                                                              │
│  1. html-parser.js    → Parse HTML into DOM tree             │
│  2. css-parser.js     → Parse CSS into rule map              │
│  3. client-first.js   → Generate CF-compliant class names    │
│  4. webflow-builder.js→ Build XscpData JSON structure        │
│  5. js-handler.js     → Wrap JS for Webflow custom code      │
│                                                              │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                   OUTPUT                                     │
│                                                              │
│  @webflow/XscpData JSON → Clipboard (application/json)       │
│                                                              │
│  User pastes directly into Webflow Designer (Cmd+V / Ctrl+V)│
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 6. Webflow XscpData JSON Format

The core output format that Webflow's Designer reads from the clipboard:

```json
{
  "type": "@webflow/XscpData",
  "payload": {
    "nodes": [
      {
        "_id": "uuid-here",
        "type": "Block",
        "tag": "div",
        "classes": ["class-uuid-1"],
        "children": ["child-uuid-1", "child-uuid-2"],
        "data": {
          "tag": "div",
          "text": false,
          "xattr": [],
          "search": { "exclude": false },
          "visibility": { "conditions": [] },
          "displayName": "",
          "attr": { "id": "" }
        }
      }
    ],
    "styles": [
      {
        "_id": "class-uuid-1",
        "fake": false,
        "type": "class",
        "name": "section_hero",
        "namespace": "",
        "comb": "",
        "styleLess": "display: flex; flex-direction: column; padding: 4rem 2rem;",
        "variants": {
          "medium": {
            "styleLess": "padding: 2rem 1rem;"
          }
        },
        "children": [],
        "selector": null
      }
    ],
    "assets": [],
    "ix1": [],
    "ix2": { "interactions": [], "events": [], "actionLists": [] }
  },
  "meta": {
    "unlinkedSymbolCount": 0,
    "droppedLinks": 0,
    "dynBindRemovedCount": 0,
    "dynListBindRemovedCount": 0,
    "paginationRemovedCount": 0
  }
}
```

### Key mappings:
- **nodes** → Each HTML element becomes a node with unique `_id`, tag, children refs, and class refs
- **styles** → Each CSS class becomes a style entry with `styleLess` (Webflow's CSS string format)
- **variants** → Responsive breakpoints: `medium` (tablet ≤991px), `small` (mobile landscape ≤767px), `tiny` (mobile portrait ≤478px)
- **classes** → Array of style `_id` references, not class name strings
- **children** → Array of child node `_id` strings

### Clipboard Copy Method:
```js
// CRITICAL: Must use application/json MIME type
document.addEventListener('copy', (e) => {
  const json = JSON.stringify(webflowData);
  e.clipboardData.setData('application/json', json);
  e.preventDefault();
}, { once: true });
document.execCommand('copy');
```

---

## 7. Client-First Naming Convention Engine

### Rules implemented:

1. **Custom classes use underscores** to create folders:
   - `section_hero`, `hero_content`, `hero_heading`
   - The part before `_` is the folder, after is the identifier

2. **Utility classes use hyphens** (no underscore):
   - `text-size-large`, `margin-bottom-medium`, `background-color-primary`

3. **General-to-specific naming**:
   - ❌ `large-heading-hero`
   - ✅ `hero_heading-large`

4. **Descriptive, no abbreviations**:
   - ❌ `sec-h`, `btn-lg`
   - ✅ `section_header`, `button-large`

5. **Page structure classes**:
   - `page-wrapper` → outermost wrapper
   - `section_[name]` → each section
   - `padding-global` → consistent horizontal padding
   - `container-large` / `container-small` → max-width containers
   - `padding-section-large` / `padding-section-medium` → vertical rhythm

### Mapping HTML → Client-First:
```
<header>           → section_header
<nav>              → navbar_component
<section>          → section_[context]
<div class="hero"> → hero_wrapper
<h1>               → heading-style-h1 (or inherit tag styles)
<p>                → text-size-regular (or inherit)
<button>           → button / button is-primary
<footer>           → section_footer
<img>              → [parent]_image
<a>                → [parent]_link / text-style-link
<ul>/<ol>          → [parent]_list
<li>               → [parent]_list-item
<form>             → [parent]_form
<input>            → form_input / form_field
```

---

## 8. Responsive Breakpoint Strategy

### Webflow breakpoints mapped:
```
Desktop (base)    → No variant (default styles)
Tablet (≤991px)   → "medium" variant
Mobile L (≤767px) → "small" variant
Mobile P (≤478px) → "tiny" variant
```

### CSS Media Query → Webflow Variant mapping:
```css
/* Input CSS */
@media (max-width: 991px)  { ... }  →  variants.medium
@media (max-width: 767px)  { ... }  →  variants.small
@media (max-width: 478px)  { ... }  →  variants.tiny
```

### Auto-responsive behaviors:
- Flex containers → Switch `flex-direction: row` to `column` on mobile
- Font sizes → Scale down proportionally
- Padding/margin → Reduce by ~40% on tablet, ~60% on mobile
- Grid columns → Collapse from multi-column to single-column

---

## 9. Page Layout & UX Design

### Single-page layout (top to bottom):

```
┌─────────────────────────────────────────────────┐
│  NAVBAR: Logo (</> CodeFlow) + GitHub + Docs     │
├─────────────────────────────────────────────────┤
│                                                  │
│  HERO SECTION                                    │
│  "Code → Webflow, instantly."                    │
│  Animated particles/mesh gradient background     │
│  Scroll indicator arrow                          │
│                                                  │
├─────────────────────────────────────────────────┤
│                                                  │
│  EDITOR SECTION                                  │
│  ┌─────────────────────────────────────────┐    │
│  │ [HTML] [CSS] [JS]        tabs           │    │
│  │                                          │    │
│  │  CodeMirror Editor                       │    │
│  │  (syntax highlighted, line numbers)      │    │
│  │                                          │    │
│  │                                          │    │
│  ├──────────────────────────────────────────┤    │
│  │  [ ⚡ Convert to Webflow ]  CTA button  │    │
│  └──────────────────────────────────────────┘    │
│                                                  │
│  Success toast: "Copied! Paste into Webflow"     │
│                                                  │
├─────────────────────────────────────────────────┤
│                                                  │
│  HOW IT WORKS (3 steps, animated on scroll)      │
│  1. Write/paste your code                        │
│  2. Click Convert                                │
│  3. Paste into Webflow Designer                  │
│                                                  │
├─────────────────────────────────────────────────┤
│                                                  │
│  FEATURES (grid cards, hover effects)            │
│  - Client-First classes                          │
│  - Mobile responsive output                      │
│  - Clean class structure                         │
│  - Instant clipboard copy                        │
│                                                  │
├─────────────────────────────────────────────────┤
│  FOOTER: Credits, GitHub link, "Made with ♥"     │
└─────────────────────────────────────────────────┘
```

---

## 10. Development Phases

### Phase 1: Foundation (Week 1)
- [ ] Initialize Vite project
- [ ] Set up GitHub repository
- [ ] Connect Netlify for auto-deploy from `main`
- [ ] Implement base layout (HTML/CSS)
- [ ] Set up CSS variables & design tokens
- [ ] Integrate CodeMirror 6 with HTML/CSS/JS modes
- [ ] Build tab switching UI

### Phase 2: Conversion Engine (Week 2)
- [ ] Build HTML parser (DOM tree → node structure)
- [ ] Build CSS parser (stylesheet → style rules)
- [ ] Implement Client-First naming engine
- [ ] Build Webflow XscpData JSON builder
- [ ] Implement clipboard copy with `application/json` MIME type
- [ ] Handle responsive breakpoints from media queries
- [ ] Handle JS → Webflow custom code embed

### Phase 3: UI Polish & Animations (Week 3)
- [ ] Hero section with animated background (subtle Three.js particles or CSS mesh gradient)
- [ ] GSAP scroll-triggered animations for sections
- [ ] Toast notification system (success/error)
- [ ] "How it works" animated step sequence
- [ ] Feature cards with hover micro-interactions
- [ ] Dark/light mode toggle (optional, dark-first)
- [ ] Mobile responsive layout for the tool itself

### Phase 4: Testing & Launch (Week 4)
- [ ] Test conversion with real HTML components (navbar, hero, cards, footer)
- [ ] Test clipboard paste in Webflow Designer
- [ ] Verify Client-First class naming
- [ ] Verify responsive variants work in Webflow
- [ ] Performance audit (Lighthouse 90+ score)
- [ ] SEO meta tags, OG image, favicon
- [ ] Write README documentation
- [ ] Launch on Product Hunt / Webflow community / Twitter

---

## 11. GitHub Repository Setup

```bash
# Prerequisites — install pnpm if not already installed
npm install -g pnpm@9

# Project location (WSL)
cd ~/code/codeflow

# Install dependencies
pnpm install

# Initial commit
git init
git add .
git commit -m "feat: initial project setup with Next.js + TypeScript + pnpm

Co-authored-by: Claude <claude@anthropic.com>"

# Push to GitHub
git remote add origin https://github.com/YOUR_USERNAME/codeflow.git
git push -u origin main

# Branching strategy
main        → Production (auto-deploys to Vercel)
develop     → Integration branch
feature/*   → Feature branches (feature/editor, feature/converter, etc.)

# Branch protection (recommended)
- Require PR reviews before merging to main
- Auto-deploy previews on PRs via Vercel
```

### `.npmrc` (enforces pnpm)
```
engine-strict=true
shamefully-hoist=true
auto-install-peers=true
```

### Co-authorship
All commits suggested by Claude include the trailer:
```
Co-authored-by: Claude <claude@anthropic.com>
```

### `vercel.json`
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "Permissions-Policy", "value": "clipboard-write=(self)" }
      ]
    }
  ]
}
```

---

## 12. Key Technical Challenges & Solutions

### Challenge 1: Clipboard MIME type
**Problem:** Webflow reads `application/json` from clipboard, but the Clipboard API's `navigator.clipboard.write()` doesn't natively support custom MIME types in all browsers.

**Solution:** Use the `document.execCommand('copy')` fallback inside a synthetic `copy` event listener, or use the newer `ClipboardItem` API with a blob:
```js
const blob = new Blob([jsonString], { type: 'application/json' });
const clipboardItem = new ClipboardItem({ 'application/json': blob });
await navigator.clipboard.write([clipboardItem]);
```

### Challenge 2: CSS → Webflow styleLess format
**Problem:** Webflow uses a flat string format for styles (`styleLess`), not standard CSS objects.

**Solution:** Parse CSS with a lightweight parser, convert each property-value pair to Webflow's semicolon-separated string: `"display: flex; padding: 2rem;"`. Map CSS shorthand properties to their Webflow equivalents.

### Challenge 3: Responsive conversion
**Problem:** Users write `@media` queries, but Webflow uses variant objects keyed by breakpoint.

**Solution:** Parse `@media` rules, match max-width values to Webflow breakpoints (991→medium, 767→small, 478→tiny), and place those styles in the appropriate variant object within each style entry.

### Challenge 4: Class deduplication
**Problem:** Multiple elements may share the same CSS class, but Webflow expects each class definition to appear once in `styles[]` with a unique `_id`.

**Solution:** Build a class registry during parsing. When a class name is encountered for the first time, generate a UUID and store the mapping. Subsequent elements reference the same UUID.

---

## 13. Cost Analysis

| Item | Cost |
|------|------|
| Vercel hosting (free tier) | $0/month |
| GitHub (free, public repo) | $0/month |
| Domain (optional, e.g., codeflow.dev) | ~$12/year |
| pnpm | Free (MIT) |
| CodeMirror 6 | Free (MIT) |
| GSAP (free tier) | Free (no-charge license) |
| Lenis | Free (MIT) |
| Three.js (optional) | Free (MIT) |
| Google Fonts | Free |
| **Total** | **$0–$12/year** |

---

## 14. Future Roadmap (Post-Launch)

- **v1.1** — Live HTML preview panel alongside editor
- **v1.2** — Template library (pre-built components: navbar, hero, footer, CTA)
- **v1.3** — AI integration (call Claude API to generate HTML from a prompt, then convert)
- **v1.4** — Batch conversion (multiple sections at once)
- **v1.5** — Webflow interaction/animation mapping from CSS animations
- **v2.0** — Chrome extension for one-click conversion from any webpage
- **v2.1** — Figma → HTML → Webflow pipeline
- **v2.2** — Community component sharing

---

## 15. Success Metrics

- **Conversion accuracy**: 95%+ of pasted components render correctly in Webflow
- **Time saved**: Convert in <2 seconds (client-side, no server round trip)
- **User adoption**: Track via Netlify Analytics (privacy-friendly, no JS tracking)
- **Lighthouse score**: 90+ across all categories
- **Bundle size**: <500KB total (including CodeMirror)

---

*Document created: March 26, 2026*
*Last updated: March 26, 2026*
