"use client";

// EditorPanel.tsx — Main editor container: tabs + CodeMirror + convert CTA

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import EditorTabs from "./EditorTabs";
import ConvertButton from "./ConvertButton";
import { STARTER_HTML, STARTER_CSS, STARTER_JS } from "@/lib/editor/starterCode";
import { convert } from "@/lib/converter";
import type { EditorLanguage } from "./CodeEditor";

// Dynamically import CodeEditor to avoid SSR issues with CodeMirror
const CodeEditor = dynamic(() => import("./CodeEditor"), {
  ssr: false,
  loading: () => <EditorSkeleton />,
});

// ─── Toast state type ────────────────────────────────────────────────────────

type ToastState = { type: "success"; message: string } | { type: "error"; message: string } | null;

// ─── Component ───────────────────────────────────────────────────────────────

export default function EditorPanel() {
  const [activeTab, setActiveTab] = useState<EditorLanguage>("html");
  const [htmlCode, setHtmlCode] = useState(STARTER_HTML);
  const [cssCode, setCssCode] = useState(STARTER_CSS);
  const [jsCode, setJsCode] = useState(STARTER_JS);
  const [isConverting, setIsConverting] = useState(false);
  const [toast, setToast] = useState<ToastState>(null);

  const codeByTab: Record<EditorLanguage, string> = {
    html: htmlCode,
    css: cssCode,
    javascript: jsCode,
  };

  const handleChange = useCallback(
    (value: string) => {
      if (activeTab === "html") setHtmlCode(value);
      else if (activeTab === "css") setCssCode(value);
      else setJsCode(value);
    },
    [activeTab]
  );

  const showToast = (next: ToastState) => {
    setToast(next);
    setTimeout(() => setToast(null), 3500);
  };

  const handleConvert = async () => {
    setIsConverting(true);
    try {
      const result = await convert({ html: htmlCode, css: cssCode, js: jsCode });
      if (result.success) {
        const msg =
          result.warnings && result.warnings.length > 0
            ? `Copied! ${result.warnings.length} warning(s) — check Webflow`
            : "Copied! Paste into Webflow Designer (Ctrl+V)";
        showToast({ type: "success", message: msg });
      } else {
        showToast({
          type: "error",
          message: result.error ?? "Conversion failed. Check your HTML/CSS.",
        });
      }
    } catch {
      showToast({ type: "error", message: "Unexpected error during conversion." });
    } finally {
      setIsConverting(false);
    }
  };

  const isEmpty = !htmlCode.trim() && !cssCode.trim();

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Editor card */}
      <div
        className="rounded-xl overflow-hidden border border-bg-tertiary"
        style={{ boxShadow: "0 25px 60px rgba(0,0,0,0.5)" }}
      >
        {/* Window chrome — traffic lights */}
        <div
          className="flex items-center gap-2 px-4 py-3 bg-bg-secondary border-b border-bg-tertiary"
          aria-hidden="true"
        >
          <span className="w-3 h-3 rounded-full bg-red-500 opacity-70" />
          <span className="w-3 h-3 rounded-full bg-yellow-500 opacity-70" />
          <span className="w-3 h-3 rounded-full bg-green-500 opacity-70" />
          <span className="ml-3 text-xs text-brand-subtle font-mono">codeflow — editor</span>
        </div>

        {/* Tab bar */}
        <EditorTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {/* CodeMirror editor */}
        <div className="h-[420px] bg-editor-bg">
          <CodeEditor value={codeByTab[activeTab]} language={activeTab} onChange={handleChange} />
        </div>

        {/* Footer: line count + convert button */}
        <div className="flex items-center justify-between gap-4 px-4 py-3 bg-bg-secondary border-t border-bg-tertiary">
          <p className="text-xs text-brand-subtle font-mono">
            {activeTab.toUpperCase()}&nbsp;·&nbsp;
            {codeByTab[activeTab].split("\n").length} lines
          </p>
          <ConvertButton onClick={handleConvert} isLoading={isConverting} disabled={isEmpty} />
        </div>
      </div>

      {/* Toast notification */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className={[
            "mt-4 mx-auto flex items-center gap-3 w-fit px-5 py-3 rounded-lg text-sm font-medium",
            "animate-fade-in-up",
            toast.type === "success"
              ? "bg-accent/10 border border-accent/30 text-accent"
              : "bg-red-500/10 border border-red-500/30 text-red-400",
          ].join(" ")}
        >
          {toast.type === "success" ? <CheckIcon /> : <ErrorIcon />}
          {toast.message}
        </div>
      )}
    </div>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function EditorSkeleton() {
  return (
    <div
      className="h-full bg-editor-bg flex items-center justify-center"
      role="status"
      aria-label="Loading editor"
    >
      <div className="flex gap-1.5" aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-brand-subtle animate-pulse"
            style={{ animationDelay: `${i * 150}ms` }}
          />
        ))}
      </div>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M3 8L6.5 11.5L13 4.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ErrorIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 5V8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="8" cy="11" r="0.75" fill="currentColor" />
    </svg>
  );
}
