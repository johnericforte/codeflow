// src/lib/converter/clipboard.ts
// Copies Webflow XscpData JSON to the clipboard.
// Webflow Designer reads the application/json MIME slot specifically.
// navigator.clipboard.write() blocks non-safe MIME types, but
// execCommand('copy') + clipboardData.setData() can write application/json
// when called within a user gesture (button click).

import type { WebflowXscpData } from "./types";

export async function copyToWebflowClipboard(data: WebflowXscpData): Promise<void> {
  const json = JSON.stringify(data);

  // Primary: execCommand copy — can write application/json MIME type
  // (navigator.clipboard.write() blocks non-safe MIME types in all browsers)
  const execResult = await new Promise<boolean>((resolve) => {
    const handler = (e: ClipboardEvent) => {
      try {
        e.clipboardData?.setData("application/json", json);
        e.clipboardData?.setData("text/plain", json); // belt-and-suspenders
        e.preventDefault();
        resolve(true);
      } catch {
        resolve(false);
      }
    };
    document.addEventListener("copy", handler, { once: true });
    const success = document.execCommand("copy");
    if (!success) {
      document.removeEventListener("copy", handler);
      resolve(false);
    }
  });

  if (execResult) return;

  // Fallback: writeText — works everywhere but only writes text/plain.
  // Webflow may not read this, but it's better than a hard failure.
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(json);
  }
}
