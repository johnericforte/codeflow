# Task Plan: Codeflow — HTML/CSS/JS → Webflow Converter

## Goal

Build a free, open-source web tool called "Codeflow" that converts vanilla HTML/CSS/JS code into Webflow-compatible `@webflow/XscpData` JSON, following Client-First naming conventions, and copies it to the user's clipboard for direct paste into Webflow Designer.

## Current Phase

Phase 1

## Phases

### Phase 1: Project Setup & Architecture

- [ ] Finalize tech stack decisions (Next.js + TypeScript + React + Vercel)
- [ ] Initialize Next.js + TypeScript project
- [ ] Set up GitHub repository structure
- [ ] Configure Vercel deployment
- [ ] Set up CSS design system (variables, tokens, fonts)
- [ ] Create base layout with navbar, hero, editor section, footer
- **Status:** in_progress

### Phase 2: Code Editor UI

- [ ] Install and configure CodeMirror 6 with TypeScript
- [ ] Build HTML/CSS/JS tab switching component
- [ ] Apply custom dark theme matching Codeflow brand
- [ ] Add syntax highlighting for all three languages
- [ ] Test editor resizing and mobile responsiveness
- [ ] Add sample starter code for each tab
- **Status:** pending

### Phase 3: Conversion Engine (Core)

- [ ] Build HTML parser — parse HTML string → DOM tree structure
- [ ] Build CSS parser — parse CSS string → style rule map
- [ ] Build Client-First naming engine (underscore folders, hyphen utilities, general-to-specific)
- [ ] Build Webflow XscpData JSON builder (nodes, styles, assets, ix1, ix2, meta)
- [ ] Implement UUID generator for Webflow-style node/class IDs
- [ ] Map CSS media queries → Webflow responsive variants (medium/small/tiny)
- [ ] Handle JS → Webflow custom code embed block
- [ ] Implement clipboard copy with `application/json` MIME type
- **Status:** pending

### Phase 4: Landing Page & Animations

- [ ] Design and build hero section with animated background (CSS mesh gradient or subtle Three.js)
- [ ] Build "How it works" 3-step section with scroll-triggered animations
- [ ] Build feature cards grid with hover micro-interactions
- [ ] Add toast notification system (success/error feedback)
- [ ] GSAP or Framer Motion entrance animations
- [ ] Ensure full mobile responsiveness of the landing page itself
- [ ] Add SEO meta tags, OG image, favicon
- **Status:** pending

### Phase 5: Testing & QA

- [ ] Test conversion with simple components (button, card, heading)
- [ ] Test conversion with complex components (navbar, hero section, footer)
- [ ] Test clipboard paste into actual Webflow Designer
- [ ] Verify Client-First class names appear correctly in Webflow
- [ ] Verify responsive variants work at each breakpoint in Webflow
- [ ] Test JS embed blocks render in Webflow
- [ ] Performance audit (Lighthouse 90+)
- [ ] Cross-browser testing (Chrome, Firefox, Safari, Edge)
- **Status:** pending

### Phase 6: Launch Preparation

- [ ] Write README.md with usage guide
- [ ] Set up custom domain (optional)
- [ ] Final Vercel production deploy
- [ ] Create OG image for social sharing
- [ ] Prepare launch post for Product Hunt / Twitter / Webflow community
- **Status:** pending

## Key Questions

1. How does `application/json` clipboard MIME work across browsers? → Need `ClipboardItem` API with `Blob` fallback
2. What exact fields does Webflow XscpData require for reliable paste? → Nodes, styles, assets, ix1, ix2, meta
3. How do Webflow responsive variants map from CSS media queries? → `medium` (≤991px), `small` (≤767px), `tiny` (≤478px)
4. Does Vercel free tier work for now? → Yes for hobby/personal, upgrade to Pro ($20/mo) if monetizing later
5. How to handle inline styles vs class-based styles? → Convert inline styles to generated Client-First classes

## Decisions Made

| Decision                              | Rationale                                                                                        |
| ------------------------------------- | ------------------------------------------------------------------------------------------------ |
| Name: Codeflow (lowercase f)          | Reads as single unified word, matches product naming convention (Webflow, Figma, Notion)         |
| Next.js + TypeScript + React          | Type safety critical for complex JSON structures, component architecture for UI, SSR for SEO     |
| pnpm (not npm)                        | Faster installs, strict dependency isolation, disk-efficient content-addressable store           |
| ESLint + Prettier + typescript-eslint | Catches bugs early, enforces consistent style, jsx-a11y supports Lighthouse 90+ target           |
| Vercel hosting                        | Natural pairing with Next.js, frictionless DX, free tier sufficient for launch                   |
| CodeMirror 6                          | Industry standard web editor, MIT license, lightweight, supports HTML/CSS/JS modes               |
| Tailwind CSS                          | Rapid utility-first styling, built-in dark mode, responsive utilities, great Next.js integration |
| Dark-mode-first UI                    | Matches Webflow Designer aesthetic, preferred by developers                                      |
| Client-First naming convention        | Industry standard for Webflow projects, adds real value to the conversion                        |
| GSAP for animations                   | Most powerful animation library, free tier covers needs                                          |
| DM Sans + JetBrains Mono fonts        | Closest free alternatives to Webflow's brand typography                                          |

## Errors Encountered

| Error      | Attempt | Resolution |
| ---------- | ------- | ---------- |
| (none yet) | —       | —          |

## Notes

- Webflow clipboard format uses `application/json` MIME type — this is non-negotiable
- XscpData JSON: `nodes[]` hold elements, `styles[]` hold classes, they're linked by UUID refs
- Client-First: underscore = custom class folder, no underscore = utility class
- Vercel free tier prohibits commercial use — plan for Pro if monetization happens
- Research gathered from Webflow forums, Sygnal docs, Flowout guides, BMG Studio, Finsweet docs
