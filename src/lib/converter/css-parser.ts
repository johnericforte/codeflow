// src/lib/converter/css-parser.ts
// Parses a CSS string into a structured rule map.
// Handles @media queries → Webflow responsive variants.

import { WEBFLOW_BREAKPOINTS, type WebflowVariant } from "./types";

// Per-class parsed data: base styles + responsive variant overrides
export interface ParsedClassData {
  base: Record<string, string>;
  variants: {
    medium?: Record<string, string>;
    small?: Record<string, string>;
    tiny?: Record<string, string>;
  };
  // If this was parsed from a compound selector (e.g. .button.is-primary),
  // baseClass holds the first class name (the "parent" combo class)
  baseClass?: string;
}

// Map from CSS class name (or "base.modifier" for combos) → parsed data
export type CSSRuleMap = Map<string, ParsedClassData>;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function stripComments(css: string): string {
  return css.replace(/\/\*[\s\S]*?\*\//g, "");
}

function parseDeclarations(block: string): Record<string, string> {
  const props: Record<string, string> = {};
  for (const decl of block.split(";")) {
    const colonIdx = decl.indexOf(":");
    if (colonIdx === -1) continue;
    const prop = decl.slice(0, colonIdx).trim();
    const value = decl.slice(colonIdx + 1).trim();
    if (prop && value) props[prop] = value;
  }
  return props;
}

// Extract class names from a selector.
// ".hero_content"          → [["hero_content"]]           single class
// ".button.is-primary"     → [["button", "is-primary"]]   compound (combo)
// ".hero, .card"           → [["hero"], ["card"]]         grouped selectors
function extractClassGroups(selector: string): string[][] {
  return selector.split(",").map((part) => {
    const matches = part.trim().match(/\.(-?[a-zA-Z_][a-zA-Z0-9_-]*)/g);
    return matches ? matches.map((m) => m.slice(1)) : [];
  });
}

// Use bracket-counting to reliably extract @media block content and condition.
function extractMediaBlocks(css: string): Array<{ condition: string; content: string }> {
  const blocks: Array<{ condition: string; content: string }> = [];
  let i = 0;

  while (i < css.length) {
    const atIdx = css.indexOf("@media", i);
    if (atIdx === -1) break;

    const openBrace = css.indexOf("{", atIdx);
    if (openBrace === -1) break;

    const condition = css.slice(atIdx + 6, openBrace).trim();

    // Count brackets to find the matching closing brace
    let depth = 1;
    let j = openBrace + 1;
    while (j < css.length && depth > 0) {
      if (css[j] === "{") depth++;
      else if (css[j] === "}") depth--;
      j++;
    }

    blocks.push({ condition, content: css.slice(openBrace + 1, j - 1) });
    i = j;
  }

  return blocks;
}

// Strip all @media blocks from a CSS string, leaving only top-level rules.
function stripMediaBlocks(css: string): string {
  let result = css;
  let i = 0;

  while (i < result.length) {
    const atIdx = result.indexOf("@media", i);
    if (atIdx === -1) break;

    const openBrace = result.indexOf("{", atIdx);
    if (openBrace === -1) break;

    let depth = 1;
    let j = openBrace + 1;
    while (j < result.length && depth > 0) {
      if (result[j] === "{") depth++;
      else if (result[j] === "}") depth--;
      j++;
    }

    result = result.slice(0, atIdx) + result.slice(j);
    i = atIdx;
  }

  return result;
}

// ─── Rule parser ─────────────────────────────────────────────────────────────

function applyRules(cssBlock: string, map: CSSRuleMap, variant: WebflowVariant | undefined): void {
  // Simple rule regex: captures selector and declaration block
  const ruleRegex = /([^{@][^{]*)\{([^}]*)\}/g;
  let match: RegExpExecArray | null;

  while ((match = ruleRegex.exec(cssBlock)) !== null) {
    const selector = match[1].trim();
    const declarations = parseDeclarations(match[2]);

    if (!selector || Object.keys(declarations).length === 0) continue;

    const classGroups = extractClassGroups(selector);

    for (const group of classGroups) {
      if (group.length === 0) continue;

      // Single class: ".hero" → key = "hero"
      // Compound:     ".button.is-primary" → key = "button.is-primary"
      const key = group.join(".");

      if (!map.has(key)) {
        const entry: ParsedClassData = { base: {}, variants: {} };
        if (group.length > 1) entry.baseClass = group[0];
        map.set(key, entry);
      }

      const entry = map.get(key)!;

      if (!variant) {
        Object.assign(entry.base, declarations);
      } else {
        if (!entry.variants[variant]) entry.variants[variant] = {};
        Object.assign(entry.variants[variant]!, declarations);
      }
    }
  }
}

// ─── Public API ──────────────────────────────────────────────────────────────

export function parseCss(css: string): CSSRuleMap {
  const map: CSSRuleMap = new Map();
  const cleaned = stripComments(css);

  // 1. Parse top-level (non-media) rules
  const baseOnly = stripMediaBlocks(cleaned);
  applyRules(baseOnly, map, undefined);

  // 2. Parse @media blocks, map max-width → Webflow variant
  const mediaBlocks = extractMediaBlocks(cleaned);
  for (const { condition, content } of mediaBlocks) {
    const maxWidthMatch = condition.match(/max-width:\s*(\d+)px/);
    if (!maxWidthMatch) continue;

    const variant = WEBFLOW_BREAKPOINTS[maxWidthMatch[1]] as WebflowVariant | undefined;
    if (variant) applyRules(content, map, variant);
  }

  return map;
}

// Serialize a properties object to Webflow's styleLess string format.
// e.g. { display: "flex", padding: "2rem" } → "display: flex; padding: 2rem;"
export function toStyleLess(props: Record<string, string>): string {
  return (
    Object.entries(props)
      .map(([p, v]) => `${p}: ${v}`)
      .join("; ") + ";"
  );
}
