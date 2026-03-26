# Findings & Decisions

## Requirements
- Free, open-source HTML/CSS/JS → Webflow converter
- Code editor with 3 tabs (HTML/CSS/JS), default to HTML
- Convert button that transforms code into Webflow-compatible clipboard JSON
- Output follows Finsweet Client-First naming convention
- Converted components are mobile responsive (breakpoint variants)
- One-click copy to clipboard — user pastes directly into Webflow Designer
- Webflow-inspired color palette with unique branding
- Logo: `</>` icon + "Codeflow" wordmark
- Animated, minimalist landing page
- Hosted on Vercel, code on GitHub
- Maximize free/open-source tools, minimize cost

## Research Findings

### Webflow XscpData Clipboard Format
- Webflow uses `@webflow/XscpData` JSON format for clipboard copy/paste
- MIME type MUST be `application/json` — not `text/plain`
- JSON structure has: `type`, `payload` (nodes, styles, assets, ix1, ix2), `meta`
- **nodes[]**: Each HTML element → node with `_id` (UUID), `tag`, `type`, `classes[]` (UUID refs), `children[]` (UUID refs), `data`
- **styles[]**: Each CSS class → style with `_id` (UUID), `name`, `styleLess` (flat CSS string), `variants` (responsive)
- **variants**: `medium` = tablet ≤991px, `small` = mobile landscape ≤767px, `tiny` = mobile portrait ≤478px
- `styleLess` format: `"display: flex; padding: 2rem;"` — semicolon-separated CSS string, NOT object notation
- `meta` object: `unlinkedSymbolCount`, `droppedLinks`, `dynBindRemovedCount`, `dynListBindRemovedCount`, `paginationRemovedCount`
- Node types: `Block` (div), `Heading` (h1-h6), `Paragraph` (p), `Link` (a), `Image` (img), `List` (ul/ol), `ListItem` (li)
- Classes array in nodes references style `_id` UUIDs, NOT class name strings

### Clipboard API Implementation
- Modern approach: `ClipboardItem` API with `Blob`
  ```js
  const blob = new Blob([jsonString], { type: 'application/json' });
  const item = new ClipboardItem({ 'application/json': blob });
  await navigator.clipboard.write([item]);
  ```
- Fallback: `document.execCommand('copy')` with synthetic copy event listener
- Browser support: ClipboardItem works in Chrome, Edge, Safari; Firefox has limited support
- Need HTTPS for Clipboard API (Vercel provides this)

### Finsweet Client-First Naming Convention
- **Custom classes** use underscore to create folders: `section_hero`, `hero_content`
- **Utility classes** use hyphens (no underscore): `text-size-large`, `margin-bottom-medium`
- **General-to-specific** naming: `hero_heading-large` NOT `large-heading-hero`
- **No abbreviations**: `section_header` NOT `sec-h`
- **Page structure**: `page-wrapper` → `section_[name]` → `padding-global` → `container-large` → content
- **Spacing system**: `padding-section-large`, `padding-section-medium`, `margin-top-large`
- **Typography**: Inherit tag styles when possible, use `heading-style-h2`, `text-size-regular` utilities
- **Colors**: `background-color-primary`, `text-color-secondary`

### Webflow Brand & Design Reference
- Primary brand color: `#146EF5` (vibrant blue)
- Secondary: `#080808` (deep black)
- Brand font: "WF Visual Sans" — geometric sans-serif inspired by ITC Avant Garde and Futura
- Closest free alternative: DM Sans (Google Fonts)
- Brand philosophy: Lead with blue, black, white; monochromatic palette per asset
- Designer UI: Dark theme, clean lines, professional

### Hosting Comparison
- **Vercel**: Free tier = 100GB bandwidth, 6000 build min/month, BUT hobby plan prohibits commercial use
- **Netlify**: Free tier = 100GB bandwidth, 300 build min/month, allows commercial use on free tier
- **Decision**: Using Vercel for Next.js optimization; will upgrade to Pro ($20/mo) if/when monetizing
- Both support auto-deploy from GitHub, preview deploys on PRs, custom domains

### Tech Stack Research
- **CodeMirror 6**: MIT license, ~150KB gzipped, supports HTML/CSS/JS, customizable themes
- **GSAP**: Most powerful JS animation library, free for standard use
- **Framer Motion**: React-native animation library, could be alternative to GSAP for React project
- **Lenis**: Smooth scrolling library by Studio Freight (MIT)
- **Three.js**: Optional for hero background effects, may be overkill — CSS mesh gradients could suffice

## Technical Decisions
| Decision | Rationale |
|----------|-----------|
| Next.js 14+ App Router | File-based routing, server components for SEO, image optimization for later features |
| TypeScript strict mode | XscpData JSON is complex — types prevent bugs in node/style/variant construction |
| pnpm (not npm) | Faster installs, strict isolation prevents phantom deps, disk-efficient store, `engine-strict` blocks accidental npm use |
| CodeMirror 6 over Monaco | Lighter weight (~150KB vs ~2MB), MIT license, better mobile support |
| Tailwind CSS + CSS Variables | Utility-first speeds up development, built-in responsive/dark mode, tree-shaken in production; CSS variables for design tokens |
| GSAP or Framer Motion | Framer Motion is more React-native; GSAP is more powerful — decide during Phase 4 |
| DM Sans + JetBrains Mono | Free Google Fonts closest to Webflow's proprietary WF Visual Sans |
| Client-side only conversion | Zero server cost, sub-2s conversion, no data leaves user's browser |

## Issues Encountered
| Issue | Resolution |
|-------|------------|
| (none yet) | — |

## Resources
- Webflow XscpData format: https://discourse.webflow.com/t/how-to-convert-html-sections-to-webflow-xscpdata-type-json-format/203987
- Copy JSON to Webflow clipboard: https://github.com/finsweet/ts-utils/blob/master/src/components/CopyJSONButton.ts
- Webflow clipboard inspector: https://evercoder.github.io/clipboard-inspector/
- Client-First docs: https://finsweet.com/client-first/docs/intro
- Client-First classes strategy: https://finsweet.com/client-first/docs/classes-strategy-1
- Webflow brand guidelines: https://brand.webflow.com/design-guidelines
- Webflow brand assets/colors: https://brand.webflow.com/brand-assets
- BMG Studio clipboard guide: https://www.bmg.studio/blog/how-to-create-your-own-relume-library-ripoff
- Flowout copy/paste guide: https://www.flowout.com/blog/create-your-own-component-sharing-app
- Sygnal clipboard format docs: https://www.sygnal.com/lessons/webflow-clipboard-format
- Reference tool (403'd): https://moden.club/toolkit/html-to-webflow

## Visual/Browser Findings
- Webflow Designer uses dark UI with blue (#146EF5) accent
- WF Visual Sans is geometric, clean, slightly wider than typical sans-serif
- XscpData JSON example shows UUIDs as 36-char hyphenated strings (e.g., "c5189161-bbea-6043-8252-2345d0b3022f")
- Webflow styles use `styleLess` key (not `style` or `css`) for flat CSS strings
- Node `type` values observed: "Block", "Heading", "Paragraph", "Image", "Link", "List", "ListItem", "FormForm", "FormButton"

---
*Update this file after every 2 view/browser/search operations*
*This prevents visual information from being lost*
