// src/app/page.tsx
// Main page — assembles landing sections

import EditorPanel from "@/components/Editor/EditorPanel";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* ── Placeholder Navbar ──────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-bg-tertiary/60 backdrop-blur-md bg-bg-primary/80">
        <div className="container-content flex items-center justify-between h-14">
          <span className="font-mono text-sm font-semibold text-brand-text">
            <span className="text-primary">&lt;/&gt;</span>
            &nbsp;Codeflow
          </span>
          <span className="text-xs text-brand-subtle font-mono">Code → Webflow, instantly.</span>
        </div>
      </nav>

      {/* ── Hero ────────────────────────────────────────────── */}
      <section className="pt-28 pb-12 text-center container-content">
        <h1 className="font-display text-5xl font-bold tracking-tight gradient-text-hero animate-fade-in-up">
          Code → Webflow, instantly.
        </h1>
        <p className="mt-4 text-brand-muted text-lg max-w-xl mx-auto animate-fade-in-up delay-100">
          Paste your HTML &amp; CSS, click convert, and paste directly into Webflow Designer.
          Client-First naming, responsive breakpoints — done.
        </p>
      </section>

      {/* ── Editor Section ──────────────────────────────────── */}
      <section className="pb-24 px-6">
        <EditorPanel />
      </section>

      {/* ── How It Works (placeholder) ──────────────────────── */}
      <section className="py-16 border-t border-bg-tertiary">
        <div className="container-content text-center">
          <p className="text-brand-subtle text-sm font-mono">
            HOW IT WORKS · FEATURES · FOOTER — coming in Phase 4
          </p>
        </div>
      </section>
    </main>
  );
}
