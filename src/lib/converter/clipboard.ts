// src/lib/converter/clipboard.ts
// Copies Webflow XscpData JSON to the clipboard using the application/json
// MIME type that Webflow Designer reads.

import type { WebflowXscpData } from "./types";

export async function copyToWebflowClipboard(data: WebflowXscpData): Promise<void> {
  const json = JSON.stringify(data);

  // Modern path: ClipboardItem API (Chrome, Edge, Safari 13.1+)
  if (typeof ClipboardItem !== "undefined" && navigator.clipboard?.write) {
    const blob = new Blob([json], { type: "application/json" });
    const item = new ClipboardItem({ "application/json": blob });
    await navigator.clipboard.write([item]);
    return;
  }

  // Fallback: synthetic copy event (Firefox, older browsers)
  await new Promise<void>((resolve, reject) => {
    const handler = (e: ClipboardEvent) => {
      try {
        e.clipboardData?.setData("application/json", json);
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
