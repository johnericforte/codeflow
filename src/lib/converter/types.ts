// src/lib/converter/types.ts
// TypeScript types for Webflow's @webflow/XscpData clipboard format
// Reference: https://www.sygnal.com/lessons/webflow-clipboard-format

// ============================================================
// WEBFLOW NODE TYPES
// ============================================================

export type WebflowNodeType =
  | "Block"
  | "Heading"
  | "Paragraph"
  | "Link"
  | "Image"
  | "List"
  | "ListItem"
  | "FormForm"
  | "FormButton"
  | "FormTextInput"
  | "RichText"
  | "Section"
  | "Container"
  | "Row"
  | "Column"
  | "NavbarWrapper"
  | "NavbarBrand"
  | "NavbarMenu"
  | "NavbarLink"
  | "NavbarButton"
  | "CodeBlock";

export interface WebflowNodeData {
  tag?: string;
  text?: boolean;
  xattr?: Array<{ name: string; value: string }>;
  search?: { exclude: boolean };
  visibility?: { conditions: unknown[] };
  displayName?: string;
  attr?: Record<string, string>;
  // Heading level: 1–6
  level?: number;
  // Image specific
  img?: {
    id?: string;
    url?: string;
    alt?: string;
    width?: number;
    height?: number;
  };
  // Link specific
  link?: {
    url?: string;
    target?: string;
    mode?: "external" | "page" | "section" | "email" | "phone";
  };
  // Custom code embed
  script?: {
    head?: string;
    body?: string;
  };
}

export interface WebflowNode {
  _id: string;
  type: WebflowNodeType;
  tag: string;
  classes: string[]; // Array of style _id UUIDs
  children: string[]; // Array of child node _id UUIDs
  data: WebflowNodeData;
}

// ============================================================
// WEBFLOW STYLE TYPES
// ============================================================

// Webflow responsive breakpoint variant names
export type WebflowVariant = "medium" | "small" | "tiny";

// styleLess format: "display: flex; padding: 2rem;" (flat semicolon-separated CSS)
export type StyleLess = string;

export interface WebflowStyleVariants {
  medium?: { styleLess: StyleLess };
  small?: { styleLess: StyleLess };
  tiny?: { styleLess: StyleLess };
}

export interface WebflowStyle {
  _id: string;
  fake: boolean;
  type: "class";
  name: string; // Client-First class name, e.g. "section_hero"
  namespace: string;
  comb: string;
  styleLess: StyleLess;
  variants: WebflowStyleVariants;
  children: string[];
  selector: string | null;
}

// ============================================================
// WEBFLOW XCSPDATA ROOT FORMAT
// ============================================================

export interface WebflowPayload {
  nodes: WebflowNode[];
  styles: WebflowStyle[];
  assets: unknown[];
  ix1: unknown[];
  ix2: {
    interactions: unknown[];
    events: unknown[];
    actionLists: unknown[];
  };
}

export interface WebflowMeta {
  unlinkedSymbolCount: number;
  droppedLinks: number;
  dynBindRemovedCount: number;
  dynListBindRemovedCount: number;
  paginationRemovedCount: number;
}

export interface WebflowXscpData {
  type: "@webflow/XscpData";
  payload: WebflowPayload;
  meta: WebflowMeta;
}

// ============================================================
// CONVERTER INPUT/OUTPUT TYPES
// ============================================================

export interface ConvertInput {
  html: string;
  css: string;
  js: string;
}

export interface ConvertResult {
  success: boolean;
  data?: WebflowXscpData;
  error?: string;
  warnings?: string[];
}

// Internal: CSS media query breakpoint mapping
export interface BreakpointMap {
  [maxWidth: string]: WebflowVariant; // e.g. "991" → "medium"
}

export const WEBFLOW_BREAKPOINTS: BreakpointMap = {
  "991": "medium",
  "767": "small",
  "478": "tiny",
};

// Internal: class registry for deduplication
export interface ClassRegistry {
  [className: string]: string; // className → UUID
}

// Internal: parsed CSS rule
export interface CSSRule {
  selector: string;
  properties: Record<string, string>;
  variant?: WebflowVariant; // Set if inside a @media block
}
