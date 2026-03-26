"use client";

// EditorPanel.tsx — Main editor container: tabs + CodeMirror + convert CTA

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import EditorTabs from "./EditorTabs";
import ConvertButton from "./ConvertButton";
import type { EditorLanguage } from "./CodeEditor";

// Dynamically import CodeEditor to avoid SSR issues with CodeMirror
const CodeEditor = dynamic(() => import("./CodeEditor"), {
  ssr: false,
  loading: () => <EditorSkeleton />,
});

// ─── Sample starter code ────────────────────────────────────────────────────

const SAMPLE_HTML = `<section class="hero">
  <div class="hero_wrapper">
    <div class="hero_content">
      <h1 class="hero_heading">Build faster in Webflow</h1>
      <p class="hero_text">
        Paste your HTML and CSS, click convert, and paste
        directly into Webflow Designer.
      </p>
      <div class="hero_buttons">
        <a href="#" class="button is-primary">Get Started</a>
        <a href="#" class="button is-secondary">Learn More</a>
      </div>
    </div>
  </div>
</section>`;

const SAMPLE_CSS = `.hero {
  display: flex;
  align-items: center;
  min-height: 100vh;
  padding: 6rem 2rem;
  background-color: #0a0e17;
}

.hero_wrapper {
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.hero_content {
  max-width: 640px;
}

.hero_heading {
  font-size: 4rem;
  font-weight: 700;
  line-height: 1.1;
  color: #f9fafb;
  margin-bottom: 1.5rem;
}

.hero_text {
  font-size: 1.25rem;
  line-height: 1.7;
  color: #9ca3af;
  margin-bottom: 2.5rem;
}

.hero_buttons {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.button {
  display: inline-flex;
  align-items: center;
  padding: 0.875rem 1.75rem;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s ease;
}

.button.is-primary {
  background-color: #2463eb;
  color: #ffffff;
}

.button.is-secondary {
  background-color: transparent;
  color: #f9fafb;
  border: 1px solid #374151;
}

@media (max-width: 991px) {
  .hero {
    padding: 4rem 1.5rem;
    min-height: auto;
  }
  .hero_heading {
    font-size: 2.75rem;
  }
}

@media (max-width: 767px) {
  .hero {
    padding: 3rem 1rem;
  }
  .hero_heading {
    font-size: 2.25rem;
  }
  .hero_buttons {
    flex-direction: column;
  }
}

@media (max-width: 478px) {
  .hero_heading {
    font-size: 1.875rem;
  }
  .hero_text {
    font-size: 1rem;
  }
}`;

const SAMPLE_JS = `// Optional: add interactivity to your component
// Codeflow will embed this as a Webflow Custom Code block

document.addEventListener('DOMContentLoaded', () => {
  const buttons = document.querySelectorAll('.button');

  buttons.forEach((btn) => {
    btn.addEventListener('mouseenter', () => {
      btn.style.transform = 'translateY(-2px)';
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
});`;

// ─── Toast state type ────────────────────────────────────────────────────────

type ToastState = { type: "success"; message: string } | { type: "error"; message: string } | null;

// ─── Component ───────────────────────────────────────────────────────────────

export default function EditorPanel() {
  const [activeTab, setActiveTab] = useState<EditorLanguage>("html");
  const [htmlCode, setHtmlCode] = useState(SAMPLE_HTML);
  const [cssCode, setCssCode] = useState(SAMPLE_CSS);
  const [jsCode, setJsCode] = useState(SAMPLE_JS);
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
      // Conversion engine is built in Phase 3.
      // For now, show a placeholder success to validate the clipboard flow.
      await new Promise((r) => setTimeout(r, 600)); // simulate async work
      showToast({ type: "success", message: "Copied! Paste into Webflow Designer (Ctrl+V)" });
    } catch {
      showToast({ type: "error", message: "Conversion failed. Check your HTML/CSS syntax." });
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
