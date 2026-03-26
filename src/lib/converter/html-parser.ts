// src/lib/converter/html-parser.ts
// Parses an HTML string into a flat list of Webflow nodes.
// Uses the browser's DOMParser — must run client-side only.

import { generateUUID } from "@/lib/utils/uuid";
import type { WebflowNode, WebflowNodeType, WebflowNodeData } from "./types";

// ─── Tag → Webflow node type ─────────────────────────────────────────────────

const TAG_TYPE_MAP: Record<string, WebflowNodeType> = {
  div: "Block",
  section: "Block",
  article: "Block",
  header: "Block",
  footer: "Block",
  main: "Block",
  nav: "Block",
  aside: "Block",
  span: "Block",
  figure: "Block",
  figcaption: "Block",
  h1: "Heading",
  h2: "Heading",
  h3: "Heading",
  h4: "Heading",
  h5: "Heading",
  h6: "Heading",
  p: "Paragraph",
  a: "Link",
  img: "Image",
  ul: "List",
  ol: "List",
  li: "ListItem",
  form: "FormForm",
  button: "FormButton",
  input: "FormTextInput",
};

const HEADING_LEVEL: Record<string, number> = {
  h1: 1,
  h2: 2,
  h3: 3,
  h4: 4,
  h5: 5,
  h6: 6,
};

// ─── Recursive DOM walker ────────────────────────────────────────────────────

export interface ParsedHTMLResult {
  nodes: WebflowNode[];
  rootIds: string[]; // IDs of top-level nodes (for XscpData assembly)
  warnings: string[];
}

function walkElement(el: Element, allNodes: WebflowNode[], warnings: string[]): string {
  const tag = el.tagName.toLowerCase();
  const id = generateUUID();
  const type: WebflowNodeType = TAG_TYPE_MAP[tag] ?? "Block";

  // Collect class names — an element may have multiple classes
  const classNames = Array.from(el.classList);

  // Build node data
  const data: WebflowNodeData = {
    tag,
    text: false,
    xattr: [],
    search: { exclude: false },
    visibility: { conditions: [] },
    displayName: "",
    attr: {},
  };

  if (type === "Heading") {
    data.level = HEADING_LEVEL[tag];
  }

  if (type === "Link") {
    const href = el.getAttribute("href") ?? "";
    const target = el.getAttribute("target") ?? "";
    data.link = {
      url: href,
      mode: href.startsWith("#") ? "section" : "external",
      ...(target ? { target } : {}),
    };
    if (href) data.attr = { href };
  }

  if (type === "Image") {
    const src = el.getAttribute("src") ?? "";
    const alt = el.getAttribute("alt") ?? "";
    data.img = { url: src, alt };
  }

  // Handle generic attributes (id, data-*, aria-*, etc.)
  const genericAttrs: Record<string, string> = {};
  for (const attr of Array.from(el.attributes)) {
    if (!["class", "href", "src", "alt", "target"].includes(attr.name)) {
      genericAttrs[attr.name] = attr.value;
    }
  }
  if (Object.keys(genericAttrs).length > 0) {
    data.attr = { ...data.attr, ...genericAttrs };
  }

  // Walk child elements (element nodes only — text nodes handled separately)
  const childIds: string[] = [];

  for (const child of Array.from(el.childNodes)) {
    if (child.nodeType === Node.ELEMENT_NODE) {
      const childId = walkElement(child as Element, allNodes, warnings);
      childIds.push(childId);
    } else if (child.nodeType === Node.TEXT_NODE) {
      const text = child.textContent?.trim() ?? "";
      if (text) {
        // Text nodes become simple Block nodes with data.text = true
        const textId = generateUUID();
        allNodes.push({
          _id: textId,
          type: "Block",
          tag: "span",
          classes: [],
          children: [],
          data: {
            tag: "span",
            text: true,
            xattr: [],
            search: { exclude: false },
            visibility: { conditions: [] },
            displayName: text.slice(0, 50),
            attr: {},
          },
        });
        childIds.push(textId);
      }
    }
  }

  // classes array is populated later by webflow-builder (needs style UUIDs)
  // We temporarily store class names in displayName for builder lookup
  const node: WebflowNode = {
    _id: id,
    type,
    tag,
    classes: [], // filled by webflow-builder
    children: childIds,
    data: {
      ...data,
      // Store original class names for builder to look up style UUIDs
      displayName: classNames.join(" "),
    },
  };

  if (type === "Heading" && data.level !== undefined) {
    node.data.level = data.level;
  }

  allNodes.push(node);
  return id;
}

// ─── Public API ──────────────────────────────────────────────────────────────

export function parseHtml(html: string): ParsedHTMLResult {
  const warnings: string[] = [];
  const allNodes: WebflowNode[] = [];

  if (!html.trim()) {
    return { nodes: [], rootIds: [], warnings: ["HTML input is empty"] };
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const body = doc.body;

  const rootIds: string[] = [];
  for (const child of Array.from(body.childNodes)) {
    if (child.nodeType === Node.ELEMENT_NODE) {
      const id = walkElement(child as Element, allNodes, warnings);
      rootIds.push(id);
    }
  }

  if (rootIds.length === 0) {
    warnings.push("No valid HTML elements found");
  }

  return { nodes: allNodes, rootIds, warnings };
}
