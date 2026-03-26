// src/app/page.tsx
// Main page — assembles all sections in order

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Sections will be imported here as components are built:
          <Navbar />
          <Hero />
          <EditorSection />
          <HowItWorks />
          <Features />
          <Footer />
      */}
      <div className="container-content py-24 text-center">
        <p className="font-display text-4xl font-bold gradient-text-hero">
          Codeflow
        </p>
        <p className="mt-4 text-brand-muted">
          Phase 1 complete — components coming next.
        </p>
      </div>
    </main>
  );
}
