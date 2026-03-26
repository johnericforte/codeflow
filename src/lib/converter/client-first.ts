// src/lib/converter/client-first.ts
// Validates and transforms class names to follow Finsweet Client-First conventions.
// Reference: https://finsweet.com/client-first/docs/classes-strategy-1
//
// Rules:
//   Custom classes  → underscore separator: section_hero, hero_content
//   Utility classes → hyphen only (no underscore): text-size-large, margin-top-medium
//   General → specific: hero_heading-large (NOT large-heading-hero)
//   No abbreviations: section_header (NOT sec-h)

// HTML tag → default Client-First base name
const TAG_CF_DEFAULTS: Record<string, string> = {
  section: "section",
  header: "section_header",
  footer: "section_footer",
  nav: "navbar_component",
  main: "page_main",
  article: "article",
  aside: "sidebar",
  form: "form_component",
  ul: "list",
  ol: "list",
  li: "list_item",
  figure: "figure",
  figcaption: "figure_caption",
};

// Webflow utility class names that should not get the folder prefix
const UTILITY_PATTERNS = [
  /^text-/,
  /^margin-/,
  /^padding-/,
  /^background-/,
  /^border-/,
  /^display-/,
  /^flex-/,
  /^grid-/,
  /^gap-/,
  /^width-/,
  /^height-/,
  /^overflow-/,
  /^position-/,
  /^z-index-/,
  /^opacity-/,
  /^container-/,
  /^button$/,
  /^is-/,
  /^hide$/,
  /^show$/,
];

export function isUtilityClass(name: string): boolean {
  return UTILITY_PATTERNS.some((pattern) => pattern.test(name));
}

export function isClientFirstCompliant(name: string): boolean {
  // Utility classes: hyphens only, no underscore
  if (isUtilityClass(name)) return !name.includes("_");
  // Custom classes: must have exactly one underscore (folder_name)
  const parts = name.split("_");
  return parts.length === 2 && parts[0].length > 0 && parts[1].length > 0;
}

// Given a raw class name, return the most Client-First version we can infer.
// If the name is already CF-compliant, return it unchanged.
export function toClientFirst(rawName: string): string {
  // Already has underscore folder structure — leave as-is
  if (rawName.includes("_")) return rawName;

  // Known utility pattern — leave as-is
  if (isUtilityClass(rawName)) return rawName;

  // Generic single word (e.g. "hero", "wrapper", "content") — treat as
  // a component name and let the context add the folder in the builder.
  return rawName;
}

// Generate a sensible CF class name for an element that has no classes.
// Uses tag name and an optional context hint (parent class name).
export function generateCFName(tag: string, context?: string): string {
  const base = TAG_CF_DEFAULTS[tag];
  if (base) return base;

  // Use context (parent class) as the folder prefix
  if (context) {
    const folder = context.split("_")[0] || context;
    return `${folder}_${tag}`;
  }

  return `${tag}_component`;
}
