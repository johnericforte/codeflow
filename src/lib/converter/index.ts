// src/lib/converter/index.ts
// Main orchestrator: HTML + CSS + JS → @webflow/XscpData → clipboard

import { parseCss } from "./css-parser";
import { parseHtml } from "./html-parser";
import { buildXscpData } from "./webflow-builder";
import { copyToWebflowClipboard } from "./clipboard";
import type { ConvertInput, ConvertResult } from "./types";

export async function convert(input: ConvertInput): Promise<ConvertResult> {
  const warnings: string[] = [];

  try {
    // 1. Parse CSS → rule map (breakpoints, properties per class)
    const cssMap = parseCss(input.css);

    // 2. Parse HTML → flat node list + root IDs
    const { nodes, rootIds, warnings: htmlWarnings } = parseHtml(input.html);
    warnings.push(...htmlWarnings);

    if (nodes.length === 0) {
      return {
        success: false,
        error: "No HTML elements found to convert.",
        warnings,
      };
    }

    // 3. Build XscpData JSON (assigns style UUIDs, handles JS embed)
    const data = buildXscpData(nodes, rootIds, cssMap, input.js, warnings);

    // 4. Copy to clipboard with application/json MIME type
    await copyToWebflowClipboard(data);

    return { success: true, data, warnings };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Conversion failed",
      warnings,
    };
  }
}

// Re-export types for consumers
export type { ConvertInput, ConvertResult } from "./types";
