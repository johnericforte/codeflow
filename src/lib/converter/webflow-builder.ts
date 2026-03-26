// src/lib/converter/webflow-builder.ts
// Assembles a complete @webflow/XscpData structure from parsed HTML nodes
// and the CSS rule map.

import { generateUUID } from "@/lib/utils/uuid";
import { toStyleLess, type CSSRuleMap } from "./css-parser";
import { generateCFName } from "./client-first";
import type { WebflowNode, WebflowStyle, WebflowXscpData, WebflowStyleVariants } from "./types";

// ─── Style registry ───────────────────────────────────────────────────────────
// Tracks which CSS class names have already been converted to Webflow styles,
// so shared classes (e.g. "button" used on multiple elements) only appear once.

interface StyleRegistry {
  // cssKey (e.g. "button" or "button.is-primary") → Webflow style _id
  byKey: Map<string, string>;
  // className (single name) → Webflow style _id
  byName: Map<string, string>;
  styles: WebflowStyle[];
}

function makeRegistry(): StyleRegistry {
  return { byKey: new Map(), byName: new Map(), styles: [] };
}

// Build a WebflowStyle from a CSS rule map entry.
function buildStyle(
  name: string,
  cssKey: string,
  cssMap: CSSRuleMap,
  registry: StyleRegistry,
  comboBaseId?: string
): WebflowStyle {
  const id = generateUUID();
  const entry = cssMap.get(cssKey);

  const styleLess = entry ? toStyleLess(entry.base) : "";

  const variants: WebflowStyleVariants = {};
  if (entry?.variants.medium && Object.keys(entry.variants.medium).length > 0) {
    variants.medium = { styleLess: toStyleLess(entry.variants.medium) };
  }
  if (entry?.variants.small && Object.keys(entry.variants.small).length > 0) {
    variants.small = { styleLess: toStyleLess(entry.variants.small) };
  }
  if (entry?.variants.tiny && Object.keys(entry.variants.tiny).length > 0) {
    variants.tiny = { styleLess: toStyleLess(entry.variants.tiny) };
  }

  return {
    _id: id,
    fake: false,
    type: "class",
    name,
    namespace: "",
    comb: comboBaseId ?? "",
    styleLess,
    variants,
    children: [],
    selector: null,
  };
}

// Given an element's class list (e.g. ["button", "is-primary"]),
// return the ordered list of Webflow style _ids to assign to that node.
// Creates styles as needed and registers them.
function resolveStyleIds(
  classNames: string[],
  cssMap: CSSRuleMap,
  registry: StyleRegistry
): string[] {
  if (classNames.length === 0) return [];

  const ids: string[] = [];

  // First class is always the "base" class
  const baseClassName = classNames[0];
  const baseCssKey = baseClassName;

  let baseId = registry.byName.get(baseClassName);
  if (!baseId) {
    const style = buildStyle(baseClassName, baseCssKey, cssMap, registry);
    baseId = style._id;
    registry.byKey.set(baseCssKey, baseId);
    registry.byName.set(baseClassName, baseId);
    registry.styles.push(style);
  }
  ids.push(baseId);

  // Subsequent classes are combo classes (modifiers on the base)
  for (let i = 1; i < classNames.length; i++) {
    const comboName = classNames[i];
    // Compound CSS key for lookup: "button.is-primary"
    const compoundKey = `${baseClassName}.${comboName}`;
    // Also try just the modifier name as a key
    const simpleKey = comboName;

    const registryKey = `${baseClassName}__${comboName}`;
    let comboId = registry.byKey.get(registryKey);

    if (!comboId) {
      // Look for compound CSS rule first, then fall back to simple key
      const cssKey = cssMap.has(compoundKey) ? compoundKey : simpleKey;
      const style = buildStyle(comboName, cssKey, cssMap, registry, baseId);
      comboId = style._id;
      registry.byKey.set(registryKey, comboId);
      registry.styles.push(style);
    }

    ids.push(comboId);
  }

  return ids;
}

// ─── Node finalizer ───────────────────────────────────────────────────────────
// html-parser stores class names in displayName temporarily.
// This pass assigns real style UUIDs and clears displayName.

function finalizeNodes(
  nodes: WebflowNode[],
  cssMap: CSSRuleMap,
  registry: StyleRegistry,
  warnings: string[]
): void {
  for (const node of nodes) {
    const rawDisplayName = node.data.displayName ?? "";
    const classNames = rawDisplayName ? rawDisplayName.split(/\s+/).filter(Boolean) : [];

    if (classNames.length === 0) {
      // No classes — generate a Client-First name based on tag
      const cfName = generateCFName(node.tag);
      const style = buildStyle(cfName, cfName, cssMap, registry);
      registry.byName.set(cfName, style._id);
      registry.styles.push(style);
      node.classes = [style._id];
      warnings.push(`<${node.tag}> had no classes — assigned "${cfName}" (edit in Webflow)`);
    } else {
      node.classes = resolveStyleIds(classNames, cssMap, registry);
    }

    // Remove the temporary class name storage — don't leave empty string on the node
    delete node.data.displayName;
  }
}

// ─── JS embed ────────────────────────────────────────────────────────────────

function buildJsEmbedNode(js: string): WebflowNode {
  return {
    _id: generateUUID(),
    type: "CodeBlock",
    tag: "div",
    classes: [],
    children: [],
    data: {
      tag: "div",
      xattr: [],
      search: { exclude: false },
      visibility: { conditions: [] },
      displayName: "Custom Code",
      attr: {},
      script: {
        head: "",
        body: `<script>\n${js.trim()}\n</script>`,
      },
    },
  };
}

// ─── Public API ──────────────────────────────────────────────────────────────

export function buildXscpData(
  nodes: WebflowNode[],
  rootIds: string[],
  cssMap: CSSRuleMap,
  js: string,
  warnings: string[]
): WebflowXscpData {
  const registry = makeRegistry();

  // First pass: build all CSS classes referenced in nodes that exist in cssMap.
  // Pre-register any CSS classes not referenced by any element
  // (in case the user wrote CSS for classes not in their HTML snippet).
  cssMap.forEach((_value, key) => {
    const firstName = key.split(".")[0];
    if (!registry.byName.has(firstName) && !key.includes(".")) {
      const style = buildStyle(firstName, key, cssMap, registry);
      registry.byKey.set(key, style._id);
      registry.byName.set(firstName, style._id);
      registry.styles.push(style);
    }
  });

  // Second pass: assign style UUIDs to all parsed nodes
  finalizeNodes(nodes, cssMap, registry, warnings);

  // Optionally append JS as a custom code embed node
  const finalNodes = [...nodes];
  const finalRootIds = [...rootIds];

  if (js.trim()) {
    const jsNode = buildJsEmbedNode(js);
    finalNodes.push(jsNode);
    finalRootIds.push(jsNode._id);
  }

  return {
    type: "@webflow/XscpData",
    payload: {
      nodes: finalNodes,
      styles: registry.styles,
      assets: [],
      ix1: [],
      ix2: { interactions: [], events: [], actionLists: [] },
    },
    meta: {
      unlinkedSymbolCount: 0,
      droppedLinks: 0,
      dynBindRemovedCount: 0,
      dynListBindRemovedCount: 0,
      paginationRemovedCount: 0,
    },
  };
}
