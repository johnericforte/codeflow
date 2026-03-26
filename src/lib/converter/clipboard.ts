// src/lib/converter/clipboard.ts
// Copies Webflow XscpData JSON to the clipboard.
// Webflow Designer reads clipboard text and parses the JSON itself,
// so writing as text/plain is sufficient and avoids browser MIME restrictions.

import type { WebflowXscpData } from "./types";

export async function copyToWebflowClipboard(data: WebflowXscpData): Promise<void> {
  const json = JSON.stringify(data);

  // Modern path: writeText (all modern browsers, no MIME restrictions)
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(json);
    return;
  }

  // Fallback: synthetic copy event (older browsers / insecure contexts)
  await new Promise<void>((resolve, reject) => {
    const handler = (e: ClipboardEvent) => {
      try {
        e.clipboardData?.setData("text/plain", json);
        e.preventDefault();
        resolve();
      } catch (err) {
        reject(err);
      }
    };
    document.addEventListener("copy", handler, { once: true });
    const success = document.execCommand("copy");
    if (!success) {
      document.removeEventListener("copy", handler);
      reject(new Error("execCommand copy failed"));
    }
  });
}
