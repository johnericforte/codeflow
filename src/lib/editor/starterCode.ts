// src/lib/editor/starterCode.ts
// Default starter code for each editor tab.
// Uses Client-First naming conventions so the sample doubles as a tutorial.

export const STARTER_HTML = `<section class="hero">
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

export const STARTER_CSS = `.hero {
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

export const STARTER_JS = `// Optional: add interactivity to your component
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
